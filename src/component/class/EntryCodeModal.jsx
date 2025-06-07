import styled from "styled-components";
import LogoSymbol from "../../img/logo/itda_logo_symbol.svg";

export default function EntryCodeModal({ entrycode, onClose }) {
  const handleCopy = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        onClose();
      })
      .catch((err) => {
        console.error("복사 중 오류가 발생했습니다:", err);
      });
  };
  return (
    <ModalBackdrop>
      <ModalWrapper>
        <ModalContent>
          <img src={LogoSymbol} alt="LogoSymbol" width="60" height="60" />
          <ModalText style={{ marginTop: "10px" }}>
            강의실이 개설되었습니다!
          </ModalText>
          <ModalSmallText>내 강의실 코드</ModalSmallText>
          <ModalText>{entrycode}</ModalText>
          <CloseButton
            onClick={() => {
              handleCopy(entrycode);
            }}
          >
            수강생 초대하기
          </CloseButton>
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
  background: white;
  padding: 50px 20px;
  border-radius: 20px;
  text-align: center;
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);

  @media (max-width: 1000px) {
    width: 70%;
  }
`;

const ModalContent = styled.div``;

const ModalText = styled.div`
  font-size: 25px;
  font-weight: bold;
`;

const ModalSmallText = styled.div`
  font-size: 10px;
  margin-top: 20px;
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
