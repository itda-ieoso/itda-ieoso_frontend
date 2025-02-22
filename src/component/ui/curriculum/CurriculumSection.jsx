import styled from "styled-components";
import PropTypes from "prop-types";
import ClassThumbnail from "../../img/class/class_thumbnail.svg";
import PlayIcon from "../../img/class/play_icon.svg";
import Material from "../../img/icon/pdf.svg";
import Assignment from "../../img/icon/docs.svg";
import EditContainer from "../../ui/curriculum/EditContainer";
import EditableSection from "./EditableSection";
import { getYouTubeThumbnail } from "./EditableSection";
import { formatDate } from "../../page/class/Curriculum";

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

const CurriculumTitle = styled.h3`
  font-size: 1.63rem;
  font-weight: 900;
  margin-bottom: -0.3rem;
  margin-top: 0.5rem;
`;

const VideoContainer = styled.div`
  position: relative;
  width: 14.5rem;
  border-radius: 8px;
`;

const VideoThumbnail = styled.img`
  width: 100%;
  border-radius: 8px;
`;

const MaterialSection = styled.div`
  display: flex;
  background-color: var(--lightgrey-color);
  width: 100%;
  padding: 1.2rem 1.5rem;
  border-radius: 8px;
  font-size: 1.07rem;
`;

const formatPeriod = (startDate, endDate) => {
  return startDate && endDate ? `${startDate} ~ ${endDate}` : "기간 미정";
};

const CurriculumSection = ({
  subSection,
  index,
  handleAdd,
  handleDelete,
  handleSectionClick,
  editTarget,
  updateSection,
}) => {
  const isEditing = subSection.isEditing;
  

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
          />
        </div>
      ) : (
        <>
          {subSection.contentType === "video" && (
            <>
              <VideoContainer>
                <VideoThumbnail
                  src={getYouTubeThumbnail(subSection.videoUrl)}
                />
                <img
                  src={PlayIcon}
                  alt="Play Icon"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "1.8rem",
                    height: "auto",
                    cursor: "pointer",
                  }}
                />
              </VideoContainer>
              <div style={{ marginLeft: "2rem" }}>
                <CurriculumTitle>
                  {subSection.title ?? "영상 제목 없음"}
                </CurriculumTitle>
                <p style={{ color: "#909090", display: "flex", gap: "0.5rem" }}>
                  <span>김잇다</span>
                  <span
                    style={{
                      borderLeft: "1.5px solid #909090",
                      height: "1rem",
                    }}
                  ></span>
                  <span>
                    {formatDate(subSection?.startDate)} ~{" "}
                    {formatDate(subSection?.endDate)}
                  </span>
                </p>
              </div>
            </>
          )}

          {subSection.contentType === "material" && (
            <>
              <img
                src={Material}
                style={{
                  width: "2.4rem",
                  marginLeft: "1rem",
                  marginRight: "3rem",
                }}
              />
              <MaterialSection>
                <span style={{ marginRight: "0.6rem" }}>
                  {subSection.originalFilename ?? "자료 없음"}
                </span>
                <span
                  style={{ color: "var(--main-color)", fontSize: "0.9rem" }}
                >
                  {subSection.fileSize ?? " "}
                </span>
              </MaterialSection>
            </>
          )}

          {subSection.contentType === "assignment" && (
            <>
              <img
                src={Assignment}
                alt="assignment icon"
                style={{
                  width: "2.4rem",
                  marginLeft: "1rem",
                  marginRight: "3rem",
                }}
              />
              <MaterialSection>
                <span style={{ marginRight: "0.8rem" }}>
                  {subSection.assignmentTitle ?? "과제 없음"}
                </span>
                <span style={{ color: "var(--main-color)" }}>
                  {formatDate(subSection?.startDate)} ~{" "}
                  {formatDate(subSection?.endDate)}
                </span>
              </MaterialSection>
            </>
          )}
        </>
      )}
    </Section>
  );
};

export default CurriculumSection;
