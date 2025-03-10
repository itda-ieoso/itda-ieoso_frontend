import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import TopBar from "../ui/TopBar";
import LogoGray from "../img/logo/itda_logo_gray.svg";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ClassThumbnail from "../img/class/classlist_thumbnail.svg";
import { ModalOverlay, ModalContent } from "../ui/modal/ModalStyles";
import api from "../api/api";
import { UsersContext } from "../contexts/usersContext";
import DeleteIcon from '../img/icon/delete.svg';

export default function Class() {
    const navigate = useNavigate();
    const [selectedMenu, setSelectedMenu] = useState("전체 강의실");
    const [showPopup, setShowPopup] = useState(false);
    const { user } = useContext(UsersContext);
    const [lectures, setLectures] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    
    const handleLectureClick = (id) => {
        navigate(`/class/${id}/overview/info`);
    };

    const getAllLectures = async () => {
        try {
            const response = await api.get(`/courses/${user.userId}/my-courses`);
            setLectures(response.data.data);
        } catch (error) {
            console.error('강의실 조회 중 오류 발생:', error);
        }
    };

    useEffect(() => {
        if (user && user.userId) {
            getAllLectures();
        }
    }, [user]);

    const lecturesToDisplay =
        selectedMenu === "전체 강의실"
            ? lectures
            : lectures.filter((lecture) => lecture.user.userId === user.userId);
    const lecturesCount = lecturesToDisplay.length;

    const changeDifficultly = (difficulty) => {
        if(difficulty === 'HARD') return '상'
        if(difficulty === 'MEDIUM') return '중'
        if(difficulty === 'EASY') return '하'
        return null
    }

    const handleDeleteLecture = async (courseId) => {
        try {
            await api.delete(`/courses/${courseId}?userId=${user.userId}`);
            getAllLectures();
        } catch (error) {
            console.error('강의실 삭제 중 오류 발생:', error);
        }
    };

    const confirmDelete = async () => {
        if (selectedCourseId) {
            await handleDeleteLecture(selectedCourseId);
            setShowDeleteModal(false);
            setSelectedCourseId(null);
        }
    };

    return (
      <>
        <TopBar />
        <Container>
            <Sidebar>
                <MenuItem
                    active={selectedMenu === "전체 강의실"}
                    onClick={() => setSelectedMenu("전체 강의실")}
                >
                    전체 강의실
                </MenuItem>
                <MenuItem
                    active={selectedMenu === "내 강의실"}
                    onClick={() => setSelectedMenu("내 강의실")}
                >
                    내 강의실
                </MenuItem>
            </Sidebar>
            <Content>
               <h2>{selectedMenu}</h2>
               {lecturesCount === 0 ? (
                    <NoLecturesMessage>
                        <img src={LogoGray} alt="LogoGray" width="40" height="40" />
                        <br />
                        현재 생성된 강의실이 없습니다 &#58;&#40;
                        <br />
                        + 버튼을 눌러 강의실을 생성해보세요!
                    </NoLecturesMessage>
               ) : (
                lecturesToDisplay?.map((lecture) => (
                    <LectureCard
                        key={lecture.courseId}
                        onClick={() => handleLectureClick(lecture.courseId)}
                    >
                        <LectureImage 
                            src={lecture.courseThumbnail || ClassThumbnail} 
                            alt="Lecture" 
                        />
                        <LectureInfo>
                            <LectureTitle>{lecture.courseTitle}</LectureTitle>
                            <LectureDetail>
                                <IconRow>
                                    <span className="material-symbols-outlined">event</span>
                                    <span>
                                        {lecture.startDate
                                            ? `${lecture.startDate} 시작`
                                            : "시작일 미정"}
                                    </span>
                                </IconRow>
                                <IconRow>
                                <span className="material-symbols-outlined">video_library</span>
                                    <span>
                                        {lecture.durationWeeks > 0
                                            ? `${lecture.durationWeeks}주 커리큘럼`
                                            : "기간 미정"}
                                    </span>
                                </IconRow>
                                <IconRow>
                                <span className="material-symbols-outlined">person</span>
                                    <span>{lecture.instructorName}</span>
                                </IconRow>
                                <IconRow style={{gap: '0rem'}}>
                                    <span className="material-symbols-outlined">star</span>
                                    <span style={{margin: '0rem 0.3rem 0rem 1rem'}}>강의 난이도</span>
                                    <span style={{marginLeft: 0, fontWeight: 800}}>{changeDifficultly(lecture.difficultyLevel)}</span>
                                </IconRow>
                            </LectureDetail>
                        </LectureInfo>
                        <DeleteIconWrapper 
                            onClick={(e) => { 
                                e.stopPropagation(); 
                                setSelectedCourseId(lecture.courseId);
                                setShowDeleteModal(true);
                            }}
                        >
                            <img src={DeleteIcon} alt="Delete Icon" style={{ width: "30px", height: "30px" }} />
                        </DeleteIconWrapper>
                    </LectureCard>
                ))
               )}
            </Content>
            <AddButton
                onClick={() => setShowPopup(!showPopup)}
                data-showpopup={showPopup}
            >
                {showPopup ? "×" : "+"}
            </AddButton>
            {showPopup && (
                <PopupMenu>
                    <PopupItem onClick={() => navigate("/class/create")}>
                        <OpenInNewIcon style={{ marginRight: "15px" }} />
                        강의실 만들기
                    </PopupItem>
                    <PopupItem onClick={() => navigate("/class/participate")}>
                        <ExitToAppIcon style={{ marginRight: "15px" }} />
                        강의실 입장하기
                    </PopupItem>
                </PopupMenu>
            )}
        </Container>

        {/* 모달 */}
        {showDeleteModal && (
            <ModalOverlay>
                <ModalContent>
                    <h2>강의실 나가기</h2>
                    <span>강의실을 나갈까요?</span>
                    <div className="button-container">
                        <button className="close-button" onClick={() => setShowDeleteModal(false)}>취소</button>
                        <button className="delete-button" onClick={confirmDelete}>나가기</button>
                    </div>
                </ModalContent>
            </ModalOverlay>
        )}
      </>
    );
}

