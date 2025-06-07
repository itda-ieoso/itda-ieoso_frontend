import { useState, useEffect, useContext } from "react";
import {
  Outlet,
  useOutletContext,
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import api from "../../api/api.js";
import { UsersContext } from "../../contexts/usersContext.jsx";
import AdminTopBar from "../../component/class/AdminTopBar.jsx";
import {
  ModalOverlay,
  AlertModalContainer,
} from "../../component/modal/ModalStyles.jsx";

const Admin = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(UsersContext);
  const {
    courseData: parentCourseData,
    isCreator: parentIsCreator,
    myCourses,
  } = useOutletContext();

  const [courseData, setCourseData] = useState(parentCourseData);
  const [isCreator, setIsCreator] = useState(parentIsCreator);
  const [loading, setLoading] = useState(!parentCourseData);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const getActiveTab = () => {
    if (location.pathname.includes("/admin/students")) return "students";
    if (location.pathname.includes("/admin/setting")) return "setting";
    return "summary";
  };

  useEffect(() => {
    if (!courseId || !user || parentCourseData) return;

    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/courses/${courseId}`);
        if (response.data.success) {
          setCourseData(response.data.data);
          setIsCreator(response.data.data.user?.userId === user.userId);
        }
      } catch (error) {
        console.error("강의 정보 가져오기 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, user, parentCourseData]);

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/class/list");
  };

  if (loading) return <div>로딩 중...</div>;
  if (!courseData) return <div>강의 정보를 불러올 수 없습니다.</div>;

  return (
    <div>
      <AdminTopBar
        myCourses={myCourses}
        activeTab={getActiveTab()}
        courseData={courseData}
      />
      <Outlet context={{ courseData, isCreator }} />
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
};

export default Admin;
