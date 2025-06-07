import styled from "styled-components";
import PropTypes from "prop-types";
import ClassThumbnail from "../../img/class/class_thumbnail.svg";
import PlayIcon from "../../img/class/play_icon.svg";
import Material from "../../img/icon/curriculum/materialicon.svg";
import Assignment from "../../img/icon/curriculum/assignmenticon.svg";
import EditContainer from "./EditContainer.jsx";
import EditableSection from "./EditableSection.jsx";
import { getYouTubeThumbnail } from "./EditableSection.jsx";
import { formatDate } from "../../page/class/Curriculum.jsx";

const Section = styled.div`
  display: flex;
  align-items: center;
  padding: 1.3rem 1.5rem;
  margin: 0.5525rem 0rem;
  border-radius: 14px;
  background-color: #ffffff;
  position: relative;
  cursor: pointer;
  width: 97.5%;

  @media (max-width: 1024px) {
    padding: 1.35vh 1.55vh;
    width: 99%;
  }

  @media (max-width: 768px) {
    padding: 1.3vh 1.4vh;
    width: 100%;
  }
  @media (max-width: 480px) {
    border-radius: 6px;
    margin: 2vh 0vh;
    padding: 2.5vh 3vh;
    box-sizing: border-box;
  }
`;

const CurriculumTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: -0.3rem;
  margin-top: 0.5rem;

  @media (max-width: 1024px) {
    font-size: 20px;
  }

  @media (max-width: 768px) {
    font-size: 16px;
    margin-left: -2vh;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 0.3vh 1vh;
    font-weight: 600;
  }

  @media (max-width: 376px) {
    font-size: 11px;
    font-weight: 600;
  }
`;

const VideoContainer = styled.div`
  position: relative;
  width: 22%;
  aspect-ratio: 4 / 2.6;
  border-radius: 8px;

  @media (max-width: 1024px) {
    width: 30%;
  }

  @media (max-width: 768px) {
    width: 27%;
  }
  @media (max-width: 480px) {
    border-radius: 4px;
  }
`;

const VideoInformation = styled.div`
  margin-left: 2.4vh;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  align-self: flex-start;

  @media (max-width: 1200px) {
    margin-left: 1.8vh;
  }

  @media (max-width: 1024px) {
    margin-left: 1.5vh;
  }

  @media (max-width: 768px) {
    margin-left: 3vh;
  }
`;

const VideoThumbnail = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 8px;

  @media (max-width: 480px) {
    border-radius: 4.5px;
  }
`;

const EmptyVideoThumbnail = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  border: solid 1.5px #c3c3c3;

  @media (max-width: 768px) {
    border-radius: 4.5px;
    border: solid 1.3px #c3c3c3;
  }
`;

const Play = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1.8rem;
  height: auto;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 2vh;
  }

  @media (max-width: 480px) {
    width: 2.5vh;
  }
`;

const VideoDetails = styled.p`
  font-size: 14px;
  color: #909090;
  display: flex;
  align-items: center;
  gap: 1vh;

  @media (max-width: 1024px) {
    font-size: 11px;
    gap: 0.5vh;
  }
  @media (max-width: 768px) {
    font-size: 10px;
    margin-left: -2vh;
  }
  @media (max-width: 480px) {
    font-size: 8px;
    margin-left: -1vh;
  }

  & > div {
    display: flex;
    align-items: center;
    gap: 1.3vh;

    @media (max-width: 1024px) {
      gap: 0.5vh;
    }

    @media (max-width: 768px) {
      gap: 0.5vh;
    }
  }
`;

const BlackLine = styled.span`
  border-left: 1px solid #909090;
  height: 1rem;

  @media (max-width: 768px) {
    border-left: 1px solid #909090;
    height: 1.3vh;
  }

  @media (max-width: 480px) {
    border-left: 0.5px solid #909090;
  }
`;

const MaterialSection = styled.div`
  display: flex;
  align-items: center;
  background-color: var(--lightgrey-color);
  width: 100%;
  padding: 1.2rem 1.5rem;
  border-radius: 8px;
  font-size: 1.07rem;

  @media (max-width: 1024px) {
    padding: 1.5vh;
  }

  @media (max-width: 768px) {
    padding: 1.7vh;
    width: 100%;
  }

  @media (max-width: 480px) {
    border-radius: 4px;
  }
`;

const MaterialIcon = styled.img`
  width: 3.7vh;
  margin-left: 1rem;
  margin-right: 1rem;

  @media (max-width: 1024px) {
    width: 3.2vh;
    margin-right: 1.1vh;
  }

  @media (max-width: 768px) {
    width: 2.8vh;
  }

  @media (max-width: 480px) {
    width: 2.5vh;
    margin-left: 0rem;
    margin-right: 0rem;
  }
`;

