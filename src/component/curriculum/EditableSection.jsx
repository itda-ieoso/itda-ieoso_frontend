import styled from "styled-components";
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import DateTimeEdit from "./DateTimeEdit.jsx";
import VideoIcon from "../../img/class/edit/video.svg";
import Material from "../../img/icon/curriculum/materialicon.svg";
import Assignment from "../../img/icon/curriculum/assignmenticon.svg";
import Delete from "../../img/class/edit/delete.svg";
import Upload from "../../img/class/edit/upload.svg";
import { toLocalDateTime } from "../../page/class/CurriculumEdit.jsx";
import api from "../../api/api.js";
import { UsersContext } from "../../contexts/usersContext.jsx";

const Section = styled.div`
  display: flex;
  padding: 1.3rem 1.5rem;
  border-radius: 12px;
  margin: 1rem 0rem;
  background-color: #ffffff;
  position: relative;
  cursor: pointer;
  width: 100%;

  @media (max-width: 480px) {
    padding: 0.8rem 1rem;
  }
`;

const VideoThumbnail = styled.div`
  // width: 23vh;
  // height: 14.5vh;
  width: 22%;
  aspect-ratio: 4 / 2.6;
  align-items: center;
  justify-content: center;
  text-align: center;
  display: flex;
  border-radius: 8px;
  position: relative;
  cursor: pointer;
  background-color: var(--lightgrey-color);
  color: #adadad;
  font-size: 1.1rem;

  @media (max-width: 1024px) {
    width: 30%;
    font-size: 13.5px;
  }

  @media (max-width: 768px) {
    width: 27%;
    font-size: 11.5px;
  }

  @media (max-width: 480px) {
    font-size: 7px;
    border-radius: 5.5px;
  }

  @media (max-width: 376px) {
    width: 32%;
    border-radius: 3px;
  }
`;

const VideoIconImg = styled.img`
  width: 5vh;
  margin-left: 1.8vh;
  margin-right: 5vh;

  @media (max-width: 1024px) {
    margin-left: 0.5vh;
    margin-right: 1.5vh;
    width: 2.3vh;
  }
  @media (max-width: 768px) {
    margin-left: 0.3vh;
    margin-right: 1.45vh;
    width: 2.5vh;
  }
  @media (max-width: 480px) {
    margin-left: 0vh;
    margin-right: 1.8vh;
    width: 3.7vh;
  }
  @media (max-width: 440px) {
    width: 2vh;
  }

  @media (max-width: 376px) {
    margin-left: 0vh;
    margin-right: 1.2vh;
    width: 2.5vh;
  }
`;

const VideoContainer = styled.div`
  margin-left: 3.5vh;
  height: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 1024px) {
    margin-left: 1.1vh;
    justify-content: center;
    gap: 0.8vh;
  }

  @media (max-width: 480px) {
    gap: 1.5vh;
  }
`;

const VideoTitleInput = styled.input`
  width: 100%;
  background: none;
  outline: none;
  border: 2px solid #c3c3c3;
  border-radius: 7px;
  color: black;
  padding: 1.65vh;
  font-size: 16px;
  font-weight: bold;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    font-size: 16px;
    padding: 0.9vh;
    border: 1.5px solid #c3c3c3;
  }

  @media (max-width: 768px) {
    font-size: 10px;
    padding: 0.8vh;
    border: 1.35px solid #c3c3c3;
    border-radius: 6px;
  }

  @media (max-width: 480px) {
    font-size: 8px;
    padding: 1.2vh;
    border: 1px solid #c3c3c3;
    border-radius: 4.5px;
  }

  @media (max-width: 376px) {
    font-size: 6px;
    padding: 1vh;
    border: 1px solid #c3c3c3;
    border-radius: 3.4px;
  }
`;

const VideoLinkInput = styled.input`
  width: 100%;
  background: none;
  outline: none;
  border: 2px solid #c3c3c3;
  border-radius: 7px;
  color: black;
  padding: 1.65vh;
  font-size: 16px;
  font-weight: bold;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    font-size: 13px;
    padding: 0.9vh;
    border: 1.5px solid #c3c3c3;
  }

  @media (max-width: 768px) {
    font-size: 10px;
    padding: 0.8vh;
    border: 1.35px solid #c3c3c3;
    border-radius: 6px;
  }

  @media (max-width: 480px) {
    font-size: 8px;
    padding: 1.2vh;
    border: 1px solid #c3c3c3;
    border-radius: 4px;
  }

  @media (max-width: 376px) {
    font-size: 6px;
    padding: 1vh;
    border-radius: 3.4px;
  }
`;