const Container = styled.div`
    position: relative;
    display: flex;
    height: 100%;
    padding: 1.5rem 9vw;
    margin-bottom: 100px;

    @media (min-width: 768px) {
        padding: 0.5rem 5vw;
        flex-direction: row;
    }
`;

const Sidebar = styled.div`
    min-width: 110px;
    width: 10%;
    height: 60vh;
    margin: 30px 20px;
    background-color: #fff;
    padding: 20px;
    border-radius: 20px;
`;

const MenuItem = styled.div`
    padding: 15px;
    margin-bottom: 10px;
    color: #000;
    font-weight: bold;
    background-color: ${(props) =>
        props.active ? "var(--pink-color)" : "#FFFFFF"};
    border-radius: 10px;
    cursor: pointer;
`;

const Content = styled.div`
    flex: 1;
    padding: 20px;
`;

const LectureCard = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    margin: 10px 30px 20px 0;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;

    @media (min-width: 768px) {
        min-width: 420px;
        flex-direction: row; // 화면이 넓어지면 가로 정렬
    }
`;

const LectureImage = styled.img`
    min-width: 200px;
    width: 100%;
    min-height: 200px;
    height: auto;
    margin-bottom: 20px;
    object-fit: contain;

    @media (min-width: 600px) {
        width: 200px; // 데스크탑에서 이미지 크기 조정
        height: 200px;
        margin-bottom: 0;
        margin-right: 30px;
    }
`;

const LectureInfo = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
`;

const LectureDetail = styled.div`
    flex-direction: column;
    gap: 10px;
`;

const LectureTitle = styled.h3`
    margin: 0;
    font-size: 24px;
    margin-bottom: 12px;
`;

const IconRow = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 0.5rem;
    color: var(--darkgrey-color);

    .material-symbols-outlined {
        font-size: 1.5rem;
        vertical-align: middle;
    }

    span {
        font-size: 1rem;
        font-weight: 500;
    }
`;

const AddButton = styled.button`
    position: fixed;
    bottom: 2.5rem;
    right: 6vw;
    width: 3.8rem;
    height: 60px;
    padding-bottom: 15px;
    background-color: ${(props) =>
        props["data-showpopup"] ? "#000" : "var(--main-color)"};
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
    height: 60vh;
    font-size: 18px;
    color: #bababa;
`;

const DeleteIconWrapper = styled.span`
    position: absolute;
    bottom: 10px;
    right: 20px;
    cursor: pointer;
`;