const AssignmentTitle = styled.span`
  flex-shrink: 1;
  overflow: hidden;
  margin-right: 0.8rem;

  font-size: 16px;
  @media (max-width: 1024px) {
    font-size: 13px;
  }
  @media (max-width: 768px) {
    font-size: 12px;
  }
  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

const SectionTitle = styled.span`
  margin-right: 0.6rem;
  cursor: pointer;
  display: inline-block;
  flex-shrink: 1;
  overflow: hidden;
  font-size: 16px;

  @media (max-width: 1024px) {
    font-size: 13px;
  }
  @media (max-width: 768px) {
    font-size: 12px;
  }
  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

const FileSize = styled.span`
  color: var(--main-color);
  font-size: 0.9rem;
  font-size: 14px;

  @media (max-width: 1024px) {
    font-size: 11px;
  }
  @media (max-width: 768px) {
    font-size: 10px;
  }
  @media (max-width: 480px) {
    font-size: 8px;
  }
`;

const AssignmentDate = styled.span`
  color: var(--main-color);
  whitespace: nowrap;
  flexshrink: 0;
  margin-left: 1vh;
  font-size: 14px;

  @media (max-width: 1024px) {
    font-size: 11px;
    margin-left: 0.6vh;
  }
  @media (max-width: 768px) {
    font-size: 10px;
    margin-left: 0.3vh;
  }
  @media (max-width: 480px) {
    font-size: 8px;
    margin-left: 0vh;
  }
`;

const CurriculumSection = ({
  lecture,
  subSection,
  index,
  handleAdd,
  handleDelete,
  handleSectionClick,
  onDateChange,
  editTarget,
  updateSection,
}) => {
  const isEditing = subSection.isEditing;

  const truncatedText = (text) => {
    if (!text) return "";

    const width = window.innerWidth;

    let maxLength = 10;
    if (width >= 1024) maxLength = 20;
    else if (width >= 768) maxLength = 15;
    else if (width >= 480) maxLength = 9;

    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const materialTruncatedText = (text) => {
    if (!text) return "";

    const width = window.innerWidth;

    let maxLength = 10;
    if (width >= 1024) maxLength = 30;
    else if (width >= 768) maxLength = 20;
    else if (width >= 480) maxLength = 15;

    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <Section onClick={(event) => handleSectionClick(index, event)}>
      {isEditing ? (
        <div style={{ display: "flex", width: "100%", position: "relative" }}>
          <EditContainer handleAdd={handleAdd} index={index} />

          <EditableSection
            subSection={subSection}
            index={index}
            handleDelete={handleDelete}
            className="editable-section"
            onDateChange={onDateChange}
          />
        </div>
      ) : (
        <>
          {subSection.contentType === "video" && (
            <>
              <VideoContainer>
                {subSection.videoUrl ? (
                  <VideoThumbnail
                    src={getYouTubeThumbnail(subSection.videoUrl)}
                    alt="Video Thumbnail"
                  />
                ) : (
                  <EmptyVideoThumbnail />
                )}
                <Play src={PlayIcon} alt="Play Icon" />
              </VideoContainer>
              <VideoInformation>
                <CurriculumTitle>
                  {subSection.title ?? "영상 제목 없음"}
                </CurriculumTitle>

                <VideoDetails>
                  <div style={{ whiteSpace: "nowrap" }}>
                    <span>{lecture.instructorName}</span>
                    <BlackLine />
                  </div>

                  <span>
                    {formatDate(subSection?.startDate)} ~{" "}
                    {formatDate(subSection?.endDate)}
                  </span>
                </VideoDetails>
              </VideoInformation>
            </>
          )}

          {subSection.contentType === "material" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                width: "100%",
              }}
            >
              <MaterialIcon src={Material} />
              <MaterialSection>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "0.5vh",
                  }}
                >
                  <SectionTitle>
                    {materialTruncatedText(subSection.originalFilename) ??
                      "자료 없음"}
                  </SectionTitle>
                  <FileSize>{subSection?.fileSize || ""}</FileSize>
                </div>
              </MaterialSection>
            </div>
          )}

          {subSection.contentType === "assignment" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                width: "100%",
              }}
            >
              <MaterialIcon src={Assignment} alt="assignment icon" />
              <MaterialSection
                style={{
                  flexWrap: "wrap",
                }}
              >
                <AssignmentTitle>
                  {truncatedText(subSection.assignmentTitle) ?? "과제 없음"}
                </AssignmentTitle>
                <AssignmentDate>
                  {formatDate(subSection?.startDate)} ~{" "}
                  {formatDate(subSection?.endDate)}
                </AssignmentDate>
              </MaterialSection>
            </div>
          )}
        </>
      )}
    </Section>
  );
};

export default CurriculumSection;
