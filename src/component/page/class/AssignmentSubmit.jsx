import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import TopBar from '../../ui/TopBar';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import api from "../../api/api";
import PlayingCurriculumSidebar from '../../ui/class/PlayingCurriculumSidebar';
import { UsersContext } from '../../contexts/usersContext';
import AssignmentModal from "../../ui/class/AssignmentModal";
import AssignmentSubmitBox from '../../ui/class/AssignmentSubmitBox';
import AssignmentShowBox from '../../ui/class/AssignmentShowBox';

const ClassAssignmentSubmit = () => {
    const navigate = useNavigate();
    const { courseId, lectureId, assignmentId } = useParams();
    const { user } = useContext(UsersContext);

    const [content, setContent] = useState('');
    const [files, setFiles] = useState([]);
    const [previousFiles, setPreviousFiles] = useState([]);
    const [deletedFiles, setDeletedFiles] = useState([]);
    
    const [submissionId, setSubmissionId] = useState(null);
    const [submissionStatus, setSubmissionStatus] = useState('');

    const [curriculumData, setCurriculumData] = useState([]);
    const [currentLectureInfo, setCurrentLectureInfo] = useState([]);
    const [currentAssignmentInfo, setCurrentAssignmentInfo] = useState([]);

    const [isSubmittedModalOpen, setIsSubmittedModalOpen] = useState(false);
    const [isReSubmittedModalOpen, setIsReSubmittedModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [canEdit, setCanEdit] = useState(false);

    const handleNavigationCurriculum = () => {
        navigate(`/class/${courseId}/curriculum/${lectureId}`);
    };

    useEffect(() => {
        const fetchSubmissionData = async () => {
            try {
                if (!assignmentId || !lectureId || !user || !courseId) return;

                const lectureResponse = await api.get(`/lectures/history/${courseId}/${user.userId}`);
                if (lectureResponse.data.success) {
                    const submission = lectureResponse.data.data.submissions.find(
                        (submission) => submission.assignmentId === parseInt(assignmentId)
                    );
                    if (submission) {
                        setSubmissionId(submission.submissionId);
                        setSubmissionStatus(submission.submissionStatus);
                        console.log(submissionStatus);
                    } else {
                        setSubmissionId(null);
                        setSubmissionStatus("NOT_SUBMITTED");
                    }
                }
            } catch (error) {
                console.error("제출 정보 로딩 오류:", error);
            }
        };

        fetchSubmissionData();
    }, [assignmentId, lectureId, courseId, user]);

    useEffect(() => {
        const fetchAssignmentData = async () => {
            if (!submissionId || !assignmentId || !user) return;

            try {
                const statusResponse = await api.get(
                    `/assignments/${assignmentId}/submissions/${submissionId}/${user.userId}`
                );

                if (statusResponse.data.success) {
                    const filesData = statusResponse.data.data.fileNames.map((fileName, index) => ({
                        id: Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                        name: fileName,
                        size: statusResponse.data.data.fileSizes[index],
                        fileUrl: statusResponse.data.data.fileUrls[index],
                    }));
                    
                    setFiles(filesData);
                    setPreviousFiles(filesData);
                    setContent(statusResponse.data.data.textContent);
                }
            } catch (error) {
                console.error("과제 정보 로딩 오류:", error);
            }
        };

        fetchAssignmentData();
    }, [submissionId, assignmentId, user]);

    useEffect(() => {
        if (!currentLectureInfo?.videos || !assignmentId) return;

        const foundAssignment = currentLectureInfo.assignments.find(
            assignment => assignment.assignmentId === Number(assignmentId)
        );

        if (foundAssignment) {
            setCurrentAssignmentInfo(foundAssignment);
        }
    }, [currentLectureInfo, assignmentId]);

    useEffect(() => {
        if (submissionStatus === 'NOT_SUBMITTED') {
            setCanEdit(true);
        } else {
            setCanEdit(false);
        }
    }, [assignmentId, submissionStatus]);

    return (
        <Wrapper>
        <TopBar />
        <Container>
            <LeftSide>
                <TitleContainer>
                    <MainTitle>
                        {currentLectureInfo?.lectureDescription || "강의를 선택해주세요"}
                    </MainTitle>
                    
                    <ClickContainer onClick={handleNavigationCurriculum}>
                        <ArrowForwardIosIcon style={{ width: '13px', marginLeft: '15px' }}/>
                    </ClickContainer>
                </TitleContainer>
                
                <WhiteBoxComponent>
                    <NoticeTitleContainer>
                        <FormTitle style={{marginTop: '0px'}}>
                            {currentAssignmentInfo?.assignmentTitle || "과제 제목"}
                        </FormTitle>
                    </NoticeTitleContainer>
                    <NoticeContentContainer>
                        {currentAssignmentInfo?.assignmentDescription || "과제 설명"}
                    </NoticeContentContainer>
                </WhiteBoxComponent>

                {(submissionStatus === 'NOT_SUBMITTED' || canEdit) ? (
                    <AssignmentSubmitBox
                        canEdit={canEdit}
                        setCanEdit={setCanEdit}
                        content={content}
                        setContent={setContent}
                        files={files}
                        setFiles={setFiles}
                        submissionId={submissionId}
                        submissionStatus={submissionStatus}
                        setIsSubmittedModalOpen={setIsSubmittedModalOpen}
                        setIsReSubmittedModalOpen={setIsReSubmittedModalOpen}
                    />
                ) : (
                    <AssignmentShowBox
                        setCanEdit={setCanEdit}
                        content={content}
                        files={files}
                        submissionId={submissionId}
                        submissionStatus={submissionStatus}
                        setIsDeleteModalOpen={setIsDeleteModalOpen}
                    />
                )}
            </LeftSide>

            <RightSide>
                <PlayingCurriculumSidebar
                    curriculumData={curriculumData} setCurriculumData={setCurriculumData}
                    currentLectureInfo={currentLectureInfo} setCurrentLectureInfo={setCurrentLectureInfo}
                />
            </RightSide>

            { isSubmittedModalOpen && <AssignmentModal text="과제 제출이 완료되었습니다."  onClose={() => {setIsSubmittedModalOpen(false); window.location.reload();}}/> }
            { isReSubmittedModalOpen && <AssignmentModal text="과제 수정이 완료되었습니다."  onClose={() => {setIsReSubmittedModalOpen(false); window.location.reload();}}/> }
            { isDeleteModalOpen && <AssignmentModal text="과제 삭제가 완료되었습니다."  onClose={() => {setIsDeleteModalOpen(false); window.location.reload();}}/> }
        </Container>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    height: 100vh;
`

const Container = styled.div`
    display: flex;
    height: 100%,
    background-color: #F6F7F9;
`;

const LeftSide = styled.div`
    width: 70vw;
    flex: 1;
    padding: 0px 37px;
    height: calc(92vh - 16px);
    overflow-y: scroll;
    &::-webkit-scrollbar {
        display: none;
    }
`;

const FormTitle = styled.div`
    font-size: 17px;
    font-weight: 700;
    padding: 0px 10px;
    margin-top: 5px;
`;

const WhiteBoxComponent = styled.div`
    border-radius: 20px;
    background-color: #FFFFFF;
    height: 30vh;
    margin-bottom: 50px;
    padding: 10px;
`

const NoticeTitleContainer = styled.div`
    border-radius: 13px;
    background-color: #F6F7F9;
    height: 40px;
    display: flex;
    align-items: center;
    margin-bottom: 15px;
`

const NoticeContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding-left: 10px;
`

const TitleContainer = styled.div`
    margin-top: 36px;
    margin-bottom: 26px;
    display: flex;
    align-items: flex-end;
`;

const MainTitle = styled.div`
    font-size: 24px;
    font-weight: 700;
    display: flex;
    align-items: center;
    align-items: center;
    margin-right: 10px;
`;

const ClickContainer = styled.div`
    display: flex;
    cursor: pointer;
`

const RightSide = styled.div`
    width: 30vw;
    padding: 0px 15px;
    padding-top: 36px;
    background-color: #FFFFFF;
`;

const EditorContainer = styled.div`
    border: 2px solid #CDCDCD;
    border-radius: 8px;
    overflow: hidden;
    margin-top: 10px;
    height: 18vh;
    margin: 10px;
`;

const TextArea = styled.textarea`
    width: 100%;
    height: 18vh;
    padding: 16px;
    border: none;
    resize: none;
    font-size: 13px;

    &::placeholder {
        color: #9E9E9E;
    }

    &:focus {
        outline: none;
    }

    background-color: $submissionStatus === 'NOT_SUBMITTED' ? #FFFFFF : '#F6F7F9';
`;

const ImageItemContainer = styled.div`
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    gap: 10px;
    margin: 10px;
    padding-bottom: 5px;
    background-color: #F6F7F9;
    border-radius: 10px;
    height: 40px;
`;

const ImageItem = styled.div`
    display: flex;
    align-items: center;
    background-color: #F6F7F9;
    padding: 5px;
    justify-content: space-between;
    border-radius: 8px;
`;
const ImageText = styled.div`
    margin-right: 3px;
    max-width: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
`;

const SubmitButton = styled.button`
    float: right;
    padding: 8px 20px;
    background-color: #FF4747;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    margin-right: 10px;
`;

export default ClassAssignmentSubmit;