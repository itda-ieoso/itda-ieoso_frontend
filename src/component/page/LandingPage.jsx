import styled from 'styled-components';
import TopBar from "../ui/TopBar";
import backgroundImage from "../img/landing/landing1.svg";
import landingTable from "../img/landing/landing2.svg";
import itdaLogoWhite from "../img/landing/itda_logo_white.svg";
import studentIcon from "../img/landing/student_icon.svg";
import pencilIcon from "../img/landing/pencil_icon.svg";
import levelIcon from "../img/landing/level_icon.svg";
import explain1 from "../img/landing/explain1.svg";
import explain2 from "../img/landing/explain2.svg";
import arrowIcon from "../img/landing/arrow_icon.svg";
import itdalogoRed from "../img/landing/itda_icon_red.svg";
import googlePlay from "../img/landing/googleplay.svg";
import appStore from "../img/landing/appstore.svg";

import { useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import TermsModal from './users/TermsModal';
import { UsersContext } from '../contexts/usersContext';

const MainContainer = styled.div`
    text-align: center;
    background-color: #ffffff;
`;

//itda 설명 컨테이너
const ExplainContainer = styled.header`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    background-image: url(${backgroundImage});
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: top;
    padding: 10vh 0 5vh;
    color: #333;
    background-color: #ffffff;
    h2 {
        font-size: 48px;
        font-weight: bold;
    }
`;

const TableImage = styled.img`
    width: 100%;
    margin-top: -10vh;
    position: relative;
`;

const Highlight = styled.span`
    color: var(--main-color);
`;

const StartButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 40px;
    padding: 15px 40px;
    background-color: var(--main-color);
    color: #ffffff;
    font-size: 20px;
    border: none;
    border-radius: 50px;
    cursor: pointer;

    img {
        margin-right: 10px;
    }
`;

const Features = styled.section`
    display: flex;
    justify-content: space-around;
    align-items: center;
    text-align: center;
    gap: 30px;
    background-color: #F6F7F9;
    padding: 5vh 10vw;
    @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;
        padding: 5vh 15vw;
    }
`;

const FeatureCard = styled.div`
    display: flex;
    flex-direction: column;
    width: 250px;
    height: 300px;
    background-color: #FFFFFF;
    padding: 15px 20px;
    border-radius: 8px;
    //box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: left;
    position: relative;
    margin-bottom: 25px;
    @media (max-width: 768px) {
        width: 70%;
    }
`;

const FeatureTitle = styled.h2`
    font-size: 1.3em;
    font-weight: bold;
    margin-bottom: 5px;
    white-space: pre-line;
`;

const FeatureDescription = styled.p`
    color: #AAAAAA;
    font-size: 1rem;
    margin-top: 5px;
    margin-bottom: 20px;
    white-space: pre-line;
`;

const FeatureImage = styled.img`
    width: 120px;
    height: 120px;
    position: absolute;
    bottom: 20px;
    right: 20px;
    object-fit: contain;
`;

const BaseContainer = styled.div`
    justify-content: center;
    align-items: center;
    padding: 3vh 2vw;
    background-color: #FFFFFF;
`;

const ExplainBottomImage = styled.img`
    width: 100%;
    margin: 20px 0px;
`;

const ActionButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    box-sizing: border-box;
    margin-top: 10px;
`;

const ActionButton = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    min-height: 50px;
    height: 85px;
    padding: 10px;
    margin: 10px;
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 8px;
    cursor: pointer;
    box-sizing: border-box;
    position: relative;

    @media (max-width: 768px) {
        width: 100%;
        white-space: pre-wrap;
    }
`;

const ButtonText = styled.span`
    position: absolute;
    top: 20px;
    left: 15px;
    font-size: 1rem;
    font-weight: 500;
`;

const ArrowIcon = styled.img`
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: 20px;
    height: 20px;
`;

const AppDownloadContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    margin: 40px 0px 20px 30px;
`;

const AppDownloadLinks = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 15px;
`;

const AppDownloadLink = styled.a`
    display: flex;
    align-items: center;
    text-decoration: none;
    color: black;
    background-color: #F6F7F9;
    padding: 10px 20px;
    border-radius: 50px;
    pointer-events: none; // 일단 링크 연겳 방지
    cursor: default;
