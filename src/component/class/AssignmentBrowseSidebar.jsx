import React from "react";
import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

export default function AssignmentBrowseSidebar({
  students,
  selectedId,
  onSelect,
}) {
  const [activeMenu, setActiveMenu] = useState("browse");
  const location = useLocation();
  const navigate = useNavigate();
  const { courseId, lectureId } = useParams();

  useEffect(() => {
    if (location.pathname.includes("/assignment/browse")) {
      setActiveMenu("browse");
    } else {
      setActiveMenu("curriculum");
    }
  }, [location.pathname]);

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    if (menu === "browse") {
      navigate(`/class/${courseId}/assignment/browse/${lectureId}`);
    } else {
      if (location.pathname.includes("/assignment/browse")) {
        navigate(`/class/${courseId}/assignment/submit/${lectureId}/`);
      }
    }
  };

  return (
    <SidebarWrapper>
      <MenuContainer>
        <MenuItem
          //active={activeMenu === "curriculum"}
          //onClick={() => handleMenuClick("curriculum")}
          style={{
            cursor: "auto",
          }}
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
      <StudentList>
        {students.map((student) => (
          <StudentItem
            key={student.id}
            selected={student.id === selectedId}
            disabled={student.disabled}
            onClick={() => !student.disabled && onSelect(student.id)}
          >
            {student.name}
            {student.disabled && (
              <span style={{ color: "#bbb", marginLeft: 4 }}>(나)</span>
            )}
          </StudentItem>
        ))}
      </StudentList>
    </SidebarWrapper>
  );
}

import styled from "styled-components";

const SidebarWrapper = styled.div`
  width: 20vw;
  background: #fff;
  height: 70vh;
  border-radius: 20px;
  padding: 25px 20px;
  overflow-y: scroll;

  @media (max-width: 376px) {
    width: 80%;
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

const StudentList = styled.ul`
  list-style: none;
  padding: 0 0 0 0;
  margin: 0;
`;

const StudentItem = styled.li`
  padding: 10px 18px;
  margin: 0 10px 8px 10px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: ${({ selected }) => (selected ? 600 : 400)};
  color: ${({ disabled, selected }) =>
    disabled ? "#D9D9D9" : selected ? "#000000" : "#000000"};
  background: ${({ selected }) => (selected ? "#FFD1D1" : "transparent")};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: background 0.15s;

  &:hover {
    background: ${({ disabled, selected }) =>
      disabled || selected ? "" : "#F8F8F8"};
  }
`;