const VideoConfirmButton = styled.button`
  background-color: var(--main-color);
  color: var(--white-color);
  width: 30%;
  margin-left: 1.5vh;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;

  @media (max-width: 1024px) {
    font-size: 13px;
    font-weight: 550;
    width: 33%;
    margin-left: 0.8vh;
  }

  @media (max-width: 768px) {
    font-size: 10px;
    margin-left: 0.6vh;
    border-radius: 4px;
  }

  @media (max-width: 480px) {
    width: 32.5%;
    font-size: 8px;
    border-radius: 3px;
  }

  @media (max-width: 376px) {
    width: 33%;
    font-size: 6px;
    padding: 0px;
    border-radius: 2.8px;
  }
`;

const UploadIcon = styled.img`
  width: 1.2rem;
  margin-right: 1rem;

  @media (max-width: 1024px) {
    width: 1.1vh;
    margin-right: 0.8vh;
  }

  @media (max-width: 768px) {
    width: 1.1vh;
    margin-right: 0.9vh;
  }

  @media (max-width: 480px) {
    width: 2vh;
    margin-right: 1vh;
  }

  @media (max-width: 376px) {
    width: 1vh;
    margin-right: 0.7vh;
  }
`;

const MaterialIcon = styled.img`
  width: 2.4rem;
  margin-left: 1rem;
  margin-right: 3rem;

  @media (max-width: 1024px) {
    margin-left: 0.6vh;
    margin-right: 1.7vh;
    width: 2vh;
  }

  @media (max-width: 768px) {
    margin-left: 0.3vh;
    margin-right: 1.5vh;
    width: 2.3vh;
  }

  @media (max-width: 480px) {
    margin-left: 0vh;
    margin-right: 1.8vh;
    width: 3.5vh;
  }

  @media (max-width: 440px) {
    margin-left: 0vh;
    margin-right: 1.8vh;
    width: 2vh;
  }

  @media (max-width: 376px) {
    margin-left: 0.1vh;
    margin-right: 1.3vh;
    width: 2.3vh;
  }
`;

const AssignmentInput = styled.input`
  width: 100%;
  background: none;
  outline: none;
  border: 2px solid #c3c3c3;
  border-radius: 7px;
  color: black;
  padding: 15px;
  font-size: 16.5px;
  font-weight: bold;
  box-sizing: border-box;
  margin-bottom: 1rem;
  font-family:
    Pretendard, Pretendard-Bold, Pretendard-ExtraBold, Pretendard-Light,
    Pretendard-Medium, Pretendard-SemiBold, Pretendard-Thin, sans-serif;

  @media (max-width: 1024px) {
    font-size: 11.5px;
    padding: 0.9vh;
    border: 1.5px solid #c3c3c3;
    width: calc(100% - 1.3vh);
  }

  @media (max-width: 768px) {
    font-size: 10px;
    padding: 0.9vh;
    border: 1.35px solid #c3c3c3;
    border-radius: 6px;
    width: calc(100% - 1.3vh);
    margin-bottom: 1vh;
  }

  @media (max-width: 480px) {
    font-size: 6.6px;
    padding: 1.2vh;
    border: 1px solid #c3c3c3;
    border-radius: 4px;
    width: calc(100% - 1vh);
  }

  @media (max-width: 376px) {
    font-size: 6.5px;
    font-weight: 600;
    padding: 0.85vh;
    border-radius: 3.4px;
  }
`;

const Input = styled.input`
  width: 100%;
  border: none;
  background: none;
  font-size: 1.2rem;
  padding: 1.5vh 1.55vh;
  outline: none;
`;

const TextArea = styled.textarea`
  font-family:
    Pretendard, Pretendard-Bold, Pretendard-ExtraBold, Pretendard-Light,
    Pretendard-Medium, Pretendard-SemiBold, Pretendard-Thin, sans-serif;
  width: calc(100% - 3.5vh);
  font-size: 16.5px;
  border: 2px solid #c3c3c3;
  border-radius: 7px;
  color: black;
  font-weight: bold;
  height: 7rem;
  text-align: start;
  vertical-align: top;
  resize: none;
  overflow: auto;
  padding: 1.5vh 1.55vh;

  &:focus {
    outline: none;
    border: 2px solid #c3c3c3; /* 기존 border 유지 */
  }

  @media (max-width: 1024px) {
    width: calc(100% - 3.3vh);
    font-size: 11.5px;
    padding: 0.9vh;
    border: 1.5px solid #c3c3c3;
    height: 9vh;
  }
  @media (max-width: 768px) {
    font-size: 10px;
    height: 8vh;
  }

  @media (max-width: 480px) {
    font-size: 6.6px;
    border: 1px solid #c3c3c3;
    border-radius: 4px;
    height: 9vh;
  }

  @media (max-width: 376px) {
    font-size: 6.5px;
    font-weight: 600;
    width: calc(100% - 3vh);
    height: 7vh;
  }
`;

