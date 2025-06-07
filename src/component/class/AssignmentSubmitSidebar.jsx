import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import Assignment from "../../img/icon/docs.svg";
import Material from "../../img/icon/pdf.svg";
import Video from "../../img/icon/videored.svg";
import {
  getCurriculumWithAssignments,
  getAllAssignmentSubmissions,
} from "../../api/classCurriculumApi.js";
import { UsersContext } from "../../contexts/usersContext.jsx";
import { ModalOverlay, AlertModalContainer } from "../modal/ModalStyles.jsx";

const CurriculumItem = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
`;

const ItemTitle = styled.span`
  font-size: 17px;
  font-weight: 700;
  display: inline-block;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
`;

const SubItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px 10px;
  border-radius: 13px;
  background-color: ${(props) => (props.now ? "#F8F8F8" : "transparent")};
`;

const SubItemTitle = styled.div`
  font-size: 15px;
  margin-bottom: 4px;
  font-weight: 400;
`;

const ContentItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 0;
  cursor: pointer;
`;

const TextContainer = styled.div`
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RowContainer = styled.div`
  display: flex;
  align-items: center;
`;

const IconContainer = styled.div`
  margin-left: auto;
`;

const RedText = styled.div`
  font-size: 10px;
  color: #ff4747;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
`;

const GreyText = styled.div`
  font-size: 11px;
  color: #909090;
`;

const BlackText = styled.span`
  font-size: 12px;
  color: #474747;
  display: inline-block;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
`;

