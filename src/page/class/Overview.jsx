import { useEffect, useState, useContext, useRef } from "react";
import { useParams, useOutletContext, useLocation } from "react-router-dom";
import styled from "styled-components";
import ClassThumbnail from "../../img/class/class_thumbnail_background.svg";
import VideoIcon from "../../img/icon/videocam.svg";
import EditBtn from "../../img/class/edit_btn.svg";
import EditedBtn from "../../img/class/edited_btn.svg";
import { Section } from "../../component/class/ClassLayout.jsx";
import {
  ModalOverlay,
  ModalContent,
  AlertModalContainer,
} from "../../component/modal/ModalStyles.jsx";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import api from "../../api/api.js";
import { UsersContext } from "../../contexts/usersContext.jsx";
import EntryCodeModal from "../../component/class/EntryCodeModal.jsx";
import PropTypes from "prop-types";
import DOMPurify from "dompurify";

const IconRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
  color: var(--darkgrey-color);

  .material-symbols-outlined {
    font-size: 1.5rem;
    vertical-align: middle;
  }

  span {
    font-size: 1rem;
    font-weight: 400;
  }
`;

const Content = styled.div`
  width: 100%;
  border-radius: ${({ isEditing }) => (isEditing ? "0px" : "12px")};
  min-height: 40vh;
  height: auto;
  background-color: #ffffff;
  box-sizing: border-box;
  padding: ${({ isEditing }) => (isEditing ? "0px" : "42px 0px")};
  box-shadow: ${({ isEditing }) => (isEditing ? "-4px 0 0 #FF4747" : "none")};
`;

const StyledQuill = styled(ReactQuill)`
  width: 100%;
  min-height: 450px;

  .ql-toolbar {
    order: 2;
  }

  .ql-container {
    order: 1;
    border: none;
    box-sizing: border-box;
  }

  .ql-editor {
    font-size: 1rem;
    font-family: "Pretendard", sans-serif !important;
    padding: 10px 33px !important;
    line-height: 2.2 !important;
  }
`;

const StyledButton = styled.a`
  position: fixed;
  bottom: 12vh;
  right: 9vw;
  cursor: pointer;
  border: none;
  background-color: transparent;

  .img {
    width: 60px;

    @media (max-width: 1024px) {
      width: 35px;
    }

    @media (max-width: 768px) {
      width: 45px;
    }

    @media (max-width: 480px) {
      width: 42px;
    }

    @media (max-width: 376px) {
      width: 32px;
    }
  }

  @media all and (max-width: 1024px) {
    right: -0.8rem;
    width: 80px;
  }

  @media all and (max-width: 768px) {
    right: 0rem;
    width: 75px;
  }

  @media all and (max-width: 479px) {
    bottom: 9vh;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 640px;
  height: auto;
  margin: 0 auto;

  img {
    width: 100%;
    height: auto;
    max-height: 380px;
    object-fit: contain;
    object-position: top;
    border-radius: 12px !important;
    cursor: pointer;
  }

  .camera-icon {
    position: absolute;
    z-index: 10;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 3.5rem;
    color: rgba(255, 255, 255);
    display: ${({ isEditing }) => (isEditing ? "block" : "none")};
    pointer-events: none;
  }

  .video-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 3.5rem;
    display: ${({ isEditing, hasThumbnail }) =>
      !isEditing && !hasThumbnail ? "block" : "none"};
    pointer-events: none;
  }
`;
const TitleContainer = styled.div`
  display: flex;
  align-items: flex-end;
  margin: 15px 5px;
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: 700;
`;

const LimitText = styled.div`
  font-size: 13px;
  margin-bottom: 3px;
  margin-left: 15px;
  color: var(--main-color);
