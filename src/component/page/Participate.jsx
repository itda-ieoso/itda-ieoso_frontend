import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import TopBar from "../ui/TopBar";
import logoImage from "../img/logo/itda_logo_symbol.svg";
import api from "../api/api";
import { UsersContext } from "../contexts/usersContext";

export default function Participate() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const { user } = useContext(UsersContext);

  const handleParticipate = async () => {
    const response = await api.post(`/courses/enter/${user.userId}?entryCode=${code}`);
    if (response.status === 200) {
      navigate('/class/list');
    } else {
      alert('코드가 올바르지 않습니다.');
    }
  }

  return (
    <>
      <TopBar />
      <Container>
        <LogoImage src={logoImage} alt="logo" />
        <LogoText>Start your itda</LogoText>
        <Explain>공유 받은 강의 공간 입장 코드를 입력해주세요.</Explain>
        <div style={{ width: '60%', maxWidth: '800px', margin: '0 auto', display: 'flex',  justifyContent: 'center' }}>
          <Form>
            <Label>강의실 입장코드</Label>
            <LoginInput 
              type="text" 
              placeholder="코드를 입력해주세요."
              onChange={(e) => setCode(e.target.value)}
              value={code} 
            />
            
            <LoginButton style={{ fontSize: '1rem' }} onClick={handleParticipate}>강의실 입장하기</LoginButton>
          </Form>
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #FFFFFF;
    width: 100%;
    height: 100vh;
    justify-content: flex-start;
    padding-top: 15vh;
`;

export const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const LogoImage = styled.img`
    width: 70px;
    margin-bottom: 1rem;
`;

const LogoText = styled.div`
    font-size: 2rem;
    font-weight: 900;    margin-bottom: 10px;
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
`;

const Label = styled.label`
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
    font-weight: 900;
`;

const LoginInput = styled.input`
    padding: 0.8rem;
    margin-bottom: 1rem;
    border: 1px solid #CDCDCD;
    border-radius: 10px;
    font-size: 1rem;

    &::placeholder {
        color: #CDCDCD;
    }
`;

const LoginButton = styled.button`
    padding: 0.8rem;
    background-color: #FF4747;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    margin-bottom: 1rem;
    font-size: 1.2rem;
    font-weight: 600;
`;