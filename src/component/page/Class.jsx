import { useState, useEffect, useContext } from "react";
import { Outlet, useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { UsersContext } from "../contexts/usersContext";
import TopBar from "../ui/TopBar";
import ClassTopbar from "../ui/class/ClassTopbar";
import { PageLayout } from "../ui/class/ClassLayout";  
import { getMyCourses } from "../api/classApi";
export default function Class() {
  const { courseId: paramCourseId } = useParams(); 
  const navigate = useNavigate();
  const { user } = useContext(UsersContext);

  const [selectedCourseId, setSelectedCourseId] = useState(paramCourseId);
  const [courseData, setCourseData] = useState(null);
  const [isCreator, setIsCreator] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedCourseId || !user) return;

    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/courses/${selectedCourseId}`);
        if (response.data.success) {
          setCourseData(response.data.data);
          const isCreator = response.data.data.user?.userId === user.userId;
          setIsCreator(isCreator);

          try {
            // 사용자가 수강 중인 강의 목록 가져오기
            const myCourses = await getMyCourses(user.userId);
            const isEnrolled = myCourses.some(course => course.courseId === Number(selectedCourseId));

            const restrictedPaths = ['/admin/', '/overview/info', '/overview/notice', '/curriculum/'];
            const currentPath = window.location.pathname;
            const isRestrictedPath = restrictedPaths.some(path => currentPath.includes(path));

            if (!isCreator && isRestrictedPath) {
              const isOverviewOrCurriculum = ['/overview/', '/curriculum/'].some(path => currentPath.includes(path));
              if (isOverviewOrCurriculum && !isEnrolled) {
                alert('강의 참여자가 아닙니다. 강의 목록으로 이동합니다.');
                navigate('/class/list');
              } else if (!isOverviewOrCurriculum) {
                alert('개설자가 아닙니다. 강의 목록으로 이동합니다.');
                navigate('/class/list');
              }
            }
          } catch (error) {
            console.error("수강 목록 가져오기 오류:", error);
          }
        }
      } catch (error) {
        console.error("강의 정보 가져오기 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [selectedCourseId, user]);

  const handleCourseChange = (newCourseId) => {
    setSelectedCourseId(newCourseId);
    navigate(`/class/${newCourseId}/overview/info`);
  };

  if (loading) return <div></div>;
  if (!courseData) return <div>강의 정보를 불러올 수 없습니다.</div>;

  return (
    <div>
      <TopBar />
      <PageLayout>
        <ClassTopbar selectedCourseId={selectedCourseId} onCourseChange={handleCourseChange} isCreator={isCreator} />
        <Outlet context={{ courseData, isCreator }} />
      </PageLayout>
    </div>
  );
}
