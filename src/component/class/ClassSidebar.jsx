import styled from "styled-components";
import PropTypes from "prop-types";
import { useLocation, useNavigate, useParams } from "react-router-dom"; // react-router-dom 추가

const SidebarContainer = styled.aside`
  width: clamp(7rem, 15.5vw, 25rem);
  height: 30rem;
  background-color: white;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-right: 2.5rem;
  margin-top: 0.4rem;
`;

const ListItem = styled.li`
  font-weight: bold;
  font-size: 18px;
  padding: 0.7rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  background-color: ${(props) =>
    props.$active ? "var(--pink-color)" : "white"};
  &:hover {
    background-color: var(--pink-color);
  }
`;

const ClassSidebar = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const items = ["강의 개요", "강의 공지"];
  const routes = [
    `/class/${courseId}/overview/info`,
    `/class/${courseId}/overview/notice`,
  ];

  const activeIndex = routes.findIndex((route) =>
    location.pathname.startsWith(route),
  );
  const activeItem = activeIndex !== -1 ? items[activeIndex] : null;

  return (
    <SidebarContainer>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((item, index) => (
          <ListItem
            key={index}
            $active={activeItem === item}
            onClick={() => navigate(routes[index])}
          >
            {item}
          </ListItem>
        ))}
      </ul>
    </SidebarContainer>
  );
};

ClassSidebar.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired, // 항목 배열
  activeItem: PropTypes.string.isRequired, // 활성화된 항목
  setActiveItem: PropTypes.func.isRequired, // 활성화 항목 설정 함수
  routes: PropTypes.arrayOf(PropTypes.string).isRequired, // 각 항목에 해당하는 경로 배열
};

export default ClassSidebar;
