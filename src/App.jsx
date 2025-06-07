import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { UsersProvider } from "./contexts/usersContext.jsx";
import { handleLogout } from "./api/tokenManager.js";
import {
  ModalOverlay,
  AlertModalContainer,
} from "./component/modal/ModalStyles.jsx";
import LandingPage from "./page/LandingPage.jsx";
import LogIn from "./page/users/LogIn.jsx";
import ClassList from "./page/ClassList.jsx";
import Create from "./page/class/Create.jsx";
import Participate from "./page/Participate.jsx";
import Class from "./page/Class.jsx";
import ClassOverview from "./page/class/Overview.jsx";
import ClassNotice from "./page/class/Notice.jsx";
import NoticeCreate from "./page/class/NoticeCreate.jsx";
import ClassCurriculum from "./page/class/Curriculum.jsx";
import ClassCurriculumEdit from "./page/class/CurriculumEdit.jsx";
import Admin from "./page/class/Admin.jsx";
import ClassSummary from "./page/class/admin/Summary.jsx";
import ClassStudents from "./page/class/admin/Students.jsx";
import StudentDetail from "./page/class/admin/StudentDetail.jsx";
import Setting from "./page/class/admin/Setting.jsx";
import Dashboard from "./page/dashboard/Dashboard.jsx";
import ClassPlaying from "./page/class/Playing.jsx";
import ClassAssignmentSubmit from "./page/class/AssignmentSubmit.jsx";
import GoogleAuthCallback from "./page/users/GoogleAuthCallback.jsx";
import GoogleAccountLink from "./page/users/GoogleAccountLink.jsx";
import { LanguageProvider } from "./contexts/LanguageContext.jsx";
import ChannelTalk from "./component/ChannelTalk.jsx";
import AssignmentBrowse from "./page/class/AssignmentBrowse.jsx";

// 페이지 이동 시 스크롤을 맨 위로 이동시키는 컴포넌트
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function LogoutHandler() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState("");

  useEffect(() => {
    // 세션 만료 체크
    const checkSessionExpiration = () => {
      const sessionExpiration = localStorage.getItem("sessionExpiration");
      const currentTime = new Date().getTime();
      if (!sessionExpiration) return;
      if (currentTime > parseInt(sessionExpiration)) {
        setLogoutMessage("로그인 시간이 만료되어 로그아웃합니다.");
        setModalIsOpen(true);
      }
    };

    // 페이지 로드 시 한 번 체크
    checkSessionExpiration();
    // 1분마다 체크
    const interval = setInterval(checkSessionExpiration, 60000);

    // 예상치 못한 에러(토큰 에러) 이벤트 리스너
    const handleTokenError = (event) => {
      if (event.detail?.type === "token_error") {
        setLogoutMessage(
          event.detail.message || "예상치 못한 에러로 로그아웃 합니다",
        );
        setModalIsOpen(true);
      }
    };
    window.addEventListener("tokenError", handleTokenError);

    return () => {
      clearInterval(interval);
      window.removeEventListener("tokenError", handleTokenError);
    };
  }, []);

  return (
    <>
      {modalIsOpen && (
        <ModalOverlay>
          <AlertModalContainer>
            <div className="text">{logoutMessage}</div>
            <div
              className="close-button"
              onClick={() => {
                setModalIsOpen(false);
                handleLogout();
              }}
            >
              확인
            </div>
          </AlertModalContainer>
        </ModalOverlay>
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LogoutHandler />
      <UsersProvider>
        <LanguageProvider>
          <ScrollToTop />
          <ChannelTalk />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/oauth/callback" element={<GoogleAuthCallback />} />
            <Route path="/oauth/account/link" element={<GoogleAccountLink />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/class/list" element={<ClassList />} />
            <Route path="/class/create" element={<Create />} />
            <Route path="/class/participate" element={<Participate />} />

            <Route path="/class/:courseId" element={<Class />}>
              <Route path="overview/info" element={<ClassOverview />} />
              <Route path="overview/notice" element={<ClassNotice />} />
              <Route path="overview/notice/create" element={<NoticeCreate />} />
              <Route
                path="overview/notice/edit/:noticeId"
                element={<NoticeCreate />}
              />
              <Route
                path="curriculum/:lectureId"
                element={<ClassCurriculum />}
              />
              <Route
                path="curriculum/:lectureId/edit"
                element={<ClassCurriculumEdit />}
              />
              <Route path="admin/" element={<Admin />}>
                <Route path="summary" element={<ClassSummary />} />
                <Route path="students" element={<ClassStudents />} />
                <Route path="students/:studentId" element={<StudentDetail />} />
                <Route path="setting" element={<Setting />} />
              </Route>
              <Route
                path="playing/:lectureId/:videoId"
                element={<ClassPlaying />}
              />
              <Route
                path="assignment/submit/:lectureId/:assignmentId"
                element={<ClassAssignmentSubmit />}
              />
              <Route
                path="assignment/browse/:lectureId"
                element={<AssignmentBrowse />}
              />
            </Route>

            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </LanguageProvider>
      </UsersProvider>
    </BrowserRouter>
  );
}

export default App;
