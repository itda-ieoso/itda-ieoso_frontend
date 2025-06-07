import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import TopBar from "../component/TopBar.jsx";
import {
  ModalOverlay,
  AlertModalContainer,
} from "../component/modal/ModalStyles.jsx";
import logoImage from "../img/logo/itda_logo_symbol.svg";
import api from "../api/api.js";
import { UsersContext } from "../contexts/usersContext.jsx";

export default function Participate() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const { user } = useContext(UsersContext);
  const [modalMessage, setModalMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (message) => {
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleParticipate = async () => {
    if (code.trim() === "") {
      openModal("코드를 입력해주세요.");
      return;
    }

    try {
      const response = await api.post(
        `/courses/enter/${user.userId}?entryCode=${code}`,
      );
      if (response.status === 200) {
        navigate("/class/list");
      } else if (response.status === 404) {
        openModal("존재하지 않는 코드에요");
      } else {
        openModal("오류가 발생했습니다.");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        openModal("존재하지 않는 코드에요");
      } else {
        openModal("오류가 발생했습니다.");
      }
    }
  };

  return (
    <Wrapper>
      <TopBar />
      <Layout>
        <Container>
          <LogoImage src={logoImage} alt="logo" />
          <LogoText>강의실 입장</LogoText>
          <Explain>공유 받은 강의 공간 입장 코드를 입력해주세요.</Explain>
          <Form>
            <Label>강의실 입장코드</Label>
            <EntryCodeContainer>
              <EntryCodeInput
                type="text"
                placeholder="코드를 입력해주세요."
                onChange={(e) => setCode(e.target.value)}
                value={code}
              />

              <EntryCodeButton onClick={handleParticipate}>
                강의실 입장하기
              </EntryCodeButton>
            </EntryCodeContainer>
          </Form>
        </Container>
      </Layout>
      {isModalOpen && (
        <ModalOverlay>
          <AlertModalContainer>
            <div className="text">{modalMessage}</div>
            <div className="close-button" onClick={closeModal}>
              닫기
            </div>
          </AlertModalContainer>
        </ModalOverlay>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`;

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  width: 100%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 650px;
  margin: 0 auto;
  padding: 2rem;
  box-sizing: border-box;
  height: calc(100vh - 60px);
  justify-content: center;
  padding-bottom: 10vh;
`;

export const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const LogoImage = styled.img`
  width: 50px;
  margin-bottom: 1rem;
`;

const LogoText = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 10px;
`;

const Explain = styled.div`
  font-size: 1rem;
  font-weight: 400;
  color: #989898;
  margin-bottom: 20px;
`;

const Form = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const Label = styled.label`
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  font-weight: 600;
`;

const EntryCodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 550px;
`;

const EntryCodeInput = styled.input`
  width: 100%;
  padding: 0.7rem;
  border: 1px solid #cdcdcd;
  border-radius: 15px;
  font-size: 0.9rem;
  box-sizing: border-box;

  &::placeholder {
    color: #cdcdcd;
  }
`;

const EntryCodeButton = styled.button`
  width: 100%;
  display: block;
  background-color: #ff4747;
  color: white;
  border: none;
  padding: 0.75rem;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 15px;
  margin: 10px auto;
`;
