import styled from "styled-components";
import PropTypes from "prop-types";
import VideoIcon from "../../img/class/edit/video.svg";
import AssignmentIcon from "../../img/icon/curriculum/assignmenticon.svg";
import MaterialIcon from "../../img/icon/curriculum/materialicon.svg";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  left: -10vh;
  top: 50%;
  transform: translateY(-50%);
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
  padding: 1rem;
  z-index: 1;

  @media (max-width: 1024px) {
    padding: 1vh;
    left: -5.6vh;
    border-radius: 6px;
  }

  @media (max-width: 768px) {
    padding: 1vh;
    left: -5.7vh;
    border-radius: 6px;
  }

  @media (max-width: 480px) {
    padding: 1.5vh;
    left: -9vh;
    border-radius: 4px;
  }

  @media (max-width: 440px) {
    padding: 1.2vh;
    left: -22%;
    border-radius: 4px;
  }

  @media (max-width: 376px) {
    padding: 1vh;
    left: -12%;
    border-radius: 4px;
  }

  & img {
    width: 4vh;
    cursor: pointer;
    margin: 0.8rem 0;
    transition: transform 0.2s ease-in-out;

    &:hover {
      transform: scale(1.1);
    }
  }
`;

const HighlightLine = styled.div`
  position: absolute;
  left: 0;
  transform: translateY(-10%);
  bottom: 0;
  width: 0.35rem;
  height: 84%;
  background-color: var(--main-color);

  z-index: 1;

  @media (max-width: 1024px) {
    width: 0.35vh;
  }

  @media (max-width: 768px) {
    width: 0.42vh;
  }

  @media (max-width: 480px) {
    width: 0.5vh;
  }

  @media (max-width: 440px) {
    width: 0.4vh;
  }
`;

const Icon = styled.img`
  @media (max-width: 1024px) {
    width: 2.2vh !important;
    margin: 0.95vh 0vh !important;
  }

  @media (max-width: 768px) {
    width: 2.3vh !important;
    margin: 0.9vh 0vh !important;
  }

  @media (max-width: 480px) {
    width: 3.5vh !important;
    margin: 1.5vh 0vh !important;
  }

  @media (max-width: 440px) {
    width: 2.4vh !important;
    margin: 1vh 0vh !important;
  }

  @media (max-width: 376px) {
    width: 2.1vh !important;
    margin: 0.7vh 0vh !important;
  }
`;

const EditContainer = ({ handleAdd, index }) => {
  // 아이콘 데이터 배열
  const icons = [
    { src: VideoIcon, alt: "Video", action: () => handleAdd("video") },
    {
      src: MaterialIcon,
      alt: "Material",
      action: () => handleAdd("material"),
    },
    {
      src: AssignmentIcon,
      alt: "Assignment",
      action: () => handleAdd("assignment"),
    },
  ];

  return (
    <>
      <HighlightLine />
      <Container>
        {icons.map((icon, idx) => (
          <Icon key={idx} src={icon.src} alt={icon.alt} onClick={icon.action} />
        ))}
      </Container>
    </>
  );
};

EditContainer.propTypes = {
  onIconClick: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

export default EditContainer;