const AssignmentSubmitSidebar = ({
  curriculumData,
  setCurriculumData,
  currentLectureInfo,
  setCurrentLectureInfo,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { courseId, lectureId, videoId, assignmentId } = useParams();
  const { user } = useContext(UsersContext);
  const [submissionStatusList, setSubmissionStatusList] = useState([]);
  const [assignmentIdList, setAssignmentIdList] = useState([]);
  const [materialStatusList, setMaterialStatusList] = useState([]);
  const [materialIdList, setMaterialIdList] = useState([]);
  const [selectedContentId, setSelectedContentId] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [activeMenu, setActiveMenu] = useState("curriculum");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!courseId || !user) return;
        // 커리큘럼(주차별+과제)
        const lectures = await getCurriculumWithAssignments(
          courseId,
          user.userId,
        );
        setCurriculumData(lectures);
        // 제출 데이터(과제별 학생 제출)
        const allSubmissions = await getAllAssignmentSubmissions(courseId);
        // 필요하다면 setState로 submissions 저장 가능
      } catch (error) {
        console.error("데이터 로딩 오류:", error);
      }
    };
    fetchData();
  }, [courseId, user, setCurriculumData]);

  useEffect(() => {
    if (!curriculumData?.length || !lectureId) return;

    const foundLecture = curriculumData.find(
      (lecture) => lecture.lectureId === Number(lectureId),
    );

    if (foundLecture) {
      setCurrentLectureInfo(foundLecture);
    }
  }, [curriculumData, lectureId, videoId, assignmentId, setCurrentLectureInfo]);

  useEffect(() => {
    if (location.pathname.includes("/submit")) setSelectedType("assignment");
    else if (location.pathname.includes("/playing")) setSelectedType("video");
    else null;
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname.includes("/assignment/browse")) {
      setActiveMenu("browse");
    } else {
      setActiveMenu("curriculum");
    }
  }, [location.pathname]);

  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  const getStatusIcon = (type, id) => {
    if (type === "assignment") {
      const index = assignmentIdList.findIndex((listid) => listid === id);
      if (index === -1) return null;

      const status = submissionStatusList[index];
      switch (status) {
        case "NOT_SUBMITTED":
          return (
            <span
              key={id}
              className="material-icons"
              style={{ color: "#C3C3C3", fontSize: "22px" }}
            >
              check_circle
            </span>
          );
        case "LATE":
        case "SUBMITTED":
          return (
            <span
              key={id}
              className="material-icons"
              style={{ color: "#474747", fontSize: "22px" }}
            >
              check_circle
            </span>
          );
        default:
          return null;
      }
    } else if (type === "material") {
      const index = materialIdList.findIndex((listid) => listid === id);
      if (index === -1) return null;

      const status = materialStatusList[index];
      switch (status) {
        case true:
          return (
            <span
              key={id}
              className="material-icons"
              style={{ color: "#474747", fontSize: "22px" }}
            >
              check_circle
            </span>
          );
        case false:
          return (
            <span
              key={id}
              className="material-icons"
              style={{ color: "#C3C3C3", fontSize: "22px" }}
            >
              check_circle
            </span>
          );
        default:
          return null;
      }
    }
    return null;
  };

  const handleVideoClick = (goLecture, goVideo, content) => {
    const now = new Date();
    const startDate = new Date(content.startDate);
    const endDate = new Date(content.endDate);

    if (
      now.getTime() < startDate.getTime() ||
      now.getTime() > endDate.getTime()
    ) {
      setAlertMessage(
        `<strong>지금은 강의를 볼 수 없는 시간이에요.</strong> \n\n이 강의는 ${startDate.toLocaleString()}부터 \n${endDate.toLocaleString()}까지 시청하실 수 있어요.`,
      );
      setShowAlertModal(true);
      return;
    }
    setSelectedContentId(goVideo);
    setSelectedType("video");
    navigate(`/class/${courseId}/playing/${goLecture}/${goVideo}`);
  };

  const handleMaterialClick = async (material) => {
    const now = new Date();
    const startDate = new Date(material.startDate);
    const endDate = new Date(material.endDate);

    if (
      now.getTime() < startDate.getTime() ||
      now.getTime() > endDate.getTime()
    ) {
      setAlertMessage(
        `<strong>지금은 자료를 볼 수 없는 시간이에요.</strong> \n\n이 자료는 ${startDate.toLocaleString()}부터 \n${endDate.toLocaleString()}까지 다운로드 가능합니다.`,
      );
      setShowAlertModal(true);
      return;
    }

    setSelectedContentId(material.materialId);
    setSelectedType("material");

    try {
      const response = await api.get("/materials/download", {
        params: {
          fileUrl: material.materialFile,
          materialId: material.materialId,
        },
      });

      const presignedUrl = response.data.data;
      const fileResponse = await fetch(presignedUrl);
      const arrayBuffer = await fileResponse.arrayBuffer();

      const fileExtension = material.originalFilename
        .split(".")
        .pop()
        .toLowerCase();
      let mimeType = "application/octet-stream";

      if (fileExtension === "pdf") {
        mimeType = "application/pdf";
      } else if (fileExtension === "txt") {
        mimeType = "text/plain";
      } else if (["jpg", "jpeg", "png", "gif"].includes(fileExtension)) {
        mimeType = `image/${fileExtension}`;
      } else if (fileExtension === "zip") {
        mimeType = "application/zip";
      } else if (fileExtension === "svg") {
        mimeType = "image/svg+xml";
      }

      const blob = new Blob([arrayBuffer], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = material.originalFilename;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("파일 처리 중 오류:", error);
    }
  };

  const handleAssignmentClick = (goLecture, goAssignment, assignment) => {
    const now = new Date();
    const startDate = new Date(assignment.startDate);
    const endDate = new Date(assignment.endDate);

    if (now.getTime() < startDate.getTime()) {
      setAlertMessage(
        `<strong>지금은 과제를 제출할 수 없는 시간이에요.</strong> \n\n${startDate.toLocaleString()} 이후에 제출할 수 있습니다.`,
      );
      setShowAlertModal(true);
      return;
    }

    setSelectedContentId(goAssignment);
    setSelectedType("assignment");
    navigate(
      `/class/${courseId}/assignment/submit/${goLecture}/${goAssignment}`,
    );
  };

  const dateText = (time) => {
    if (!time || typeof time !== "string" || !time.includes("T")) {
      return "날짜 정보 없음";
    }
    const date = time.slice(0, -3);
    return date.replace("T", " ");
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    if (menu === "browse") {
      navigate(`/class/${courseId}/assignment/browse/${lectureId}`);
    } else {
      if (location.pathname.includes("/assignment/browse")) {
        const firstLecture = curriculumData[0];
        if (firstLecture) {
          navigate(`/class/${courseId}/playing/${firstLecture.lectureId}`);
        }
      }
    }
  };

  return (
    <SidebarWrapper>
      <MenuContainer>
        <MenuItem
          active={activeMenu === "curriculum"}
          onClick={() => handleMenuClick("curriculum")}
        >
          커리큘럼
        </MenuItem>
        <MenuItem
          active={activeMenu === "browse"}
          onClick={() => handleMenuClick("browse")}
        >
          수강생 과제 보기
        </MenuItem>
      </MenuContainer>
      {activeMenu === "curriculum" && (
        <>
          <RightContainer>
            <CurriculumList>
              {curriculumData.map((lecture, index) => {
                const sortedContents = [
                  ...lecture.videos,
                  ...lecture.materials,
                  ...lecture.assignments,
                ].sort((a, b) => a.contentOrderIndex - b.contentOrderIndex);

                return (
                  <div key={lecture.lectureId}>
                    <CurriculumItem>
                      <ItemTitle>
                        {index + 1}주차 {lecture.lectureDescription}
                      </ItemTitle>
                    </CurriculumItem>
                    {lecture.lectureId &&
                      sortedContents.map((content) => {
                        const isSelected =
                          (selectedType === "video" &&
                            content.videoId === Number(videoId)) ||
                          (selectedType === "assignment" &&
                            content.assignmentId === Number(assignmentId));

                        return (
                          <SubItem
                            now={Boolean(isSelected)}
                            key={content.contentOrderId}
                            status={
                              content.contentType === "video"
                                ? content.videoHistoryStatus
                                : null
                            }
                          >
                            <SubItemTitle>
                              {content.contentType === "video" && (
                                <ContentItem
                                  onClick={() =>
                                    handleVideoClick(
                                      lecture.lectureId,
                                      content.videoId,
                                      content,
                                    )
                                  }
                                >
                                  <img
                                    className="material-icons"
                                    src={Video}
                                    alt="video icon"
                                    style={{
                                      width: "20px",
                                      marginRight: "10px",
                                    }}
                                  />
                                  <TextContainer>
                                    <BlackText width="3rem">
                                      {content.videoTitle}
                                    </BlackText>
                                    <RedText>
                                      {dateText(content.startDate)} -{" "}
                                      {dateText(content.endDate)}
                                    </RedText>
                                  </TextContainer>
                                </ContentItem>
                              )}
                              {content.contentType === "material" && (
                                <ContentItem
                                  onClick={() => handleMaterialClick(content)}
                                >
                                  <img
                                    className="material-icons"
                                    src={Material}
                                    alt="material icon"
                                    style={{
                                      width: "20px",
                                      marginRight: "10px",
                                    }}
                                  />
                                  <TextContainer>
                                    <RowContainer>
                                      <BlackText style={{ marginRight: "5px" }}>
                                        {content.originalFilename}
                                      </BlackText>
                                      <GreyText>{content.fileSize}</GreyText>
                                    </RowContainer>
                                    <RedText>
                                      {dateText(content.startDate)} -{" "}
                                      {dateText(content.endDate)}
                                    </RedText>
                                  </TextContainer>
                                  <IconContainer>
                                    {getStatusIcon(
                                      content.contentType,
                                      content.materialId,
                                    )}
                                  </IconContainer>
                                </ContentItem>
                              )}
                              {content.contentType === "assignment" && (
                                <ContentItem
                                  onClick={() =>
                                    handleAssignmentClick(
                                      lecture.lectureId,
                                      content.assignmentId,
                                      content,
                                    )
                                  }
                                >
                                  <img
                                    className="material-icons"
                                    src={Assignment}
                                    alt="assignment icon"
                                    style={{
                                      width: "20px",
                                      marginRight: "10px",
                                    }}
                                  />
                                  <TextContainer>
                                    <BlackText>
                                      {content.assignmentTitle}
                                    </BlackText>
                                    <RedText>
                                      {dateText(content.startDate)} -{" "}
                                      {dateText(content.endDate)}
                                    </RedText>
                                  </TextContainer>
                                  <IconContainer>
                                    {getStatusIcon(
                                      content.contentType,
                                      content.assignmentId,
                                    )}
                                  </IconContainer>
                                </ContentItem>
                              )}
                            </SubItemTitle>
                          </SubItem>
                        );
                      })}
                  </div>
                );
              })}
            </CurriculumList>
          </RightContainer>
          {showAlertModal && (
            <ModalOverlay>
              <AlertModalContainer>
                <div
                  className="none-bold-text"
                  dangerouslySetInnerHTML={{ __html: alertMessage }}
                ></div>
                <div className="button-container">
                  <button
                    className="close-button"
                    onClick={() => setShowAlertModal(false)}
                  >
                    확인
                  </button>
                </div>
              </AlertModalContainer>
            </ModalOverlay>
          )}
        </>
      )}
    </SidebarWrapper>
  );
};

