import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import TopBar from '../../ui/TopBar';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PlayingCurriculumSidebar from '../../ui/class/PlayingCurriculumSidebar';
import VideoPlaying from '../../ui/class/VideoPlaying'

const ClassPlaying = () => {
    const navigate = useNavigate();
    const { courseId, lectureId, videoId } = useParams();

    const [curriculumData, setCurriculumData] = useState([]);
    const [currentLectureInfo, setCurrentLectureInfo] = useState([]);
    const [currentVideoInfo, setCurrentVideoInfo] = useState([]);

    useEffect(() => {
        if (!currentLectureInfo?.videos || !videoId) return;
        
        const foundVideo = currentLectureInfo.videos.find(
            video => video.videoId === Number(videoId)
        );
        if (foundVideo) {
            setCurrentVideoInfo(foundVideo);
        }
    }, [currentLectureInfo, videoId]);

    const handleNavigationCurriculum = () => {
        navigate(`/class/${courseId}/curriculum/${lectureId}`);
    };

    return (
        <>
            <TopBar />
            <Container>
                <LeftSide>
                    <TitleContainer>
                        <MainTitle>
                            <span>{currentLectureInfo.lectureDescription || "강의를 선택해주세요"}</span>
                        </MainTitle>
                        
                        <ClickContainer onClick={handleNavigationCurriculum}>
                            <SubTitle>
                                {currentVideoInfo.videoTitle || "강의를 선택해주세요"}
                            </SubTitle>
                            <ArrowForwardIosIcon style={{ width: '13px', marginLeft: '15px' }}/>
                        </ClickContainer>
                    </TitleContainer>
                    <VideoPlaying videoUrl={currentVideoInfo.videoUrl} />
                </LeftSide>

                <RightSide>
                <PlayingCurriculumSidebar curriculumData={curriculumData} setCurriculumData={setCurriculumData} currentLectureInfo={currentLectureInfo} setCurrentLectureInfo={setCurrentLectureInfo}/>
                </RightSide>
            </Container>
        </>
    );
}

const Container = styled.div`
    display: flex;
    overflow: hidden;
    background-color: #F6F7F9;
`;

const LeftSide = styled.div`
    width: 70vw;
    flex: 1;
    padding: 0px 37px;
`;

const RightSide = styled.div`
    width: 30vw;
    padding: 0px 15px;
    padding-top: 36px;
    padding-bottom: 24px;
    background-color: #FFFFFF;
`;

const TitleContainer = styled.div`
    display: flex;
    margin-top: 36px;
    margin-bottom: 26px;
    align-items: flex-end;
`;

const MainTitle = styled.div`
    font-size: 24px;
    font-weight: 700;
    display: flex;
    align-items: center;
    margin-right: 10px;
`;

const ClickContainer = styled.div`
    display: flex;
    cursor: pointer;
`

const SubTitle = styled.div`
    font-size: 16px;
    font-weight: 400;
`;

export default ClassPlaying;