`;

const EditableSectionContent = ({ content, onChange, isEditing }) => {
  const modules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      [{ indent: "-1" }, { indent: "+1" }],
    ],
  };

  const modulesToUse = isEditing ? modules : { toolbar: false };

  const handleChange = (value) => {
    const cleanText = DOMPurify.sanitize(value, { ALLOWED_TAGS: [] })
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n");
    if (cleanText.length <= 500) {
      onChange(value);
    } else {
      let truncatedValue = value;
      while (
        DOMPurify.sanitize(truncatedValue, { ALLOWED_TAGS: [] })
          .replace(/<br\s*\/?>/gi, "\n")
          .replace(/<\/p>/gi, "\n").length > 500
      ) {
        truncatedValue = truncatedValue.slice(0, -1);
      }
      onChange(truncatedValue);
    }
  };

  return (
    <StyledQuill
      key={isEditing ? "editing" : "readOnly"}
      value={content}
      onChange={isEditing ? handleChange : () => {}}
      readOnly={!isEditing}
      modules={modulesToUse}
      theme="snow"
    />
  );
};

EditableSectionContent.propTypes = {
  content: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
};

const getPlainTextLength = (htmlContent) => {
  const cleanHtml = DOMPurify.sanitize(htmlContent, { ALLOWED_TAGS: [] });
  const textWithNewlines = cleanHtml
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n");
  return textWithNewlines.length;
};

const ClassOverview = () => {
  const context = useOutletContext();
  const { courseData } = context;
  const isCreator = context?.isCreator || false;
  const { courseId } = useParams();
  const { user } = useContext(UsersContext);

  const location = useLocation();
  const entrycode = location.state?.entrycode || null;
  const [isEntryCodeModalOpen, setIsEntryCodeModalOpen] = useState(false);
  const [sectionContent, setSectionContent] = useState("");
  const [courseThumbnail, setCourseThumbnail] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newThumbnail, setNewThumbnail] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await api.get(`/courses/${courseId}`);
        if (response.status === 200) {
          const data = response.data.data;
          setSectionContent(data.courseDescription);
          setCourseThumbnail(data.courseThumbnail);
        }
      } catch (error) {
        console.error("데이터 가져오기 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  useEffect(() => {
    if (entrycode) setIsEntryCodeModalOpen(true);
  }, [entrycode]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {};
      reader.readAsDataURL(file);

      const imageUrl = URL.createObjectURL(file);
      setNewThumbnail(imageUrl);
      setFiles([file]);
    } else {
      setNewThumbnail(null);
    }
  };

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current.click();
    }
  };

  const handleSaveClick = async () => {
    if (!user) return;

    const formData = new FormData();
    formData.append("textContent", sectionContent);

    if (files && files.length > 0) {
      formData.append("courseThumbnail", files[0]);
    }

    try {
      const response = await api.put(
        `/courses/${courseId}/${user.userId}/overview?description=${encodeURIComponent(sectionContent)}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.status === 200) {
        console.log("수정 사항이 저장되었습니다.");
        const updatedData = response.data.data;
        setSectionContent(updatedData.courseDescription);
        setCourseThumbnail(updatedData.courseThumbnail);
        setIsEditing(false);
      } else {
        console.log("수정 사항 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("수정 후 저장 요청 중 오류 발생:", error);
    }
  };

  if (loading) {
    return <div></div>;
  }

  const changeDifficultly = (difficulty) => {
    if (difficulty === "HARD") return "상";
    if (difficulty === "MEDIUM") return "중";
    if (difficulty === "EASY") return "하";
    return null;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일 시작`;
  };

  return (
    <div style={{ display: "flex", marginTop: "2rem" }}>
      <main
        style={{
          flex: 1,
          borderRadius: "8px",
        }}
      >
        <ImageContainer
          isEditing={isEditing}
          hasThumbnail={!!(newThumbnail || courseThumbnail)}
          onClick={handleImageClick}
        >
          <img
            src={newThumbnail || courseThumbnail || ClassThumbnail}
            alt="Class Thumbnail"
          />
          <span className="material-symbols-outlined camera-icon">
            camera_alt
          </span>
          <img src={VideoIcon} alt="Video Icon" className="video-icon" />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
        </ImageContainer>
        <Section style={{ marginTop: "2rem" }}>
          <Title>{courseData.courseTitle}</Title>
          <IconRow style={{ marginTop: "2rem" }}>
            <span className="material-symbols-outlined">event</span>
            <span>
              {courseData.startDate
                ? formatDate(courseData.startDate)
                : "시작 날짜 미정"}
            </span>
          </IconRow>
          <IconRow>
            <span className="material-symbols-outlined">video_library</span>
            <span>
              {courseData.durationWeeks > 0
                ? `${courseData.durationWeeks}주 커리큘럼`
                : "기간 미정"}
            </span>
          </IconRow>
          <IconRow>
            <span className="material-symbols-outlined">person</span>
            <span>{courseData.instructorName}</span>
          </IconRow>
          <IconRow style={{ gap: "0rem" }}>
            <span className="material-symbols-outlined">star</span>
            <span style={{ margin: "0rem 0.3rem 0rem 1rem" }}>강의 난이도</span>
            <span style={{ marginLeft: 0, fontWeight: 700 }}>
              {changeDifficultly(courseData.difficultyLevel)}
            </span>
          </IconRow>
        </Section>
        <TitleContainer>
          <Title style={{ marginTop: "2rem" }}>강의 소개</Title>
          {isEditing && (
            <LimitText>{getPlainTextLength(sectionContent)} / 500자</LimitText>
          )}
        </TitleContainer>
        <Content isEditing={isEditing}>
          <EditableSectionContent
            content={sectionContent}
            onChange={setSectionContent}
            isEditing={isEditing}
          />
        </Content>
      </main>
      {isCreator && (
        <StyledButton
          onClick={() => {
            if (isEditing) {
              handleSaveClick();
            } else {
              setIsEditing(true);
            }
          }}
        >
          <img
            src={isEditing ? EditedBtn : EditBtn}
            alt="Edit Button"
            className="img"
          />
        </StyledButton>
      )}

      {isEntryCodeModalOpen && (
        <ModalOverlay>
          <AlertModalContainer style={{ alignItems: "flex-start" }}>
            <div className="title">강의실을 만들었어요!</div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className="none-bold-text" style={{ marginBottom: "5px" }}>
                강의실 코드:{" "}
              </div>
              <div className="text" style={{ marginBottom: "5px" }}>
                {entrycode}
              </div>
            </div>
            <div
              className="none-bold-text"
              style={{ marginBottom: "20px", fontSize: "17px" }}
            >
              강의실 코드는 언제든지 관리 페이지에서 확인할 수 있어요
            </div>
            <div
              className="close-button"
              onClick={() => setIsEntryCodeModalOpen(false)}
            >
              확인
            </div>
          </AlertModalContainer>
        </ModalOverlay>
      )}
    </div>
  );
};

export default ClassOverview;
