import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UsersProvider } from "./component/contexts/usersContext.jsx";

import LandingPage from "./component/page/LandingPage.jsx";
import LogIn from "./component/page/users/LogIn.jsx";
import SignUp from "./component/page/users/SignUp.jsx";
import ClassList from "./component/page/ClassList.jsx";
import Create from "./component/page/class/Create.jsx";
import Setting from "./component/page/class/Setting.jsx";
import Participate from "./component/page/Participate.jsx";
import Class from "./component/page/Class.jsx";
import ClassOverview from "./component/page/class/Overview.jsx";
import ClassSummary from "./component/page/class/Summary.jsx";
import ClassStudents from "./component/page/class/Students.jsx";
import ClassNotice from "./component/page/class/Notice.jsx";
import NoticeCreate from "./component/page/class/NoticeCreate.jsx";
import ClassCurriculum from "./component/page/class/Curriculum.jsx";
import ClassCurriculumEdit from "./component/page/class/CurriculumEdit.jsx";
import Dashboard from "./component/page/dashboard/Dashboard.jsx";

import ClassPlaying from "./component/page/class/Playing.jsx";
import ClassAssignmentSubmit from "./component/page/class/AssignmentSubmit.jsx";
import StudentDetail from "./component/page/class/StudentDetail.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <UsersProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />

            {/* 로그인 페이지 */}
            <Route path="/login" element={<LogIn />} />
            <Route path="/signup" element={<SignUp />} />

            {/* 강의실 페이지 */}
            <Route path="/class/list" element={<ClassList />} />
            <Route path="/class/create" element={<Create />} />

            {/* 강의실 입장 페이지 */}
            <Route path="/class/participate" element={<Participate />} />

            {/* 강의실 상세 페이지 */}

            {/* 강의실 관련 라우트 */}
          <Route path="/class/:courseId" element={<Class />}>
            <Route path="overview/info" element={<ClassOverview />} />
            <Route path="overview/notice" element={<ClassNotice />} />
            <Route path="overview/notice/create" element={<NoticeCreate />} />
            <Route path="overview/notice/edit/:noticeId" element={<NoticeCreate />} />
            <Route path="curriculum/:lectureId" element={<ClassCurriculum />} />
            <Route path="curriculum/:lectureId/edit" element={<ClassCurriculumEdit />} />
            <Route path="admin/summary" element={<ClassSummary />} />
            <Route path="admin/students" element={<ClassStudents />} />
            <Route path="admin/students/:studentId" element={<StudentDetail />} />
            <Route path="admin/setting" element={<Setting />} />
          </Route>

            {/* 대시보드 페이지 */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* 강의실 수강  */}
            <Route path="/playing/:courseId/:lectureId/:videoId" element={<ClassPlaying />} />
            <Route
              path="/assignment/submit/:courseId/:lectureId/:assignmentId"
              element={<ClassAssignmentSubmit />}
            />
          </Routes>
        </UsersProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
