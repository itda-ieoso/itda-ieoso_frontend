import { useState, useEffect, useContext } from "react";
import { Outlet, useParams, useNavigate } from "react-router-dom";
import api from "../api/api.js";
import { UsersContext } from "../contexts/usersContext.jsx";
import TopBar from "../component/TopBar.jsx";
import ClassTopbar from "../component/class/ClassTopbar.jsx";
import { PageLayout } from "../component/class/ClassLayout.jsx";
import { getMyCourses, formatMyCoursesTitles } from "../api/classApi.js";
import {
  ModalOverlay,
  AlertModalContainer,
} from "../component/modal/ModalStyles.jsx";

export default function Class() {
  const { courseId: paramCourseId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UsersContext);

  const [selectedCourseId, setSelectedCourseId] = useState(paramCourseId);
  const [courseData, setCourseData] = useState(null);
  const [isCreator, setIsCreator] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [myCourses, setMyCourses] = useState(null);

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
            const myCourses = await getMyCourses(user.userId);
            setMyCourses(myCourses);
            const formattedCourses = formatMyCoursesTitles(
              myCourses,
              user.userId,
            );
            const currentCourse = formattedCourses.find(
              (course) => course.courseId === Number(selectedCourseId),
            );
            const isEnrolled = !!currentCourse;
            const isAssignmentPublic = currentCourse?.isAssignmentPublic;

            const restrictedPaths = [
              "/overview/info",
              "/overview/notice",
              "/curriculum/",
              "/admin/",
            ];
            const currentPath = window.location.pathname;
            const isRestrictedPath = restrictedPaths.some((path) =>
              currentPath.includes(path),
            );

            if (!isCreator && isRestrictedPath) {
              const isOverviewOrCurriculum = [
                "/overview/",
                "/curriculum/",
              ].some((path) => currentPath.includes(path));
              if (isOverviewOrCurriculum && !isEnrolled) {
                setModalMessage(
                  "강의 참여자가 아닙니다. 강의 목록으로 이동합니다.",
                );
                setShowModal(true);
              } else if (!isOverviewOrCurriculum && !isAssignmentPublic) {
                setModalMessage("접근오류로 강의 목록으로 이동합니다.");
                setShowModal(true);
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

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/class/list");
  };

  if (loading) return <div></div>;
  if (!courseData) return <div>강의 정보를 불러올 수 없습니다.</div>;

  return (
    <div>
      <TopBar />
      <PageLayout>
        <ClassTopbar
          selectedCourseId={selectedCourseId}
          onCourseChange={handleCourseChange}
          isCreator={isCreator}
          myCourses={myCourses}
        />
        <Outlet context={{ courseData, isCreator, myCourses }} />
      </PageLayout>
      {showModal && (
        <ModalOverlay>
          <AlertModalContainer>
            <div className="text">{modalMessage}</div>
            <div className="close-button" onClick={handleModalClose}>
              확인
            </div>
          </AlertModalContainer>
        </ModalOverlay>
      )}
    </div>
  );
}
