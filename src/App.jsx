import {BrowserRouter, Route, Routes} from "react-router-dom";
import LogIn from "./component/page/LogIn.jsx";
import SignUp from "./component/page/SignUp.jsx";
import ClassRoom from "./component/page/ClassRoom.jsx";
import MainPage from "./component/page/MainPage.jsx";
import Class from "./component/page/Class.jsx";
import Participate from "./component/page/Participate.jsx";
import FirstParticipate from "./component/page/participate/FirstParticipate.jsx";

import ClassCurriculum from "./component/page/class/ClassCurriculum.jsx";
import ClassOverview from "./component/page/class/ClassOverview.jsx";
import ClassNotice from "./component/page/class/ClassNotice.jsx";
import ClassStat from "./component/page/class/ClassStat.jsx";
import Dashboard from "./component/page/Dashboard.jsx";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/overview/info" element={<ClassOverview />} />
          <Route path="/overview/notice" element={<ClassNotice />} />
          <Route path="/curriculum" element={<ClassCurriculum />} />
          <Route path="/stat" element={<ClassStat/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/participate" element={<Participate />} />
          <Route path="/class" element={<Class />} />
          <Route path="/classroom" element={<ClassRoom />} />
          <Route path="/participate/first" element={<FirstParticipate />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