const MaterialSection = styled.div`
  display: flex;
  background-color: var(--lightgrey-color);
  width: 100%;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.07rem;
  border: 2px solid #c3c3c3;

  @media (max-width: 1024px) {
    font-size: 13px;
    padding: 0.9vh;
    border: 1px solid #c3c3c3;
    border-radius: 7px;
  }

  @media (max-width: 768px) {
    font-size: 11.2px;
    padding: 0.9vh;
    border: 1px solid #c3c3c3;
    border-radius: 5px;
  }

  @media (max-width: 480px) {
    font-size: 6.8px;
    padding: 1vh;
    border: 1px solid #c3c3c3;
    border-radius: 4px;
  }
`;

const GrayLine = styled.div`
  width: 100%;
  height: 0.9px;
  background-color: #c3c3c3;
  margin-top: 1.2rem;
  margin-bottom: 1.1rem;

  @media (max-width: 768px) {
    margin-bottom: 0.8rem;
  }
  @media (max-width: 480px) {
    margin-bottom: 0.4rem;
  }

  @media (max-width: 376px) {
    margin-bottom: 0.2rem;
    height: 0.7px;
  }
`;

const Submission = styled.h3`
  font-size: 18px;

  @media (max-width: 1024px) {
    font-size: 14.8px;
    margin-bottom: 0.8vh;
  }

  @media (max-width: 768px) {
    font-size: 11.5px;
    margin-bottom: 0.7vh;
  }

  @media (max-width: 480px) {
    font-size: 7px;
  }

  @media (max-width: 376px) {
    font-size: 6px;
  }
`;

const ButtonContainer = styled.div`
  margin-top: 3vh;

  @media (max-width: 1024px) {
    margin-top: 2.3vh;
    margin-bottom: 1vh;
  }

  @media (max-width: 768px) {
    margin-top: 2.3vh;
    margin-bottom: 1vh;
  }
`;

const DeleteIcon = styled.img`
  width: 1.25rem;
  cursor: pointer;
  margin-right: 1rem;
  margin-bottom: 0.5rem;

  @media (max-width: 1024px) {
    width: 0.9rem;
  }

  @media (max-width: 768px) {
    width: 0.7rem;
    margin-right: 0.5rem;
  }

  @media (max-width: 480px) {
    width: 0.4rem;
    margin-right: 0.3rem;
  }

  @media (max-width: 376px) {
    width: 0.5rem;
    margin-right: 0.3rem;
  }
`;

const SectionButton = styled.button.attrs((props) => ({
  selected: props.selected || false,
}))`
  width: 16vh;
  height: 5.5vh;
  background-color: ${({ selected }) =>
    selected ? "var(--main-color)" : "#EEEEEE"};
  color: ${({ selected }) => (selected ? "white" : "#474747")};
  font-size: 17px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-right: 1.8vh;

  @media (max-width: 1024px) {
    font-size: 11px;
    width: 6.9vh;
    height: 2.2vh;
    border-radius: 4.5px;
    margin-right: 0.8vh;
  }
  @media (max-width: 768px) {
    font-size: 8.5px;
    width: 6.9vh;
    height: 2.25vh;
    border-radius: 4px;
  }

  @media (max-width: 480px) {
    font-size: 6.6px;
    width: 10vh;
    height: 3.3vh;
    border-radius: 2px;
  }

  @media (max-width: 480px) {
    font-size: 5.8px;
    width: 6.3vh;
    height: 2.3vh;
    border-radius: 2px;
  }
`;

export const getYouTubeThumbnail = (url) => {
  try {
    if (!url || typeof url !== "string") return null;

    const videoIdMatch = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
    );
    if (!videoIdMatch) return null;
    return `https://img.youtube.com/vi/${videoIdMatch[1]}/0.jpg`;
  } catch (error) {
    console.error("유튜브 URL 처리 중 오류 발생:", error);
    return null;
  }
};

