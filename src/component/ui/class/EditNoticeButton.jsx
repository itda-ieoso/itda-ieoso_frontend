import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import EditBtn from "../../img/class/edit_btn.svg";
import EditedBtn from "../../img/class/edited_btn.svg";

const StyledButton = styled.div`
  position: fixed;
  bottom: 12vh;
  right: 9vw;
  width: 60px;
  cursor: pointer;

  @media (max-width: 1024px) {
    width: 35px;
  }

  @media (max-width: 768px) {
    width: 45px;
  }

  @media (max-width: 480px) {
    width: 42px;
    right: 6.8vw;
    bottom: 9vh;
  }

  @media (max-width: 376px) {
    width: 32px;
  }
`;

const EditNoticeButton = ({ to, edit }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };

  return (
    <StyledButton onClick={handleClick}>
      <img
        src={edit ? EditBtn : EditedBtn}
        alt="Edit Button"
        style={{ width: "100%" }}
      />
    </StyledButton>
  );
};

export default EditNoticeButton;
