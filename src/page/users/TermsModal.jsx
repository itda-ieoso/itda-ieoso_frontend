import PropTypes from "prop-types";
import Modal from "react-modal";
import styled from "styled-components";

const ModalContainer = styled.div`
  background-color: white;
  width: 100%;
  max-width: 700px;
  margin: auto;
  position: relative;
  padding: 60px 40px 30px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  height: 100%;

  /* 태블릿 가로 (해상도 768px ~ 1023px)*/
  @media all and (min-width: 768px) and (max-width: 1023px) {
    width: 500px;
    height: 400px;
    padding: 40px 40px 15px;
  }

  /* 모바일 세로 (해상도 ~ 479px)*/
  @media all and (max-width: 479px) {
    width: 200px;
    height: 350px;
    padding: 30px;
    font-size: 12px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  /* 모바일 세로 (해상도 ~ 479px)*/
  @media all and (max-width: 479px) {
    margin-bottom: 10px;
  }
`;

const TermsTitle = styled.h2`
  margin: 0;
`;

const CloseButton = styled.span`
  position: absolute;
  top: 22px;
  right: 30px;
  font-size: 1.5rem;
  cursor: pointer;

  /* 태블릿 가로 (해상도 768px ~ 1023px)*/
  @media all and (min-width: 768px) and (max-width: 1023px) {
    top: 35px;
    right: 45px;
  }
`;

const TermsContent = styled.div`
  margin-bottom: 20px;
  font-size: 1rem;
  line-height: 1.5;
  flex-grow: 1;
  overflow-y: auto;
  max-height: 400px;

  /* 모바일 세로 (해상도 ~ 479px)*/
  @media all and (max-width: 479px) {
    font-size: 12px;
  }
`;

const TermsList = ({ text }) => {
  const items = text
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter((item) => item !== "");

  return (
    <StyledList>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </StyledList>
  );
};

TermsList.propTypes = {
  text: PropTypes.string.isRequired,
  delimiter: PropTypes.string,
};

const StyledList = styled.ul`
  padding: 0;
  list-style-type: disc; /* bullet 표시 */
  margin-left: 1.5em;

  & > li {
    margin-top: 1em;
  }
`;

const TermsModal = ({ title, content, onClose }) => {
  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        content: {
          inset: "auto",
          padding: "0",
          border: "none",
          overflow: "hidden",
          borderRadius: "10px",
        },
      }}
    >
      <ModalContainer>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <ModalHeader>
          <TermsTitle>{title}</TermsTitle>
        </ModalHeader>
        <TermsContent>
          <TermsList text={content} delimiter="\n\n" />
        </TermsContent>
      </ModalContainer>
    </Modal>
  );
};

TermsModal.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default TermsModal;
