import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import EditBtn from "../../img/class/edit_btn.svg";
import EditedBtn from "../../img/class/edited_btn.svg";
import { ModalOverlay, AlertModalContainer } from "../modal/ModalStyles";

const StyledButton = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 4rem;
  width: 6vh;
  cursor: pointer;

  @media (max-width: 1024px) {
    width: 4.5vh;
  }
  @media (max-width: 376px) {
    width: 4vh;
    bottom: 4.6%;
    right: 5%;
  }
`;

const EditButton = ({ to, edit, lecture }) => {
  const navigate = useNavigate();
  const [showAlertModal, setShowAlertModal] = useState(false);

  const handleClick = (to) => {
    if (!lecture) return;

    const isLectureDateMissing = !lecture.startDate || !lecture.endDate;
    const isAnySubDateMissing = lecture.subSections?.some(
      (section) => !section.startDate || !section.endDate,
    );

    if (isLectureDateMissing || isAnySubDateMissing) {
      setShowAlertModal(true);
      return;
    }

    navigate(to);
  };

  return (
    <>
      <StyledButton onClick={() => handleClick(to)}>
        <img
          src={edit ? EditBtn : EditedBtn}
          alt="Edit Button"
          style={{ width: "100%" }}
        />
      </StyledButton>
      {showAlertModal && (
        <ModalOverlay>
          <AlertModalContainer>
            <div className="text">
              시작일 또는 종료일이 입력되지 않았습니다.
              <br />
              모든 날짜 항목을 입력해주시기 바랍니다.
            </div>
            <div className="button-container">
              <button
                className="close-button"
                onClick={() => setShowAlertModal(false)}
              >
                확인
              </button>
            </div>
          </AlertModalContainer>
        </ModalOverlay>
      )}
    </>
  );
};

EditButton.propTypes = {
  to: PropTypes.string.isRequired,
  edit: PropTypes.bool.isRequired,
  lecture: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    subSections: PropTypes.arrayOf(
      PropTypes.shape({
        startDate: PropTypes.string,
        endDate: PropTypes.string,
      }),
    ),
  }).isRequired,
};

export default EditButton;
