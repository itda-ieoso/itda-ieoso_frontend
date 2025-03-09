import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Close from '@mui/icons-material/Close';

export default function AssignmentModal({ text, onClose }) {
    const navigation = useNavigate();

    const goToClassList = () => {
        navigation("/class/list");
    };

    return (
        <ModalBackdrop>
            <ModalWrapper>
                <CloseIcon onClick={onClose} />
                <ModalContent>
                    <ModalText>{text}</ModalText>
                    <CloseButton onClick={goToClassList}>강의실 목록으로 돌아가기</CloseButton>
                </ModalContent>
            </ModalWrapper>
        </ModalBackdrop>
    );
}

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalWrapper = styled.div`
  position: relative;
  background: white;
  padding: 20px;
  border-radius: 20px;
  text-align: center;
  width: 40%;
  height: 283px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);

  @media (max-width: 1000px) { 
    width: 70%;
  }
`;

const CloseIcon = styled(Close)`
  position: absolute; /* 추가 */
  top: 15px; /* 상단 정렬 */
  right: 15px; /* 우측 정렬 */
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ModalText = styled.div`
  font-size: 25px;
  font-weight: bold;
`;

const CloseButton = styled.button`
  background: #ff4747;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 25px;
  cursor: pointer;
  font-size: 13px;
  margin-top: 20px;
`;
