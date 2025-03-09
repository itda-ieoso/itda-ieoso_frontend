import PropTypes from 'prop-types';
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

  @media (max-width: 375px) {
    width: 300px;
    padding: 60px 25px 25px 25px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const TermsTitle = styled.h2`
  margin: 0;
`;

const CloseButton = styled.span`
  position: absolute;
  top: 30px;
  right: 40px;
  font-size: 1.5rem;
  cursor: pointer;
`;

const TermsContent = styled.div`
  margin-bottom: 20px;
  font-size: 1rem;
  line-height: 1.5;
  flex-grow: 1;
`;

const TermsList = ({ text }) => {
  const items = text
    .split(/\n\s*\n/)
    .map(item => item.trim())
    .filter(item => item !== '');
    
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
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        content: {
          inset: 'auto',
          padding: '0',
          border: 'none',
          overflow: 'hidden',
          borderRadius: '10px',
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
