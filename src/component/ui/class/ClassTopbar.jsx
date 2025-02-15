import { useState, useContext, useEffect, useRef } from "react";
import { NavLink, useParams, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import PropTypes from "prop-types";
import Container from "../Container";
import StarIcon from "@mui/icons-material/Star";
import { getMyCoursesTitles } from "../../api/classApi";
import { UsersContext } from "../../contexts/usersContext";

const Navbar = styled.div`
  background-color: var(--white-color);
  min-width: 95%;
  padding: 0.5rem 1.3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 15px;
  font-size: 1.3rem;

  @media (max-width: 1024px) {
    font-size: 1.3rem;
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const VerticalLine = styled.div`
  width: 1px;
  height: 3.4rem;
  background-color: #cdcdcd;
`;

const Dropdown = styled.div`
  position: relative;
  display: inline-block;
  font-weight: bold;
  min-width: 7rem;
`;

const DropdownButton = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 10px;
  cursor: pointer;
  background-color: var(--white-color);
  border-radius: 8px;
  font-weight: bold;
  color: var(--black-color);
  white-space: nowrap;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 155%;
  left: 0;
  background-color: var(--white-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  z-index: 10;
  width: 225%;
  padding: 1rem 0;
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
`;

const MenuTitle = styled.div`
  font-size: 0.87rem;
  font-weight: bold;
  color: #cdcdcd;
  padding: 0.5rem 1rem;
`;

const MenuItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 1rem;
  margin: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  border-radius: 12px;
  background-color: ${({ selected }) => (selected ? "#F7F7F7" : "var(--white-color)")};
  color: ${({ selected }) => (selected ? "var(--black-color)" : "#474747")};

  &:hover {
    background-color: #F7F7F7;
  }

  .star-icon {
    color: ${({ selected }) => (selected ? "var(--highlight-color)" : "var(--darkgrey-color)")};
    font-size: 1rem;
  }
`;

const TabLinkContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto; 
  overflow-y: hidden; 
  white-space: nowrap; 
  padding-bottom: 0.5rem; 

  &::-webkit-scrollbar {
    height: 2px; 
  }

  &::-webkit-scrollbar-thumb {
    background: var(--natural-color); 
    border-radius: 10px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  scrollbar-width: thin;
  scrollbar-color: var(--natural-color) transparent;
`;

const TabLink = styled(NavLink)`
  width: 6rem;
  text-align: center;
  padding: 5px 10px;
  text-decoration: none;
  color: var(--darkgrey-color);
  font-weight: bold;
  font-size: 1.2rem;
  position: relative;

  &.active {
    color: var(--black-color);
  }

  &.active::after {
    content: "";
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: var(--black-color);
  }

  .scrolling &.active::after {
    display: none;
  }
`;

const ClassTopbar = ({ onCourseChange }) => {
  const { user } = useContext(UsersContext);
  const { courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [classOptions, setClassOptions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const tabRef = useRef(null);

  useEffect(() => {
    const fetchClasses = async () => {
      if (!user?.userId) return;
      const courses = await getMyCoursesTitles(user.userId);
      console.log("불러온 강의 목록", courses);
      setClassOptions(courses);
    };

    fetchClasses();
  }, [user?.userId]);

  useEffect(() => {
    const checkScrollable = () => {
      if (tabRef.current) {
        setIsScrollable(tabRef.current.scrollWidth > tabRef.current.clientWidth);
      }
    };

    checkScrollable();
    window.addEventListener("resize", checkScrollable);
    return () => window.removeEventListener("resize", checkScrollable);
  }, []);

  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const getActiveTab = () => {
    if (location.pathname.includes("/overview/notice")) return "overview";
    if (location.pathname.includes("/curriculum")) return "curriculum";
    if (location.pathname.includes("/admin")) return "admin";
    return "";
  };

  return (
    <Navbar>
      <Container style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <span className="material-symbols-outlined" style={{ fontSize: "1.8rem", cursor: "pointer" }} onClick={() => navigate("/class/list")}>
          home
        </span>
        <VerticalLine />
        <Dropdown>
          <DropdownButton onClick={handleDropdownToggle}>
            {classOptions.find((course) => String(course.courseId) === String(courseId))?.courseTitle || "강의실 선택"}
            <span style={{ marginLeft: "1rem" }}>▼</span>
          </DropdownButton>
          <DropdownMenu isOpen={isDropdownOpen}>
            <MenuTitle>강의실 목록</MenuTitle>
            {classOptions.map((course) => (
              <MenuItem
                key={course.courseId}
                selected={String(courseId) === String(course.courseId)}
                onClick={() => {
                  onCourseChange(course.courseId);
                  setIsDropdownOpen(false);
                }}
              >
                <div>{course.courseTitle}</div>
                {course.isManageable && <StarIcon className="star-icon" />}
              </MenuItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </Container>
      <TabLinkContainer ref={tabRef} className={isScrollable ? "scrolling" : ""}>
        <TabLink to={`/class/${courseId}/overview/info`} className={getActiveTab() === "overview" ? "active" : ""}>
          개요
        </TabLink>
        <TabLink to={`/class/${courseId}/curriculum`} className={getActiveTab() === "curriculum" ? "active" : ""}>
          커리큘럼
        </TabLink>
        <TabLink to={`/class/${courseId}/admin/summary`} className={getActiveTab() === "admin" ? "active" : ""}>
          관리
        </TabLink>
      </TabLinkContainer>
    </Navbar>
  );
};

ClassTopbar.propTypes = {
  onCourseChange: PropTypes.func.isRequired,
};

export default ClassTopbar;
