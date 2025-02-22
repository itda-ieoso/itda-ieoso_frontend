import styled from "styled-components";
import PropTypes from "prop-types";
import Assignment from "../../img/icon/docs.svg";
import Material from "../../img/icon/pdf.svg";
import Class from "../../img/class/class.svg";
import SelectedSection from "../../img/class/check/sel_sec.svg";
import UnselectedSection from "../../img/class/check/unsel_sec.svg";
import DoneSection from "../../img/class/check/done_sec.svg";
import Check from "../../img/class/check/check.svg";
import { useState, useContext } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import { UsersContext } from "../../contexts/usersContext";

const SidebarContainer = styled.aside`
  width: 28vh;
  height: 90vh;
  background-color: white;
  border-radius: 12px;
  padding: 1rem;
  margin-top: 2rem;
  letter-spacing: -0.5px;
`;

const ListSection = styled.div`
  margin-bottom: -2vh;
  padding: 0.7rem 0rem;
  transition: background-color 0.3s ease;
`;

const SectionHeader = styled.div`
  font-weight: 900;
  font-size: 1.1rem;
  color: var(--black-color);
  padding: 0rem 1rem;
  height: 3rem;
  display: flex;
  align-items: center;
  background-color: ${(props) =>
    props.selected ? "var(--pink-color)" : "#ffffff"};
  margin-bottom: 0rem;
  border-radius: 9px;
  cursor: pointer;
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-left: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: semi-bold;
  position: relative;
`;

const SubsectionContainer = styled.div`
  padding-left: 1.4rem;
  margin-top: 0.3rem;
`;

const SubsectionItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  position: relative;
  font-size: 0.95rem;
  font-weight: semi-bold;

  & > img {
    position: absolute;
    right: 0;
  }
`;

const TruncatedText = styled.span`
  display: inline-block;
  max-width: ${(props) => props.width || "4rem"};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
`;

const SectionIcon = styled.img`
  margin-left: auto;
`;

const Icon = styled.img`
  width: 1.23rem;
`;

const getIconByType = (type) => {
  switch (type) {
    case "video":
      return Class;
    case "material":
      return Material;
    case "assignment":
      return Assignment;
    default:
      return Class;
  }
};

const getSubSectionTitle = (subSection) => {
  return subSection.title || "제목 없음";
};

const CurriculumSidebar = ({
  sections = [],
  activeItem,
  setActiveItem,
  edit,
}) => {
  const context = useOutletContext();
  const courseData = context?.courseData || {};
  const isCreator = context?.isCreator || false;
  const { courseId } = useParams();
  const { user } = useContext(UsersContext);
  const navigate = useNavigate();

  const handleItemClick = (lectureId) => {
    setActiveItem(lectureId);
    navigate(`/class/${courseId}/curriculum/${lectureId}`);
  };

  return (
    <SidebarContainer>
      {sections.map((section, lectureIndex) => {
        const subSections = [
          ...(section.videos || []).map((v) => ({
            ...v,
            title: v.videoTitle,
            contentType: "video",
            id: v.contentOrderId,
          })),
          ...(section.materials || []).map((m) => ({
            ...m,
            title: m.originalFilename,
            contentType: "material",
            id: m.contentOrderId,
          })),
          ...(section.assignments || []).map((a) => ({
            ...a,
            title: a.assignmentTitle,
            contentType: "assignment",
            id: a.contentOrderId,
          })),
        ].sort(
          (a, b) => (a.contentOrderIndex || 0) - (b.contentOrderIndex || 0)
        );

        return (
          <ListSection key={section.lectureId}>
            <SectionHeader
              selected={activeItem === section.lectureId}
              onClick={() => handleItemClick(section.lectureId)}
            >
              {`${lectureIndex + 1}. ${section.lectureTitle}`}
              {!edit && (
                <SectionIcon
                  src={
                    !section.selected
                      ? UnselectedSection
                      : section.done
                      ? DoneSection
                      : SelectedSection
                  }
                  style={{
                    width: "1.5rem",
                  }}
                />
              )}
            </SectionHeader>
            {activeItem === section.lectureId && (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {subSections.map((subSection) => (
                  <div
                    key={subSection.id}
                    style={{ marginLeft: "0", marginBottom: "10px" }}
                  >
                    <ListItem
                      active={activeItem === subSection.id}
                      onClick={() => handleItemClick(subSection.id)}
                      style={{
                        marginLeft:
                          subSection.contentType === "material" ||
                          subSection.contentType === "assignment"
                            ? "-2px"
                            : "-5px",
                        marginBottom: "10px",
                      }}
                    >
                      <Icon
                        src={getIconByType(subSection.contentType)}
                        style={{ width: "1.4rem" }}
                      />
                      <TruncatedText width="10rem">
                        {getSubSectionTitle(subSection)}
                      </TruncatedText>
                      {!edit && (
                        <img
                          src={Check}
                          style={{ marginLeft: "auto", marginRight: "1.3rem" }}
                        />
                      )}
                    </ListItem>
                  </div>
                ))}
              </ul>
            )}
          </ListSection>
        );
      })}
    </SidebarContainer>
  );
};

CurriculumSidebar.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      lectureId: PropTypes.number.isRequired,
      lectureTitle: PropTypes.string.isRequired,
      subSections: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          type: PropTypes.string.isRequired,
          videoTitle: PropTypes.string,
          materialTitle: PropTypes.string,
          assignmentTitle: PropTypes.string,
        })
      ).isRequired,
    })
  ).isRequired,
  activeItem: PropTypes.number,
  setActiveItem: PropTypes.func.isRequired,
  edit: PropTypes.bool.isRequired,
};

export default CurriculumSidebar;
