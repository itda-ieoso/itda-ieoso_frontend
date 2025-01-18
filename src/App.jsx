import {BrowserRouter, Route, Routes} from "react-router-dom";
import Start from "./component/page/Start.jsx";
import ClassRoom from "./component/page/ClassRoom.jsx";
import TaskSubmission from "./component/page/TaskSubmission.jsx";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Start/>}/>
          <Route path="/classroom" element={<ClassRoom/>}/>
          <Route path="/tasksubmission" element={<TaskSubmission/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
