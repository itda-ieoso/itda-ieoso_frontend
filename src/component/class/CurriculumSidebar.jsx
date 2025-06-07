import styled from "styled-components";
import PropTypes from "prop-types";
import Assignment from "../../img/icon/curriculum/assignmenticon.svg";
import Material from "../../img/icon/curriculum/materialicon.svg";
import Class from "../../img/icon/curriculum/videoicon.svg";
import SelectedSection from "../../img/class/check/sel_sec.svg";
import UnselectedSection from "../../img/class/check/unsel_sec.svg";
import DoneSection from "../../img/class/check/done_sec.svg";
import Check from "../../img/class/check/check.svg";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect, useContext } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import { UsersContext } from "../../contexts/usersContext.jsx";

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
    width: 35%;
    padding: 1rem 0;
    height: 100%;
    background-color: white;
    z-index: 1100;
    transition: left 0.3s ease-in-out;
    box-shadow: 2px 0px 10px rgba(0, 0, 0, 0.1);
  }
`;

const SidebarContainer = styled.aside`
  width: 17%;
  height: 90vh;
  background-color: white;
  border-radius: 12px;
  padding: 1rem;
  margin-top: 3.5vh;
  letter-spacing: -0.5px;

  @media (max-width: 1024px) {
    font-size: 13px;
  }

  @media (max-width: 768px) {
    width: 16%;
    padding: 1vh 2vh;
    border-radius: 7px;
  }

  @media (max-width: 480px) {
    width: 20%;
  }

  @media (max-width: 376px) {
    width: 80%;
    height: 100%;
    margin-top: 2vh;
  }
`;

const ListSection = styled.div`
  margin-bottom: -2vh;
  padding: 0.7rem 0rem;
  transition: background-color 0.3s ease;

  @media (max-width: 480px) {
    padding: 1vh 0vh;
  }
`;

const SectionHeader = styled.div`
  font-weight: 700;
  font-size: 1.12rem;
  color: var(--black-color);
  padding: 1.3vh 2vh;
  display: flex;
  align-items: center;
  background-color: ${(props) =>
    props.selected ? "var(--pink-color)" : "#ffffff"};
  margin-bottom: 0rem;
  border-radius: 9px;
  cursor: pointer;

  @media (max-width: 1024px) {
    font-size: 17px;
    padding: 1vh 1vh;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 1vh 1vh;
    border-radius: 7px;
  }

  @media (max-width: 480px) {
    font-size: 11px;
    font-weight: 650;
    padding: 1vh 1.5vh;
    border-radius: 6px;
  }
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-left: 1.9vh;
  border-radius: 0.5rem;
  font-size: 12px;
  font-weight: 500;
  position: relative;

  @media (max-width: 1024px) {
    font-size: 12px;
  }

  @media (max-width: 768px) {
    font-size: 11px;
    gap: 0.5vh;
  }

  @media (max-width: 480px) {
    font-size: 10px;
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
  width: 2.5vh;

  @media (max-width: 1024px) {
    width: 2.2vh;
  }

  @media (max-width: 768px) {
    width: 2vh;
  }

  @media (max-width: 480px) {
    width: 1.8vh;
  }

  @media (max-width: 440px) {
    width: 1.6vh;
  }
`;

const Icon = styled.img`
  width: ${(props) => (props.type === "video" ? "1.2rem" : "1rem")};

  @media (max-width: 768px) {
    width: ${(props) => (props.type === "video" ? "1rem" : "0.8rem")};
  }

  @media (max-width: 480px) {
    width: ${(props) => (props.type === "video" ? "1rem" : "0.8rem")};
  }

  @media (max-width: 440px) {
    width: ${(props) => (props.type === "video" ? "1rem" : "0.8rem")};
  }
`;

const CheckIcon = styled.img`
  margin-left: auto;
  margin-right: 2.5vh;
  width: 8px;

  @media (max-width: 1024px) {
    margin-right: 1.3vh;
  }

  @media (max-width: 768px) {
    margin-right: 1.3vh;
  }

  @media (max-width: 480px) {
    width: 6px;
  }
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
  completedLectures,
}) => {
  const context = useOutletContext();
  const courseData = context?.courseData || {};
  const isCreator = context?.isCreator || false;
  const { courseId } = useParams();
  const { user } = useContext(UsersContext);
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 376);

  useEffect(() => {
    const isMobileView = window.matchMedia("(max-width: 376px)").matches;
    setIsMobile(isMobileView);
    setShowSidebar(!isMobileView);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.matchMedia("(max-width: 376px)").matches;
      setIsMobile(isMobileView);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowSidebar((prev) => !prev);
  };

  const handleItemClick = (lectureId) => {
    setActiveItem(lectureId);
    navigate(`/class/${courseId}/curriculum/${lectureId}`);
    if (isMobile) setShowSidebar(false);
  };

  const renderSidebarContent = () => (
    <>
      {sections.map((section) => {
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
          (a, b) => (a.contentOrderIndex || 0) - (b.contentOrderIndex || 0),
        );

        const filteredSubSections = isCreator
          ? subSections
          : subSections.filter((sub) =>
              Object.values(sub).every((value) => value !== null),
            );

        return (
          <ListSection key={section.lectureId}>
            <SectionHeader
              selected={activeItem === section.lectureId}
              onClick={() => handleItemClick(section.lectureId)}
            >
              {`${section.lectureTitle}`}
              {!edit && !isCreator && (
                <SectionIcon
                  src={
                    completedLectures[section.lectureId]
                      ? DoneSection
                      : activeItem === section.lectureId
                        ? SelectedSection
                        : UnselectedSection
                  }
                />
              )}
            </SectionHeader>
            {activeItem === section.lectureId && (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {filteredSubSections?.map((subSection) => (
                  <div
                    key={subSection.id}
                    style={{ marginLeft: "0", marginBottom: "10px" }}
                  >
                    <ListItem
                      active={activeItem === subSection.id}
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
                        type={subSection.contentType}
                      />
                      <TruncatedText width="10rem">
                        {getSubSectionTitle(subSection)}
                      </TruncatedText>
                      {!edit && !isCreator && <CheckIcon src={Check} />}
                    </ListItem>
                  </div>
                ))}
              </ul>
            )}
          </ListSection>
        );
      })}
    </>
  );

  return (
    <>
      {isMobile && (
        <MobileToggleButton type="button" onClick={toggleSidebar}>
          {showSidebar ? (
            <CloseIcon style={{ fontSize: "2.8vh" }} />
          ) : (
            <MenuIcon style={{ fontSize: "2.8vh" }} />
          )}
        </MobileToggleButton>
      )}

      {isMobile ? (
        <SidebarSlideWrapper show={showSidebar}>
          <SidebarContainer>{renderSidebarContent()}</SidebarContainer>
        </SidebarSlideWrapper>
      ) : (
        <SidebarContainer>{renderSidebarContent()}</SidebarContainer>
      )}
    </>
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
        }),
      ).isRequired,
    }),
  ).isRequired,
  activeItem: PropTypes.number,
  setActiveItem: PropTypes.func.isRequired,
  edit: PropTypes.bool.isRequired,
};

export default CurriculumSidebar;
