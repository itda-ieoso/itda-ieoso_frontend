import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import api from "../../api/api";
import PlayingCurriculumSidebar from "../../ui/class/PlayingCurriculumSidebar";
import { UsersContext } from "../../contexts/usersContext";
import AssignmentSubmitBox from "../../ui/class/AssignmentSubmitBox";
import AssignmentShowBox from "../../ui/class/AssignmentShowBox";
import { ModalOverlay } from "../../ui/modal/ModalStyles";
import CloseIcon from "@mui/icons-material/Close";

const ClassAssignmentSubmit = () => {
  const navigate = useNavigate();
  const isMobile = window.screen.width <= 480;
  const [isVisible, setIsVisible] = useState(!isMobile);

  const [previousFiles, setPreviousFiles] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const { courseId, lectureId, assignmentId } = useParams();
  const { user } = useContext(UsersContext);

  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);

  const [submissionId, setSubmissionId] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [submissionType, setSubmissionType] = useState(null);

  const [curriculumData, setCurriculumData] = useState([]);
  const [currentLectureInfo, setCurrentLectureInfo] = useState([]);
  const [currentAssignmentInfo, setCurrentAssignmentInfo] = useState([]);

  const [isSubmittedModalOpen, setIsSubmittedModalOpen] = useState(false);
  const [isReSubmittedModalOpen, setIsReSubmittedModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [canEdit, setCanEdit] = useState(false);

  const toggleSidebar = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible((prev) => !prev);
  };

  const handleNavigationCurriculum = () => {
    navigate(`/class/${courseId}/curriculum/${lectureId}`);
  };

  useEffect(() => {
    const fetchCurriculumAndAssignmentData = async () => {
      if (!courseId || !user || !lectureId || !assignmentId) return;

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
            const currentAssignment = currentLecture.assignments.find(
              (assignment) => assignment.assignmentId === Number(assignmentId),
            );

            if (currentAssignment) {
              setCurrentAssignmentInfo(currentAssignment);
              setSubmissionType(currentAssignment.submissionType);
            }
          }
        }

        const lectureResponse = await api.get(
          `/lectures/history/${courseId}/${user.userId}`,
        );

        if (lectureResponse.data.success) {
          const submission = lectureResponse.data.data.submissions.find(
            (submission) => submission.assignmentId === parseInt(assignmentId),
          );

          if (submission) {
            setSubmissionId(submission.submissionId);
            setSubmissionStatus(submission.submissionStatus);
          } else {
            setSubmissionId(null);
            setSubmissionStatus("NOT_SUBMITTED");
          }
        }
      } catch (error) {
        console.error("데이터 로딩 오류:", error);
      }
    };

    fetchCurriculumAndAssignmentData();
  }, [courseId, lectureId, assignmentId, user]);

  useEffect(() => {
    const fetchAssignmentData = async () => {
      if (!submissionId || !assignmentId || !user) return;

      try {
        const statusResponse = await api.get(
          `/assignments/${assignmentId}/submissions/${submissionId}/${user.userId}`,
        );

        if (statusResponse.data.success) {
          const filesData = statusResponse.data.data.fileNames.map(
            (fileName, index) => ({
              id: Date.now() + "_" + Math.random().toString(36).substr(2, 9),
              name: fileName,
              size: statusResponse.data.data.fileSizes[index],
              fileUrl: statusResponse.data.data.fileUrls[index],
            }),
          );

          setFiles(filesData);
          setPreviousFiles(filesData);
          if (statusResponse.data.data.textContent === "null") setContent("");
          else setContent(statusResponse.data.data.textContent);
        }
      } catch (error) {
        console.error("과제 정보 로딩 오류:", error);
      }
    };

    fetchAssignmentData();
  }, [submissionId, assignmentId, user]);

  useEffect(() => {
    if (!currentLectureInfo?.videos || !assignmentId) return;

    const foundAssignment = currentLectureInfo.assignments.find(
      (assignment) => assignment.assignmentId === Number(assignmentId),
    );

    if (foundAssignment) {
      setCurrentAssignmentInfo(foundAssignment);
    }
  }, [currentLectureInfo, assignmentId]);

  useEffect(() => {
    const fetchSubmissionType = async () => {
      if (!assignmentId || !courseId || !user) return;

      try {
        const response = await api.get(
          `/lectures/curriculum/${courseId}/${user.userId}`,
        );

        if (response.data.success) {
          const curriculum = response.data.data.curriculumResponses;

          let foundType = null;
          for (const lecture of curriculum) {
            const assignment = lecture.assignments.find(
              (a) => a.assignmentId === parseInt(assignmentId),
            );
            if (assignment) {
              foundType = assignment.submissionType;
              console.log(foundType);
              break;
            }
          }

          if (foundType) {
            setSubmissionType(foundType);
          } else {
            console.warn("해당 과제의 submissionType을 찾을 수 없습니다.");
          }
        }
      } catch (error) {
        console.error("과제 유형 로딩 오류:", error);
      }
    };

    fetchSubmissionType();
  }, [assignmentId, courseId, user]);

  useEffect(() => {
    if (submissionStatus === "NOT_SUBMITTED") {
      setCanEdit(true);
    } else {
      setCanEdit(false);
    }
  }, [assignmentId, submissionStatus]);

  function truncateText(text) {
    if (text.length > 30) {
      return text.slice(0, 30) + "...";
    }
    return text;
  }

  const setIsVisibleHandler = () => {
    setIsVisible(!isVisible);
  };

  return (
    <Container>
      <LeftSide>
        <TopContainer>
          <TitleContainer>
            <MainTitle>
              {currentLectureInfo?.lectureTitle}{" "}
              {truncateText(
                currentAssignmentInfo?.assignmentTitle || "",
              )}
            </MainTitle>

            <ClickContainer onClick={handleNavigationCurriculum}>
              <ArrowForwardIosIcon
                style={{ width: "13px", marginLeft: "15px" }}
              />
            </ClickContainer>
          </TitleContainer>
          {isMobile && (
            <MobileToggleButtonWrapper>
              <MobileToggleButton type="button" onClick={toggleSidebar}>
                {isVisible ? (
                  <CloseIcon style={{ fontSize: "3.7vh" }} />
                ) : (
                  <MenuIcon style={{ fontSize: "3.7vh" }} />
                )}
              </MobileToggleButton>
            </MobileToggleButtonWrapper>
          )}
        </TopContainer>

        <WhiteBoxComponent>
          <NoticeContentContainer>
            {currentAssignmentInfo?.assignmentDescription || ""}
          </NoticeContentContainer>
        </WhiteBoxComponent>

        {submissionStatus === "NOT_SUBMITTED" || canEdit ? (
          <AssignmentSubmitBox
            courseId={courseId}
            userId={user?.userId}
            canEdit={canEdit}
            setCanEdit={setCanEdit}
            content={content}
            setContent={setContent}
            files={files}
            setFiles={setFiles}
            submissionId={submissionId}
            submissionStatus={submissionStatus}
            submissionType={submissionType}
            setIsSubmittedModalOpen={setIsSubmittedModalOpen}
            setIsReSubmittedModalOpen={setIsReSubmittedModalOpen}
          />
        ) : (
          <AssignmentShowBox
            setCanEdit={setCanEdit}
            content={content}
            files={files}
            submissionId={submissionId}
            submissionStatus={submissionStatus}
            submissionType={submissionType}
            setIsDeleteModalOpen={setIsDeleteModalOpen}
          />
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
        <SidebarSlideWrapper show={isVisible}>
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

      {isSubmittedModalOpen && (
        <ModalOverlay>
          <ModalContainer>
            <Message>과제 제출이 완료되었어요</Message>
            <CloseButton
              onClick={() => {
                setIsSubmittedModalOpen(false);
                window.location.reload();
              }}
            >
              확인
            </CloseButton>
          </ModalContainer>
        </ModalOverlay>
      )}
      {isReSubmittedModalOpen && (
        <ModalOverlay>
          <ModalContainer>
            <Message>과제가 수정되었어요</Message>
            <CloseButton
              onClick={() => {
                setIsReSubmittedModalOpen(false);
                window.location.reload();
              }}
            >
              확인
            </CloseButton>
          </ModalContainer>
        </ModalOverlay>
      )}
      {isDeleteModalOpen && (
        <ModalOverlay>
          <ModalContainer>
            <Message>과제가 삭제되었어요</Message>
            <CloseButton
              onClick={() => {
                setIsDeleteModalOpen(false);
                window.location.reload();
              }}
            >
              확인
            </CloseButton>
          </ModalContainer>
        </ModalOverlay>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  margin-top: 30px;
  background-color: #f6f7f9;
  position: relative;
`;

const LeftSide = styled.div`
  width: 70vw;
  flex: 1;
  padding-left: 5px;
  padding-right: 20px;
  position: relative;
`;

const WhiteBoxComponent = styled.div`
  border-radius: 20px;
  background-color: #ffffff;
  height: 30vh;
  margin-bottom: 50px;
  padding: 20px 10px;
`;

const NoticeContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 10px;
  overflow: auto;
  height: calc(30vh - 15px);
  white-space: pre-wrap;
  
  /* 스크롤바 보이게 강제 적용 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0,0,0,0.3);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  /* Firefox용 */
  scrollbar-width: thin;
  scrollbar-color: rgba(0,0,0,0.3) transparent;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: flex-end;
`;

const MenuContainer = styled.div`
  margin-top: 3px;
`;

const MobileToggleButtonWrapper = styled.div`
  display: none;

  @media (max-width: 480px) {
    display: block;
    position: fixed;
    bottom: 20px;
    right: 12%;
    z-index: 1500;
  }
`;

const MobileToggleButton = styled.button`
  display: none;

  @media (max-width: 480px) {
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    margin-top: 2vh;
    margin-left: auto;
    background: white;
    border: 1px solid #ccc;
    border-radius: 50%;
    cursor: pointer;
    color: var(--main-color);
    padding: 0.5vh;
  }
`;

const SidebarSlideWrapper = styled.div`
  @media (max-width: 480px) {
    position: fixed;
    z-index: 999;
    top: 0;
    right: ${(props) => (props.show ? "0" : "-100%")};
    width: 75%;
    height: 100%;
    background-color: white;
    transition: right 0.3s ease-in-out;
    box-shadow: -2px 0px 10px rgba(0, 0, 0, 0.1);
  }
`;

const TopContainer = styled.div`
  margin-bottom: 26px;
  display: flex;
  justify-content: space-between;

  @media all and (max-width: 479px) {
    flex-direction: column;
    gap: 10px;
    margin-bottom: 10px;
  }
`;

const MainTitle = styled.div`
  font-size: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  margin-right: 5px;

  @media all and (max-width: 479px) {
    font-size: 20px;
    margin-bottom: 10px;
  }
`;

const ClickContainer = styled.div`
  display: flex;
  cursor: pointer;
`;

const RightSide = styled.div`
  width: 20vw;
  height: 70vh;
  overflow-y: auto;
  padding: 25px 20px;
  background-color: #ffffff;
  border-radius: 20px;

  @media (max-width: 768px) {
    width: 25vw;
  }

  @media (max-width: 480px) {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  padding: 40px 80px;
  border-radius: 8px;
  text-align: center;
  width: 50%;
  max-width: 300px;
  font-size: 1rem;
  position: relative;
`;

const Message = styled.div`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: red;
  font-size: 16px;
  cursor: pointer;
  position: absolute;
  right: 30px;
  bottom: 20px;
  font-weight: 700;
`;

export default ClassAssignmentSubmit;
