import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PlayingCurriculumSidebar from "../../component/class/PlayingCurriculumSidebar.jsx";
import api from "../../api/api.js";
import { UsersContext } from "../../contexts/usersContext.jsx";
import VideoPlaying from "../../component/class/VideoPlaying.jsx";
import CloseIcon from "@mui/icons-material/Close";

const ClassPlaying = () => {
  const navigate = useNavigate();
  const { courseId, lectureId, videoId } = useParams();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 376);
  const [showSidebar, setShowSidebar] = useState(true);
  const { user } = useContext(UsersContext);

  const [curriculumData, setCurriculumData] = useState([]);
  const [currentLectureInfo, setCurrentLectureInfo] = useState([]);
  const [currentVideoInfo, setCurrentVideoInfo] = useState([]);

  useEffect(() => {
    const isMobileView = window.matchMedia("(max-width: 376px)").matches;
    setIsMobile(isMobileView);
    setShowSidebar(!isMobileView);
  }, []);

  const handleToggle = () => setShowSidebar((prev) => !prev);

  useEffect(() => {
    const fetchCurriculumAndVideoData = async () => {
      if (!courseId || !user || !lectureId || !videoId) return;

      try {
        const curriculumResponse = await api.get(
          `/lectures/curriculum/${courseId}/${user.userId}`,
        );

        if (curriculumResponse.data.success) {
          const curriculum = curriculumResponse.data.data.curriculumResponses;
          const filteredCurriculum = curriculum.map((lecture) => {
            const filteredVideos = lecture.videos.filter(
              (video) => video.videoUrl !== null,
            );

            const filteredAssignments = lecture.assignments.filter(
              (assignment) =>
                assignment.assignmentTitle !== "과제 제목을 입력하세요.",
            );

            return {
              ...lecture,
              videos: filteredVideos,
              assignments: filteredAssignments,
            };
          });

          //.filter((lecture) => lecture.videos.length > 0 || lecture.assignments.length > 0);

          setCurriculumData(filteredCurriculum);

          const currentLecture = curriculum.find(
            (lecture) => lecture.lectureId === Number(lectureId),
          );

          if (currentLecture) {
            setCurrentLectureInfo(currentLecture);

            const currentVideo = currentLecture.videos.find(
              (video) => video.videoId === Number(videoId),
            );

            if (currentVideo) {
              setCurrentVideoInfo(currentVideo);
            }
          }
        }
      } catch (error) {
        console.error("데이터 로딩 오류:", error);
      }
    };

    fetchCurriculumAndVideoData();
  }, [courseId, lectureId, videoId, user]);

  const handleNavigationCurriculum = () => {
    navigate(`/class/${courseId}/curriculum/${lectureId}`);
  };

  const setIsVisibleHandler = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      <Container>
        <LeftSide>
          <TopContainer>
            <TitleContainer>
              <MainTitle>
                {currentLectureInfo?.lectureTitle}{" "}
                {currentVideoInfo.videoTitle || "강의 영상 제목"}
              </MainTitle>

              <ClickContainer onClick={handleNavigationCurriculum}>
                <ArrowForwardIosIcon
                  style={{ width: "13px", marginLeft: "15px" }}
                />
              </ClickContainer>
            </TitleContainer>
          </TopContainer>

          <VideoPlaying videoUrl={currentVideoInfo.videoUrl} />

          {isMobile && (
            <MobileToggleButton type="button" onClick={handleToggle}>
              {showSidebar ? (
                <CloseIcon style={{ fontSize: "2.8vh" }} />
              ) : (
                <MenuIcon style={{ fontSize: "2.8vh" }} />
              )}
            </MobileToggleButton>
          )}
        </LeftSide>

        {!isMobile ? (
          <RightSide>
            <PlayingCurriculumSidebar
              curriculumData={curriculumData}
              setCurriculumData={setCurriculumData}
              currentLectureInfo={currentLectureInfo}
              setCurrentLectureInfo={setCurrentLectureInfo}
            />
          </RightSide>
        ) : (
          <SidebarSlideWrapper show={showSidebar}>
            <RightSide>
              <PlayingCurriculumSidebar
                curriculumData={curriculumData}
                setCurriculumData={setCurriculumData}
                currentLectureInfo={currentLectureInfo}
                setCurrentLectureInfo={setCurrentLectureInfo}
              />
            </RightSide>
          </SidebarSlideWrapper>
        )}
      </Container>
    </>
  );
};

const Container = styled.div`
  display: flex;
  margin-top: 30px;
  overflow: hidden;
  background-color: #f6f7f9;
`;

const MenuContainer = styled.div`
  margin-top: 3px;
`;

const TopContainer = styled.div`
  margin-bottom: 26px;
  display: flex;
  justify-content: space-between;
`;

const LeftSide = styled.div`
  width: 70vw;
  flex: 1;
  padding-left: 5px;
  padding-right: 20px;
`;

const RightSide = styled.div`
  background: transparent;
  display: flex;
  flex-direction: column;
`;

const TitleContainer = styled.div`
  display: flex;
  margin-bottom: 26px;
  align-items: flex-end;
`;

const MainTitle = styled.div`
  font-size: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  margin-right: 10px;
`;

const ClickContainer = styled.div`
  display: flex;
  cursor: pointer;
`;

const MobileToggleButton = styled.button`
  display: none;

  @media (max-width: 376px) {
    display: block;
    position: fixed;
    bottom: 4.6%;
    left: 5%;
    z-index: 1300;
    background: white;
    border: 1px solid #ccc;
    border-radius: 50%;
    padding: 0.8vh;
    font-size: 0.5vh;
    cursor: pointer;
    color: var(--main-color);
  }
`;

const SidebarSlideWrapper = styled.div`
  @media (max-width: 376px) {
    position: fixed;
    top: 0;
    left: ${(props) => (props.show ? "0" : "-100%")};
    width: 55%;
    padding: 1rem 0;
    height: 100%;
    background-color: white;
    z-index: 1100;
    transition: left 0.3s ease-in-out;
    box-shadow: 2px 0px 10px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
  }
`;
export default ClassPlaying;