const SidebarWrapper = styled.div`
  width: 20vw;
  background: #fff;
  height: 70vh;
  border-radius: 20px;
  padding: 25px 20px;
  overflow-y: scroll;

  @media (max-width: 376px) {
    width: 70%;
    height: 100%;
  }
`;

const MenuContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  width: 90%;
  margin: 0 auto;
  margin-bottom: 10px;
  border-bottom: 1px solid #e5e5e5;
  background: #fff;

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: stretch;
    gap: 5px;
    border-bottom: none;
    width: 100%;
  }
`;

const MenuItem = styled.div`
  position: relative;
  font-size: 18px;
  width: 80%;
  font-weight: ${(props) => (props.active ? "600" : "400")};
  color: ${(props) => (props.active ? "#222" : "#C3C3C3")};
  padding: 13px 0px;
  cursor: pointer;
  white-space: nowrap;
  background: transparent;
  transition: color 0.2s;

  &::after {
    content: "";
    display: ${(props) => (props.active ? "block" : "none")};
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 2px;
    background: var(--main-color, #ff4747);
    border-radius: 2px;
  }

  @media (max-width: 1024px) {
    border-bottom: 1px solid #e5e5e5;
    border-right: none;
    &::after {
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 2px;
    }
  }

  @media (max-width: 1023px) {
    font-size: 16px;
    margin: 0 10px;
  }
`;

const RightContainer = styled.div`
  overflow-y: scroll;
  margin-right: -12px;
  white-space: pre-wrap;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const CurriculumList = styled.div`
  padding: 0 15px;
  @media all and (max-width: 376px) {
    padding: 0;
  }
`;

export default AssignmentSubmitSidebar;