`;

const AppLogo = styled.img`
    width: 100px;
    margin-right: 20px;
`;

const AppDescription = styled.div`
    font-size: 1rem;
    font-weight: 700;
    color: #333;
    
    @media (max-width: 768px) {
        white-space: pre-wrap;
    }
`;

const Footer = styled.footer`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 0 30px 80px ;
    background-color: #FFFFFF;
`;

const FooterLinks = styled.div`
    display: flex;
    align-items: center;
`;

const FooterLink = styled.a`
    margin: 0 10px;
    text-decoration: none;
    color: black;
    font-size: 0.9rem;
    font-weight: 500;
    pointer-events: none; // 일단 링크 연겳 방지
    cursor: default;
`;

const FooterSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
`;

const FooterInfoContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
`;

const FooterTerms = styled.a`
    margin: 0 10px;
    text-decoration: none;
    color: black;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
`;

const FooterInfo = styled.p`
    font-size: 0.8rem;
    margin: 10px 0;
    color: #AAAAAA;
`;

function renderActionButtons(navigate, isLoggedIn) {
    const buttons = [
        { text: "강의실 바로가기", src: arrowIcon, path: "/class/list" },
        { text: "내 대시보드 바로가기", src: arrowIcon, path: "/dashboard" },
        { text: "내 강의실 생성하기", src: arrowIcon, path: "/class/create" },
    ];

    const handleClick = (path) => {
        if (isLoggedIn) {
            navigate(path);
        } else {
            alert('로그인 후 사용해주세요.');
        }
    };

    return (
        <ActionButtonContainer>
            {buttons.map((button, index) => (
                <ActionButton key={index} onClick={() => handleClick(button.path)}>
                    <ButtonText>{button.text}</ButtonText>
                    <ArrowIcon src={button.src} alt="arrow icon" />
                </ActionButton>
            ))}
        </ActionButtonContainer>
    );
}

export default function LandingPage() {
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', content: '' });
    const { isUser: isLoggedIn } = useContext(UsersContext);

    const handleOpenModal = (type) => {
        let content;
        switch (type) {
            case 'service':
                content = {
                    title: '서비스 이용약관',
                    content: '회원의 의무: 회원은 서비스 신청 시 허위 정보를 제공하거나 타인의 정보를 도용해서는 안 됩니다.\n\n또한, 사이트에 게시된 정보를 허가 없이 변경하거나, 회사 및 제3자의 저작권 등 지식재산권을 침해하는 행위를 금지합니다.\n\n게시물 관리: 회원이 작성한 게시물의 권리와 책임은 작성자에게 있으며, 회사는 비방, 명예훼손, 저작권 침해 등의 문제가 있는 게시물을 사전 통지 없이 삭제할 수 있습니다.\n\n서비스 제공 및 변경: 회사는 상품 등의 품절 또는 기술적 사양의 변경 등의 사유로 제공할 상품 등의 내용을 변경할 수 있으며, 이 경우 변경 사항을 즉시 공지합니다.'
                };
                break;
            case 'privacy':
                content = {
                    title: '개인정보 처리방침',
                    content: '수집 및 이용 목적: 회원 관리, 서비스 제공 및 개선, 고객 상담, 마케팅 및 광고에의 활용 등을 위해 개인정보를 수집합니다.\n\n 수집 항목: 이름, 이메일 주소, 전화번호, 생년월일, 성별, 서비스 이용 기록, 결제 정보 등이 포함됩니다. \n\n보유 및 이용 기간: 회원 탈퇴 시까지 또는 관련 법령에 따라 일정 기간 동안 보유합니다. 예를 들어, 회원 탈퇴 시 서비스 제공을 위해 수집한 정보는 소비자 불만 및 분쟁 해결 목적으로 탈퇴일로부터 30일간 보관 후 삭제됩니다.\n\n제3자 제공 및 위탁: 회사는 원칙적으로 회원의 동의 없이 개인정보를 외부에 제공하지 않으며, 서비스 운영을 위해 필요한 경우에 한해 수탁자에게 업무를 위탁할 수 있습니다. 예를 들어, 결제를 위한 업체나 배송을 위한 업체 등이 해당됩니다.등이 해당됩니다.'
                };
                break;
            default:
                content = { title: '', content: '' };
        }
        setModalContent(content);
        setModalOpen(true);
    };
  
    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const explain = {
        question: {
            title: "3 STEP\n 쉬운 강의실 개설",
            description: "오직 3단계로 쉽게 나만의 강의실을\n개설하여 수업을 시작해보세요.",
            img: studentIcon,
        },
        ai: {
            title: "한 눈에 보이는\n 학습 상황",
            description: "학습자의 학습 상황을 클릭 한 번으로\n한눈에 확인해볼 수 있어요.",
            img: pencilIcon,
        },
        curriculum: {
            title: "주 단위\n커리큘럼 운영",
            description: "주 단위의 체계적 커리큘럼을 통해\n목표와 한걸음 가까워지세요.",
            img: levelIcon,
        },
    };

    return (
      <>
        <TopBar />
        <MainContainer>
          <ExplainContainer>
                <div style={{ fontSize: "48px", fontWeight: 500 }}>쉬운 챌린지 운영,</div>
                <h2 style={{ fontSize: "48px", fontWeight: "bold", margin: "10px" }}>
                    지금 <Highlight>‘itda’</Highlight>에서 시작하세요!
                </h2>
                <div style={{ fontSize: "16px", marginTop: "10px"}}>
                    <strong>3분만에</strong> 강의실 개설,
                        <strong>한 눈에 확인</strong> 하는 과제 제출 현황
                </div>
                <StartButton onClick={() => navigate('/login')}>
                    <img src={itdaLogoWhite} alt="itda logo" style={{ width: "24px" }} />
                        무료로 시작하기
                    </StartButton>
                <TableImage src={landingTable} alt="itda logo" style={{ width: "75%", margin: "60px 0px 40px" }} />
          </ExplainContainer>
          <Features>
            {Object.values(explain).map((feature, index) => (
              <FeatureCard key={index}>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
                <FeatureImage src={feature.img} alt={feature.title} />
              </FeatureCard>
            ))}
          </Features>
          <BaseContainer>
            <ExplainBottomImage src={explain1} alt="itda logo" style={{ width: "100%", margin: "20px 0px" }} />
          </BaseContainer>
            <ExplainBottomImage src={explain2} alt="itda logo" style={{ width: "100%" }} />
        <BaseContainer>
            {renderActionButtons(navigate, isLoggedIn)}
            <AppDownloadContainer>
            <AppLogo src={itdalogoRed} alt="itda logo" />
            <div>
              <AppDescription>
                학습자와 교육자 모두가 선택하는 최상의 교육플랫폼, <Highlight>itda</Highlight>
              </AppDescription>
              <AppDownloadLinks>
                <AppDownloadLink href="#">
                  <img src={googlePlay} alt="Google Play" style={{ width: "20px", marginRight: "10px" }} />
                  Google Play
                </AppDownloadLink>
                <AppDownloadLink href="#">
                  <img src={appStore} alt="App Store" style={{ width: "20px", marginRight: "10px" }} />
                  App Store
                </AppDownloadLink>
              </AppDownloadLinks>
            </div>
                    </AppDownloadContainer>
            </BaseContainer>
          <hr style={{ width: "100%", margin: "40px 0px", border: "1px solid #CDCDC" }} />
          <Footer>
            <FooterLinks>
              <FooterLink href="#">Instagram</FooterLink>
              <FooterLink href="#">Youtube</FooterLink>
            </FooterLinks>
            <FooterSection>
              <div>
              <FooterTerms onClick={() => handleOpenModal('service')}>이용약관</FooterTerms>
              <FooterTerms onClick={() => handleOpenModal('privacy')}>개인정보처리방침</FooterTerms>
              </div>
              <FooterInfoContainer>
                <FooterInfo>CEO: 김효정</FooterInfo>
                <FooterInfo>문의: 010-2856-2048</FooterInfo>
              </FooterInfoContainer>
            </FooterSection>
            </Footer>
        </MainContainer>
        {modalOpen && (
          <TermsModal 
            title={modalContent.title} 
            content={modalContent.content} 
            onClose={handleCloseModal}
          />
        )}
      </>
    );
}