const EditableSection = ({
  subSection,
  handleDelete,
  index,
  lectureStartDate,
  lectureEndDate,
  onDateChange,
}) => {
  const { courseId, lectureId } = useParams();
  const [title, setTitle] = useState(subSection?.title || "");
  const [videoUrl, setVideoUrl] = useState(subSection?.videoUrl || "");
  const [thumbnail, setThumbnail] = useState(getYouTubeThumbnail(videoUrl));
  const [uploadedFile, setUploadedFile] = useState(null);
  const [period, setPeriod] = useState(
    subSection?.startDate && subSection?.endDate
      ? `${subSection.startDate} ~ ${subSection.endDate}`
      : "기간 미정",
  );
  const [startDate, setStartDate] = useState(
    subSection?.startDate ? new Date(subSection.startDate) : null,
  );
  const [endDate, setEndDate] = useState(
    subSection?.endDate ? new Date(subSection.endDate) : null,
  );
  const [submissionType, setSubmissionType] = useState(
    subSection?.submissionType || "text",
  );
  const [assignmentDescription, setAssignmentDescription] = useState(
    subSection?.assignmentDescription || "",
  );
  const { user } = useContext(UsersContext);
  const userId = user.userId;

  const handleVideoInput = (e) => {
    const newVideoUrl = e.target.value;
    setVideoUrl(newVideoUrl);
  };

  const handleVideoConfirm = () => {
    if (!videoUrl) {
      alert("유튜브 URL을 입력하세요.");
      return;
    }

    const newThumbnail = getYouTubeThumbnail(videoUrl);
    if (newThumbnail) {
      setThumbnail(newThumbnail);

      setVideoUrl(videoUrl);

      handleEdit("videoUrl", videoUrl);

      // handleChange("videoUrl", videoUrl);
    } else {
      alert("올바른 유튜브 URL을 입력하세요.");
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // 파일 이름 업데이트
    setUploadedFile(file.name);

    const formData = new FormData();
    formData.append("file", file); // API 명세서에 맞춰 'file' 키 사용

    const materialId = Number(subSection.materialId);
    const userIdNum = Number(userId);

    try {
      const response = await api.patch(
        `/materials/${courseId}/${materialId}/${userIdNum}?materialTitle=${encodeURIComponent(
          subSection.originalFilename || "",
        )}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
    } catch (error) {
      console.error("파일 업로드 실패:", error);
    }
  };

  // 수정 API 요청을 즉시 실행하는 함수
  const handleEdit = async (field, value) => {
    if (!subSection) return;

    let url = "";
    let data = {};
    const userIdNum = Number(userId);

    if (subSection.contentType === "video") {
      const videoId = Number(subSection.videoId);
      url = `/videos/${courseId}/${videoId}/${userIdNum}`;
      data = {
        videoTitle: field === "title" ? value : title,
        videoUrl: field === "videoUrl" ? value : videoUrl,
      };
    } else if (subSection.contentType === "material") {
      const materialId = Number(subSection.materialId);
      url = `/materials/${courseId}/${materialId}/${userIdNum}`;
      data = { materialTitle: value };
    } else if (subSection.contentType === "assignment") {
      const assignmentId = Number(subSection.assignmentId);
      url = `/assignments/${courseId}/${assignmentId}/${userIdNum}`;
      data = {
        assignmentTitle: field === "title" ? value : title,
        assignmentDescription:
          field === "assignmentDescription" ? value : assignmentDescription,
        submissionType: field === "submissionType" ? value : submissionType,
      };
    }

    try {
      await api.patch(url, data);
    } catch (error) {
      console.error("수정 실패:", error);
    }
  };

  // 값 변경 시 즉시 API 요청 실행
  const handleChange = (field, value) => {
    if (field === "title") setTitle(value);
    if (field === "videoUrl") setVideoUrl(value);
    if (field === "assignmentDescription") setAssignmentDescription(value);

    handleEdit(field, value);
  };

  const toggleSubmissionType = (type) => {
    let newType;

    if (submissionType === "BOTH") {
      newType = type === "TEXT" ? "FILE" : "TEXT";
    } else if (submissionType === type) {
      newType = "";
    } else if (submissionType === "") {
      newType = type;
    } else {
      newType = "BOTH";
    }

    setSubmissionType(newType);
    handleEdit("submissionType", newType);
  };

  const handleDateChange = (date, field) => {
    if (field === "startDate") {
      setStartDate(date);
      handleEdit("startDate", date);
    } else if (field === "endDate") {
      setEndDate(date);
      handleEdit("endDate", date);
    }
    onDateChange?.(index, field, date); // 상위(`CurriculumEdit`)에도 변경된 값 전달
  };

  return (
    <Section>
      <div style={{ width: "99%" }}>
        {subSection.contentType === "video" && (
          <div>
            <DateTimeEdit
              field="startDate"
              initialDate={startDate} // 공통된 initialDate로 통합
              courseId={courseId}
              userId={userId}
              subSection={subSection}
              lectureStartDate={lectureStartDate}
              lectureEndDate={lectureEndDate}
              onDateChange={(date) => handleDateChange(date, "startDate")} // 날짜 상태만 업데이트
            />
            <div style={{ display: "flex" }}>
              <div style={{ alignSelf: "flex-start" }}>
                <VideoIconImg src={VideoIcon} />
              </div>

              <div style={{ display: "flex", width: "100%" }}>
                <VideoThumbnail>
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt="YouTube 썸네일"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "8px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    "유튜브 영상 썸네일"
                  )}
                </VideoThumbnail>

                <VideoContainer>
                  <div style={{ width: "100%" }}>
                    <VideoTitleInput
                      value={title || ""}
                      onChange={(e) => handleChange("title", e.target.value)}
                      placeholder="강의명을 작성해주세요."
                    />
                  </div>
                  <div style={{ display: "flex" }}>
                    <VideoLinkInput
                      value={videoUrl || ""}
                      onChange={handleVideoInput}
                      placeholder="유튜브 영상 링크를 입력해주세요. - https://youtu.be"
                    />

                    <VideoConfirmButton onClick={handleVideoConfirm}>
                      영상 입력하기
                    </VideoConfirmButton>
                  </div>
                </VideoContainer>
              </div>
            </div>
          </div>
        )}

        {subSection.contentType === "material" && (
          <div>
            <DateTimeEdit
              field="startDate"
              initialDate={startDate} // 공통된 initialDate로 통합
              courseId={courseId}
              userId={userId}
              subSection={subSection}
              lectureStartDate={lectureStartDate}
              lectureEndDate={lectureEndDate}
              onDateChange={(date) => handleDateChange(date, "startDate")} // 날짜 상태만 업데이트
            />
            <div style={{ display: "flex" }}>
              <MaterialIcon src={Material} />
              <MaterialSection>
                <label
                  style={{
                    className: "file-upload",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                    cursor: "pointer",
                  }}
                >
                  <UploadIcon src={Upload} />
                  <span style={{ color: "#c3c3c3", fontWeight: "bold" }}>
                    {uploadedFile || "파일 업로드"}
                  </span>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                  />
                </label>
              </MaterialSection>
            </div>
          </div>
        )}

        {subSection.contentType === "assignment" && (
          <div>
            <DateTimeEdit
              field="endDate"
              initialDate={endDate}
              courseId={courseId}
              userId={userId}
              subSection={subSection}
              lectureStartDate={lectureStartDate}
              lectureEndDate={lectureEndDate}
              onDateChange={(date) => handleDateChange(date, "endDate")}
            />
            <div style={{ display: "flex", alignItems: "flex-start" }}>
              <MaterialIcon src={Assignment} />
              <div style={{ width: "100%" }}>
                <AssignmentInput
                  value={title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="과제명을 작성해주세요."
                />
                <TextArea
                  value={assignmentDescription || ""}
                  onChange={(e) => {
                    handleChange("assignmentDescription", e.target.value);
                  }}
                  placeholder="설명을 작성해주세요."
                ></TextArea>
                <ButtonContainer>
                  <Submission>과제 제출 방식</Submission>
                  <div style={{ display: "flex" }}>
                    <SectionButton
                      selected={
                        submissionType === "TEXT" || submissionType === "BOTH"
                      }
                      onClick={() => toggleSubmissionType("TEXT")}
                    >
                      글
                    </SectionButton>
                    <SectionButton
                      selected={
                        submissionType === "FILE" || submissionType === "BOTH"
                      }
                      onClick={() => toggleSubmissionType("FILE")}
                    >
                      파일
                    </SectionButton>
                  </div>
                </ButtonContainer>
              </div>
            </div>
          </div>
        )}
        <div
          style={{
            marginTop: "1rem",
            width: "100%",
          }}
        >
          <GrayLine
            style={{
              width: "100%",
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "0.5rem",
            }}
          >
            <DeleteIcon
              src={Delete}
              alt="삭제 아이콘"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(e, index);
              }}
            />
          </div>
        </div>
      </div>
    </Section>
  );
};

export default EditableSection;
