import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import TopBar from "../ui/TopBar";
import userIcon from "../img/mainpage/usericon.png";
import ClassData from "../img/class/ClassData.png";
import LogoGray from "../img/itda_logo_gray.svg";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

export default function Class() {
    const navigate = useNavigate();
    const [selectedMenu, setSelectedMenu] = useState("전체 강의실");
    const [showPopup, setShowPopup] = useState(false);

    const lectures = { "전체 강의실": [], "내 강의실": []};
    /*
    const lectures = {
        "전체 강의실": [
            { id:1, title: "2025년도 통합사회 1-1", date: "2024.12.22", description: "김인덕의 폭발적 통합사회 강의를 잇다에서 만나보세요. 2019년부터 재편된 전국 고등학생의 문의, 강사 김인덕의 통합 사회 정복기!" },
            { id:2, title: "2025년도 통합사회 1-2", date: "2025.01.02", description: "김인덕의 폭발적 통합사회 강의를 잇다에서 만나보세요. 2019년부터 재편된 전국 고등학생의 문의, 강사 김인덕의 통합 사회 정복기!" },
            { id:3, title: "2025년도 생활과 윤리", date: "2024.12.24", description: "박윤리 선생님과 함께하는 생활과 윤리 강의! 윤리적 감수성을 키우고 도덕적 판단력을 향상시키는 강의입니다." },
            { id:4, title: "2025년도 한국지리", date: "2024.12.28", description: "대한민국 구석구석을 탐험하는 한국지리 강의! 이지리 선생님과 함께 우리나라의 지리를 재미있게 배워보세요." }
        ],
        "내 강의실": [
            { id: 5, title: "2025년도 통합사회 1-1", date: "2024.12.22", description: "김인덕의 폭발적 통합사회 강의를 잇다에서 만나보세요. 2019년부터 재편된 전국 고등학생의 문의, 강사 김인덕의 통합 사회 정복기!" }
        ]
    };
    */

    const lecturesCount = lectures[selectedMenu].length; // 강의실 개수 확인

    const handleLectureClick = (id) => {
        navigate(`/class/${id}`);
    };

    return (
      <>
        <Header>
          <TopBar />
          <div className="header-right">
            {/* 대시보드로 가기 버튼 파일 존재x*/}
              <button className="godashboard" onClick={() => navigate('/dashboard')}>대시보드로 가기</button>
              <UserIcon src={userIcon} alt="user icon" />
            </div>
        </Header>
            <Container>
                <Sidebar>
                    <MenuItem active={selectedMenu === "전체 강의실"} onClick={() => setSelectedMenu("전체 강의실")}>
                        전체 강의실
                    </MenuItem>
                    <MenuItem active={selectedMenu === "내 강의실"} onClick={() => setSelectedMenu("내 강의실")}>
                        내 강의실
                    </MenuItem>
                </Sidebar>
                <Content>
                   <h2>{selectedMenu}</h2>
                   {lecturesCount === 0 ? ( // 강의실이 없을 경우
                        <NoLecturesMessage>
                            <img src={LogoGray} alt="LogoGray" width="40" height="40" />
                            <br />
                            현재 생성된 강의실이 없습니다 :(
                            <br />
                            + 버튼을 눌러 강의실을 생성해보세요!
                        </NoLecturesMessage>
                   ) : (
                       lectures[selectedMenu].map((lecture) => (
                           <LectureCard key={lecture.id} onClick={() => handleLectureClick(lecture.id)}>
                               <LectureImage src={ClassData} alt="Lecture" />
                               <LectureInfo>
                                   <LectureTitle>{lecture.title}</LectureTitle>
                                   <LectureDate>등록 일시 {lecture.date}</LectureDate>
                                   <LectureDescription>{lecture.description}</LectureDescription>
                               </LectureInfo>
                           </LectureCard>
                       ))
                   )}
                </Content>
                <AddButton onClick={() => setShowPopup(!showPopup)} data-showpopup={showPopup}>
                    {showPopup ? '×' : '+'}
                </AddButton>
                {showPopup && (
                    <PopupMenu>
                        {lecturesCount === 0 ? ( // 강의실이 없을 때
                            <PopupItem onClick={() => navigate('/class/create')}>
                                강의실 생성하기!
                            </PopupItem>
                        ) : (
                            <>
                                <PopupItem onClick={() => navigate('/class/create')}>
                                    <OpenInNewIcon style={{ marginRight: '15px' }}/>
                                    강의실 만들기
                                </PopupItem>
                                <PopupItem onClick={() => navigate('/participate')}>
                                    <ExitToAppIcon style={{ marginRight: '15px' }}/>
                                    강의실 들어가기
                                </PopupItem>
                            </>
                        )}
                    </PopupMenu>
                )}
            </Container>
        </>
    );
}

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;

    .header-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .godashboard{
      background-color: transparent;
      color: #000;
      border: 1px solid #000;
      padding: 10px 20px;
      cursor: pointer;
      border-radius: 60px;
    }
`;

const UserIcon = styled.img`
    width: 40px;
    height: 40px;
    margin-right: 10px;
`;

const Container = styled.div`
    display: flex;
    height: 100%;
    width: 100%;
    margin-bottom: 100px;
`;

const Sidebar = styled.div`
    width: 15%;
    max-width: 200px;
    height: 70vh;

    margin: 30px 20px;
    background-color: #fff;
    padding: 20px;
    border-radius: 20px;
`;

const MenuItem = styled.div`
    padding: 15px 15px;
    margin-bottom: 10px;
    color: #000;
    font-weight: ${props => props.active ? 'bold' : 'bold'};
    background-color: ${props => props.active ? '#FFD1D1' : '#FFFFFF'};  
    border-radius: 10px;
    cursor: pointer;
`;

const Content = styled.div`
    flex: 1;
    padding: 10px;
`;

const LectureCard = styled.div`
    display: flex;
    background-color: #fff;
    margin-bottom: 20px;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
`;

const LectureImage = styled.img`
    width: 200px;
    height: 200px;
    margin-right: 20px;
`;

const LectureInfo = styled.div`
    flex: 1;
`;

const LectureTitle = styled.h3`
    margin: 0;
    font-size: 24px;
`;

const LectureDate = styled.p`
    margin: 10px 0 60px 0;
    color: #888;
`;

const LectureDescription = styled.p`
    margin: 0;
    color: #767676;
    font-size: 14px;
    background-color: #F6F7F9;
    padding: 20px 80px 20px 10px;
    border-radius: 10px;
`;

const AddButton = styled.button`
    position: fixed;
    bottom: 45px;
    right: 45px;
    width: 60px;
    height: 60px;
    background-color: ${props => (props['data-showpopup'] ? '#000' : '#ff5a5f')};
    color: #fff;
    border: none;
    border-radius: 50%;
    font-size: 44px;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const PopupMenu = styled.div`
    position: fixed;
    bottom: 105px;
    right: 95px;
    background-color: #fff;
    border-radius: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    padding: 10px;
`;

const PopupItem = styled.div`
    display: flex;
    align-items: center;
    padding: 10px 50px 10px 20px;
    font-size: 16px;
    cursor: pointer;
    &:hover {
        background-color: #f0f0f0;
        border-radius: 10px;
    }
`;

const NoLecturesMessage = styled.p`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 60vh; /* 원하는 높이로 조정 */
    font-size: 18px;
    color: #BABABA;
`;