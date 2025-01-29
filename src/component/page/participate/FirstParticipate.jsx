import styled from "styled-components";
import TopBar from "../../ui/TopBar";
import logoImage from "../../img/itda_logo_symbol.svg";
import userIcon from "../../img/mainpage/usericon.png";
import { useNavigate } from "react-router-dom";

export default function FirstParticipate() {
  const navigate = useNavigate();

  return (
    <>
      <Header>
          <TopBar backgroundColor="#F6F7F9" />
          <div className="header-right">
          <button className="signup" onClick={() => navigate('/signup')}>회원가입</button>
          <button className="login" onClick={() => navigate('/login')}>로그인</button>
          <UserInfo>
              <UserIcon src={userIcon} alt="user icon" />
              <UserText>로그인하세요</UserText>
          </UserInfo>
          </div>
        </Header>
        <Container marginTop="100px">
        <LogoImage src={logoImage} alt="logo" />
        <LogoText>안녕하세요. &apos;itda&apos; 입니다. </LogoText>
        <LogoText>첫 강의실을 생성하시겠어요?</LogoText>
        <div style={{ width: '40%', margin: '0 auto' }}>
          <ConfirmContainer>
            <YesButton style={{ fontSize: '1rem' }} onClick={() => {
              navigate(''); //강의실 설정 페이지
            }}>예</YesButton>
            <NoButton style={{ fontSize: '1rem' }} onClick={() => {
              navigate(''); //아직은 모름
            }}>아니요</NoButton>
          </ConfirmContainer>
        </div>
      </Container>
    </>
  );
}

const Header = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-right: 2vw;
    background-color: #F6F7F9;

    .header-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .signup {
      background-color: transparent;
      color: #000000;
      border: none;
      padding: 10px 20px;
      cursor: pointer;
    }

    .login {
      background-color: #FF4747;
      color: rgb(255, 255, 255);
      border: none;
      padding: 10px 20px;
      border-radius: 50px;
      cursor: pointer;
    }
`;

const UserInfo = styled.div`
    display: flex;
    align-items: center;
    background-color: #F6F7F9;
    padding: 10px;
    border-radius: 8px;
`;

const UserIcon = styled.img`
    width: 40px;
    height: 40px;
    margin-right: 10px;
`;

const UserText = styled.p`
    color: #AAAAAA;
    font-size: 14px;
    margin: 0;
`;;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    background-color: #FFFFFF;
    height: calc(100vh - 7vh);
    width: 100%;
    padding-top: 8rem;
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
    font-weight: 700;    
    margin-bottom: 10px;
`;


const ConfirmContainer = styled.div`
    width: 80%;
    display: flex;
    justify-content: space-between;
    margin: 2rem auto 0;
    align-items: center;
    gap: 1rem;
`;

const YesButton = styled.button`
    min-width: 100px;
    width: 330px;
    padding: 0.8rem;
    background-color: #FF4747;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 1.2rem;
    font-weight: 600;
`;

const NoButton = styled(YesButton)`
    min-width: 100px;
    width: 330px;
    padding: 0.8rem;
    background-color: transparent;
    color: #FF4747;
    border: 1px solid #FF4747;
    border-radius: 10px;
    cursor: pointer;
`;