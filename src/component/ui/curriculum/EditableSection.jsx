import styled from "styled-components";
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import DateTimeEdit from "../../ui/curriculum/DateTimeEdit";
import VideoIcon from "../../img/class/edit/video.svg";
import Material from "../../img/icon/pdf.svg";
import Assignment from "../../img/icon/docs.svg";
import Delete from "../../img/class/edit/delete.svg";
import Upload from "../../img/class/edit/upload.svg";
import { toLocalDateTime } from "../../page/class/CurriculumEdit";
import api from "../../api/api";
import { UsersContext } from "../../contexts/usersContext";

const Section = styled.div`
  display: flex;
  padding: 1.3rem 1.5rem;
  border-radius: 12px;
  margin: 1rem 0rem;
  background-color: #ffffff;
  position: relative;
  cursor: pointer;
  width: 100%;
`;

const VideoThumbnail = styled.div`
  width: 13rem;
  height: 7.7rem;
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
  font-family: Pretendard, Pretendard-Bold, Pretendard-ExtraBold,
    Pretendard-Light, Pretendard-Medium, Pretendard-SemiBold, Pretendard-Thin,
    sans-serif;
  width: calc(100% - 3.5vh);
  font-size: 1.03rem;
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
`;

const MaterialSection = styled.div`
  display: flex;
  background-color: var(--lightgrey-color);
  width: 100%;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.07rem;
`;

const GrayLine = styled.div`
  width: 100%;
  height: 0.9px;
  background-color: #c3c3c3;
  margin-top: 1.2rem;
  margin-bottom: 1.1rem;
`;

export const getYouTubeThumbnail = (url) => {
  try {
    if (!url || typeof url !== "string") return null;

    const videoIdMatch = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
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
  // updateSection,
}) => {
  const { courseId, lectureId } = useParams();
  const [title, setTitle] = useState(subSection?.title || "");
  const [videoUrl, setVideoUrl] = useState(subSection?.videoUrl || "");
  const [thumbnail, setThumbnail] = useState(getYouTubeThumbnail(videoUrl));
  const [uploadedFile, setUploadedFile] = useState(null);
  const [period, setPeriod] = useState(
    subSection?.startDate && subSection?.endDate
      ? `${subSection.startDate} ~ ${subSection.endDate}`
      : "기간 미정"
  );
  const [startDate, setStartDate] = useState(
    subSection?.startDate ? new Date(subSection.startDate) : new Date()
  );
  const [endDate, setEndDate] = useState(
    subSection?.endDate ? new Date(subSection.endDate) : new Date()
  );
  const [assignmentDescription, setAssignmentDescription] = useState(
    subSection?.assignmentDescription || ""
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
          subSection.originalFilename || ""
        )}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("파일 업로드 성공:", response.data);
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
        startDate: startDate,
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
        endDate: endDate,
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

  return (
    <Section>
      <div style={{ width: "99%" }}>
        {subSection.contentType === "video" && (
          <div>
            <DateTimeEdit
              field="startDate"
              initialDate={startDate} // ✅ 공통된 initialDate로 통합
              courseId={courseId}
              userId={userId}
              subSection={subSection}
              onDateChange={(date) => setStartDate(date)} // ✅ 날짜 상태만 업데이트
            />
            <div style={{ display: "flex" }}>
              <div style={{ alignSelf: "flex-start" }}>
                <img
                  src={VideoIcon}
                  style={{
                    width: "2.6rem",
                    marginLeft: "1rem",
                    marginRight: "3rem",
                  }}
                />
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

                <div
                  style={{
                    marginLeft: "2rem",
                    height: "100%",
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ width: "100%" }}>
                    <Input
                      value={title || ""}
                      onChange={(e) => handleChange("title", e.target.value)}
                      placeholder="강의명을 작성해주세요."
                      style={{
                        border: "2px solid #c3c3c3",
                        borderRadius: "7px",
                        color: "black",
                        padding: "15px",
                        fontSize: "16px",
                        fontWeight: "bold",
                        width: "100%",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <div style={{ display: "flex" }}>
                    <Input
                      value={videoUrl || ""}
                      onChange={handleVideoInput}
                      placeholder="유튜브 영상 링크를 입력해주세요. - https://youtu.be"
                      style={{
                        border: "2px solid #c3c3c3",
                        borderRadius: "7px",
                        color: "black",
                        padding: "15px",
                        fontSize: "16px",
                        fontWeight: "bold",
                        width: "100%",
                        boxSizing: "border-box",
                      }}
                    />

                    <button
                      onClick={handleVideoConfirm}
                      style={{
                        backgroundColor: "var(--main-color)",
                        color: "var(--white-color)",
                        width: "30%",
                        marginLeft: "1rem",
                        border: "none",
                        borderRadius: "5px",
                        fontSize: "16px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      영상 입력하기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {subSection.contentType === "material" && (
          <div>
            <DateTimeEdit
              field="startDate"
              initialDate={startDate} // ✅ 공통된 initialDate로 통합
              courseId={courseId}
              userId={userId}
              subSection={subSection}
              onDateChange={(date) => setStartDate(date)} // ✅ 날짜 상태만 업데이트
            />
            <div style={{ display: "flex" }}>
              <img
                src={Material}
                style={{
                  width: "2.4rem",
                  marginLeft: "1rem",
                  marginRight: "3rem",
                }}
              />
              <MaterialSection style={{ border: "2px solid #c3c3c3" }}>
                <label
                  style={{
                    className:"file-upload",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={Upload}
                    style={{ width: "1.2rem", marginRight: "1rem" }}
                  />
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
              initialDate={endDate} // ✅ 공통된 initialDate로 통합
              courseId={courseId}
              userId={userId}
              subSection={subSection}
              onDateChange={(date) => setEndDate(date)} // ✅ 날짜 상태만 업데이트
            />
            <div style={{ display: "flex", alignItems: "flex-start" }}>
              <img
                src={Assignment}
                style={{
                  width: "2.4rem",
                  marginLeft: "1rem",
                  marginRight: "3rem",
                }}
              />
              <div style={{ width: "100%" }}>
                <Input
                  value={title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="과제명을 작성해주세요."
                  style={{
                    border: "2px solid #c3c3c3",
                    borderRadius: "7px",
                    color: "black",
                    padding: "15px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    width: "100%",
                    boxSizing: "border-box",
                    marginBottom: "1rem",
                    fontFamily:
                      "Pretendard, Pretendard-Bold, Pretendard-ExtraBold, Pretendard-Light, Pretendard-Medium, Pretendard-SemiBold, Pretendard-Thin, sans-serif",
                  }}
                />
                <TextArea
                  value={assignmentDescription || ""}
                  onChange={(e) => {
                    handleChange("assignmentDescription", e.target.value);
                  }}
                  placeholder="설명을 작성해주세요."
                ></TextArea>
              </div>
            </div>
          </div>
        )}
        <div
          style={{
            marginTop: "1rem",
            width: "100%", // Section 전체 너비 사용
          }}
        >
          <GrayLine
            style={{
              width: "100%", // Section 전체 너비를 사용
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end", // 오른쪽 끝 정렬
              marginTop: "0.5rem", // 간격 조정
            }}
          >
            <img
              src={Delete}
              alt="삭제 아이콘"
              style={{
                width: "1.25rem",
                cursor: "pointer",
                marginRight: "1rem",
                marginBottom: "0.5rem",
              }}
              onClick={(e) => {
                e.stopPropagation(); // 클릭 이벤트 버블링 방지
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
