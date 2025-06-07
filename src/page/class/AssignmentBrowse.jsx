import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  getCurriculumWithAssignments,
  getAllAssignmentSubmissions,
} from "../../api/classCurriculumApi.js";
import { UsersContext } from "../../contexts/usersContext.jsx";
import AssignmentBrowseSidebar from "../../component/class/AssignmentBrowseSidebar.jsx";
import api from "../../api/api.js";
import rightButtonImg from "../../img/icon/rightbutton.svg";
import leftButtonImg from "../../img/icon/leftbutton.svg";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const formatSubmissionDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}.${month}.${day} ${hours}:${minutes}`;
};

const AssignmentBrowse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UsersContext);
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [curriculum, setCurriculum] = useState([]); // 주차별 커리큘럼
  const [allSubmissions, setAllSubmissions] = useState([]); // 모든 과제 제출
  const [openWeek, setOpenWeek] = useState(null);
  const [galleryIndexes, setGalleryIndexes] = useState({}); // {assignmentId: idx}
  const [imageErrors, setImageErrors] = useState({});
  const [imageUrls, setImageUrls] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 376);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    const isMobileView = window.matchMedia("(max-width: 376px)").matches;
    setIsMobile(isMobileView);
    setShowSidebar(!isMobileView);
  }, []);

  const handleToggle = () => setShowSidebar((prev) => !prev);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 커리큘럼, 제출 데이터 fetch
  useEffect(() => {
    const fetchData = async () => {
      if (!courseId || !user) return;
      try {
        const lectures = await getCurriculumWithAssignments(
          courseId,
          user.userId,
        );
        setCurriculum(lectures);
        const submissions = await getAllAssignmentSubmissions(courseId);
        setAllSubmissions(submissions);
        // 학생 목록 추출 (중복 없이)
        const studentMap = new Map();
        submissions.forEach((assignment) => {
          assignment.studentResults.forEach((result) => {
            if (!studentMap.has(result.userId)) {
              studentMap.set(result.userId, {
                id: result.userId,
                name: result.studentName,
                disabled: false, // 모든 학생의 과제를 볼 수 있도록 disabled 속성 제거
              });
            }
          });
        });
        const studentList = [...studentMap.values()];
        setStudents(studentList);
      } catch (e) {
        console.error("Error fetching data:", e);
      }
    };
    fetchData();
  }, [courseId, user]);

  // 학생 자동 선택
  useEffect(() => {
    if (students.length > 0) setSelectedStudentId(students[0].id);
  }, [students]);

  // 현재 선택된 학생의 제출 정보도 확인
  useEffect(() => {
    if (selectedStudentId) {
      const selectedStudent = students.find((s) => s.id === selectedStudentId);
    }
  }, [selectedStudentId, students]);

  // 현재 열린 주차 정보도 확인
  useEffect(() => {
    if (openWeek) {
      const currentLecture = curriculum.find((l) => l.lectureId === openWeek);
    }
  }, [openWeek, curriculum]);

  // 아코디언 토글
  const handleWeekToggle = (lectureId) => {
    const currentLecture = curriculum.find((l) => l.lectureId === lectureId);
    // 과제가 있는 경우에만 토글 가능
    if (
      currentLecture &&
      currentLecture.assignments.some((assignment) => {
        const hasValidTitle =
          assignment.assignmentTitle !== "과제 제목을 입력하세요.";
        const hasSubmissions =
          assignment.studentResults &&
          assignment.studentResults.some(
            (result) =>
              result.status !== "NOT_SUBMITTED" ||
              (result.files && result.files.length > 0) ||
              (result.textContent && result.textContent !== "null"),
          );
        return hasValidTitle || hasSubmissions || false;
      })
    ) {
      setOpenWeek((prev) => (prev === lectureId ? null : lectureId));
    }
  };

  // 특정 assignmentId에 대한 해당 학생 제출 내역 찾기
  const findStudentSubmission = (assignmentId) => {
    const assignment = allSubmissions.find(
      (a) => a.assignmentId === assignmentId,
    );
    if (!assignment) return null;
    return (
      assignment.studentResults.find((r) => r.userId === selectedStudentId) ||
      null
    );
  };

  // 이미지 확장자 판별 함수
  const isImageFile = (fileName = "") => {
    return /\.(jpg|jpeg|png)$/i.test(fileName);
  };

  // PDF 파일만 추출
  const isPdfFile = (fileName = "") => {
    return /\.pdf$/i.test(fileName);
  };

  // 갤러리 넘기기 핸들러 수정
  const handlePrev = (assignmentId, imageCount) => {
    if (imageCount <= 0) return;
    setGalleryIndexes((prev) => ({
      ...prev,
      [assignmentId]:
        prev[assignmentId] === 0
          ? imageCount - 1
          : (prev[assignmentId] || 0) - 1,
    }));
  };

  const handleNext = (assignmentId, imageCount) => {
    if (imageCount <= 0) return;
    setGalleryIndexes((prev) => ({
      ...prev,
      [assignmentId]:
        prev[assignmentId] === imageCount - 1
          ? 0
          : (prev[assignmentId] || 0) + 1,
    }));
  };

  // dot 클릭 시 해당 인덱스로 이동
  const handleDotClick = (assignmentId, idx) => {
    setGalleryIndexes((prev) => ({
      ...prev,
      [assignmentId]: idx,
    }));
  };

  // PDF 미리보기 핸들러
  const handlePdfPreview = async (fileUrl) => {
    try {
      const res = await api.get("/files/download", { params: { fileUrl } });
      const presignedUrl = res.data.data;
      window.open(presignedUrl, "_blank");
    } catch (e) {
      alert("PDF 미리보기에 실패했습니다.");
    }
  };

  const handleNavigationCurriculum = () => {
    navigate(`/class/${courseId}/curriculum/${curriculum[0].lectureId}`);
  };

  // 한글 포함 여부 확인 함수 추가
  const containsKorean = (str) => {
    return /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(str);
  };

  // 이미지 URL 처리 함수 수정
  const processImageUrl = async (fileUrl, fileName) => {
    try {
      // 파일명에 한글이 포함된 경우에만 URL 인코딩
      const finalUrl = containsKorean(fileName)
        ? encodeURIComponent(fileUrl)
        : fileUrl;
      const response = await api.get("/files/download", {
        params: { fileUrl: finalUrl },
      });

      const presignedUrl = response.data.data;
      return presignedUrl;
    } catch (e) {
      console.error("URL 처리 실패:", {
        originalUrl: fileUrl,
        fileName,
        error: e.message,
      });
      return fileUrl;
    }
  };

  // 이미지 URL 가져오기
  useEffect(() => {
    const fetchImageUrls = async () => {
      const newUrls = {};
      for (const lecture of curriculum) {
        for (const assignment of lecture.assignments) {
          const submission = findStudentSubmission(assignment.assignmentId);
          if (submission?.files) {
            for (const file of submission.files) {
              if (isImageFile(file.fileName)) {
                try {
                  const presignedUrl = await processImageUrl(
                    file.fileUrl,
                    file.fileName,
                  );
                  if (presignedUrl) {
                    newUrls[file.fileUrl] = presignedUrl;
                  }
                } catch (e) {
                  console.error("이미지 URL 가져오기 실패:", {
                    fileName: file.fileName,
                    fileUrl: file.fileUrl,
                  });
                }
              }
            }
          }
        }
      }
      setImageUrls(newUrls);
    };

    if (curriculum.length > 0) {
      fetchImageUrls();
    }
  }, [curriculum, selectedStudentId]);

  // 이미지 로드 에러 핸들러 개선
  const handleImageError = (fileUrl, fileName) => {
    console.error("Image load failed:", {
      originalUrl: fileUrl,
      fileName,
      encodedUrl: encodeURIComponent(fileUrl),
      decodedUrl: decodeURIComponent(fileUrl),
      extension: fileName.split(".").pop().toLowerCase(),
      cachedUrl: imageUrls[fileUrl],
    });
    setImageErrors((prev) => ({
      ...prev,
      [fileUrl]: true,
    }));
  };

  // 파일명 처리 함수 수정
  const truncateFileName = (fileName) => {
    const maxLength = 15; // 확장자를 제외한 최대 길이
    const dotIndex = fileName.lastIndexOf(".");
    if (dotIndex === -1) return fileName; // 확장자가 없는 경우

    const name = fileName.slice(0, dotIndex);
    const ext = fileName.slice(dotIndex); // .pdf 포함

    if (name.length > maxLength) {
      return `${name.slice(0, maxLength)}...${ext}`;
    }
    return fileName;
  };

  // URL 디코딩 함수 추가
  const decodeFileUrl = (url) => {
    try {
      return decodeURIComponent(url);
    } catch (e) {
      console.error("URL 디코딩 실패:", e);
      return url;
    }
  };

  return (
    <Container>
      <ContentWrapper>
        <TopTitle>
          {(() => {
            const selected = students.find((s) => s.id === selectedStudentId);
            return selected ? (
              <>
                <span className="name">{selected.name}</span>
                <span className="subtitle">
                  {" "}
                  과제목록{" "}
                  <ArrowForwardIosIcon
                    onClick={handleNavigationCurriculum}
                    style={{
                      width: "13px",
                      marginLeft: "15px",
                      cursor: "pointer",
                    }}
                  />
                </span>
              </>
            ) : (
              ""
            );
          })()}
        </TopTitle>

        <MainContent>
          <SubmissionList>
            {curriculum.map((lecture, idx) => (
              <AccordionBox
                key={lecture.lectureId}
                isOpen={openWeek === lecture.lectureId}
              >
                <AccordionHeader
                  onClick={() => handleWeekToggle(lecture.lectureId)}
                  isOpen={openWeek === lecture.lectureId}
                  hasAssignments={lecture.assignments.some((assignment) => {
                    const hasValidTitle =
                      assignment.assignmentTitle !== "과제 제목을 입력하세요.";
                    const hasSubmissions =
                      assignment.studentResults &&
                      assignment.studentResults.some(
                        (result) =>
                          result.status !== "NOT_SUBMITTED" ||
                          (result.files && result.files.length > 0) ||
                          (result.textContent && result.textContent !== "null"),
                      );
                    return hasValidTitle || hasSubmissions || false;
                  })}
                >
                  <AccordionTitle>{lecture.lectureTitle}</AccordionTitle>
                  <AccordionIcon>
                    {openWeek === lecture.lectureId ? "▲" : "▼"}
                  </AccordionIcon>
                </AccordionHeader>
                {openWeek === lecture.lectureId && (
                  <AccordionContent>
                    {lecture.assignments.length === 0 && (
                      <NoAssignment>과제가 없습니다.</NoAssignment>
                    )}
                    {lecture.assignments
                      .filter((assignment) => {
                        // 기본 제목이 아니거나, 모든 학생이 미제출 상태가 아닌 경우만 표시
                        const hasValidTitle =
                          assignment.assignmentTitle !==
                          "과제 제목을 입력하세요.";
                        const hasSubmissions =
                          assignment.studentResults &&
                          assignment.studentResults.some(
                            (result) =>
                              result.status !== "NOT_SUBMITTED" ||
                              (result.files && result.files.length > 0) ||
                              (result.textContent &&
                                result.textContent !== "null"),
                          );
                        return hasValidTitle || hasSubmissions || false;
                      })
                      .map((assignment, aIdx) => {
                        const submission = findStudentSubmission(
                          assignment.assignmentId,
                        );
                        const imageFiles = (submission?.files || []).filter(
                          (f) => isImageFile(f.fileName),
                        );
                        const pdfFiles = (submission?.files || []).filter((f) =>
                          isPdfFile(f.fileName),
                        );
                        const otherFiles = (submission?.files || []).filter(
                          (f) =>
                            !isImageFile(f.fileName) && !isPdfFile(f.fileName),
                        );
                        const galleryIdx =
                          galleryIndexes[assignment.assignmentId] || 0;

                        return (
                          <>
                            <SubmissionBox key={assignment.assignmentId}>
                              <SubmissionHeader>
                                <AssignmentInfo>
                                  <h4>{assignment.assignmentTitle}</h4>
                                  {submission?.submittedAt && (
                                    <SubmissionDate className="submission-date">
                                      {formatSubmissionDate(
                                        submission.submittedAt,
                                      )}
                                    </SubmissionDate>
                                  )}
                                </AssignmentInfo>
                                <FileList
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "5px",
                                  }}
                                >
                                  {/* 이미지 갤러리 */}
                                  {imageFiles.length > 0 && (
                                    <GalleryWrapper>
                                      <GalleryArrow
                                        onClick={() =>
                                          handlePrev(
                                            assignment.assignmentId,
                                            imageFiles.length,
                                          )
                                        }
                                        disabled={imageFiles.length <= 1}
                                        left
                                      >
                                        <img
                                          src={leftButtonImg}
                                          alt="이전"
                                          style={{ width: 24, height: 24 }}
                                        />
                                      </GalleryArrow>
                                      {imageFiles[galleryIdx] && (
                                        <GalleryImage
                                          src={
                                            imageUrls[
                                              imageFiles[galleryIdx].fileUrl
                                            ] || imageFiles[galleryIdx].fileUrl
                                          }
                                          alt={imageFiles[galleryIdx].fileName}
                                          onError={() =>
                                            handleImageError(
                                              imageFiles[galleryIdx].fileUrl,
                                              imageFiles[galleryIdx].fileName,
                                            )
                                          }
                                          style={{
                                            display: imageErrors[
                                              imageFiles[galleryIdx].fileUrl
                                            ]
                                              ? "none"
                                              : "block",
                                          }}
                                        />
                                      )}
                                      {(!imageFiles[galleryIdx] ||
                                        imageErrors[
                                          imageFiles[galleryIdx]?.fileUrl
                                        ]) && (
                                        <div
                                          style={{
                                            width: "100%",
                                            height: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            background: "#f8f8f8",
                                            borderRadius: "16px",
                                            color: "#666",
                                            fontSize: "14px",
                                            padding: "20px",
                                            textAlign: "center",
                                            boxShadow:
                                              "0 2px 8px rgba(0,0,0,0.06)",
                                          }}
                                        >
                                          이미지를 불러올 수 없습니다
                                          <br />
                                          {imageFiles[galleryIdx] &&
                                            `(파일명: ${imageFiles[galleryIdx].fileName})`}
                                        </div>
                                      )}
                                      <GalleryArrow
                                        onClick={() =>
                                          handleNext(
                                            assignment.assignmentId,
                                            imageFiles.length,
                                          )
                                        }
                                        disabled={imageFiles.length <= 1}
                                        right
                                      >
                                        <img
                                          src={rightButtonImg}
                                          alt="다음"
                                          style={{ width: 24, height: 24 }}
                                        />
                                      </GalleryArrow>
                                    </GalleryWrapper>
                                  )}
                                  {/* 하단 dot 네비게이션 */}
                                  <GalleryDots>
                                    {imageFiles.map((_, idx) => (
                                      <Dot
                                        key={idx}
                                        active={galleryIdx === idx}
                                        onClick={() =>
                                          handleDotClick(
                                            assignment.assignmentId,
                                            idx,
                                          )
                                        }
                                      />
                                    ))}
                                  </GalleryDots>
                                </FileList>
                                {submission &&
                                  submission.textContent &&
                                  submission.textContent !== "null" && (
                                    <TextContent>
                                      {submission.textContent}
                                    </TextContent>
                                  )}
                                {/* PDF 파일 빨간 글씨로 목록화 */}
                                {pdfFiles.length > 0 && (
                                  <PdfList>
                                    <PdfListTitle>첨부 파일</PdfListTitle>
                                    <PdfListContent>
                                      {pdfFiles.map((file, fileIdx) => (
                                        <PdfLinkButton
                                          key={fileIdx}
                                          type="button"
                                          onClick={() =>
                                            handlePdfPreview(file.fileUrl)
                                          }
                                        >
                                          <PdfListName>
                                            {truncateFileName(file.fileName)}
                                          </PdfListName>
                                          <PdfListSize>
                                            {file.fileSize}
                                          </PdfListSize>
                                        </PdfLinkButton>
                                      ))}
                                    </PdfListContent>
                                  </PdfList>
                                )}
                                {/* 미제출 안내 */}
                                {(!submission ||
                                  ((submission.files?.length ?? 0) === 0 &&
                                    (!submission.textContent ||
                                      submission.textContent === "null"))) && (
                                  <ReadThinText>미제출</ReadThinText>
                                )}
                              </SubmissionHeader>
                            </SubmissionBox>
                            {aIdx !== lecture.assignments.length - 1 && (
                              <AssignmentDivider />
                            )}
                          </>
                        );
                      })}
                  </AccordionContent>
                )}
              </AccordionBox>
            ))}
          </SubmissionList>
        </MainContent>

        {isMobile && (
          <MobileToggleButton type="button" onClick={handleToggle}>
            {showSidebar ? (
              <CloseIcon style={{ fontSize: "2.8vh" }} />
            ) : (
              <MenuIcon style={{ fontSize: "2.8vh" }} />
            )}
          </MobileToggleButton>
        )}
      </ContentWrapper>

      {/* 모바일/데스크탑 분기 */}
      {!isMobile ? (
        <SidebarArea>
          <AssignmentBrowseSidebar
            students={students}
            selectedId={selectedStudentId}
            onSelect={setSelectedStudentId}
          />
        </SidebarArea>
      ) : (
        <>
          <SidebarSlideWrapper show={showSidebar}>
            <SidebarArea>
              <AssignmentBrowseSidebar
                students={students}
                selectedId={selectedStudentId}
                onSelect={setSelectedStudentId}
              />
            </SidebarArea>
          </SidebarSlideWrapper>
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  background: #f6f7f9;
  min-height: 80vh;
  display: flex;
  flex-direction: row;
  padding: 28px 0px;
`;

const TopTitle = styled.div`
  font-size: 20px;
  color: #222;
  margin-bottom: 18px;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 6px;

  .name {
    font-weight: 700;
    display: flex;
    align-items: center;
  }

  .subtitle {
    font-weight: 400;
    display: flex;
    align-items: center;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  padding-left: 5px;
  padding-right: 20px;
  position: relative;

  @media screen and (max-width: 1440px) {
    width: 65vw;
  }

  @media screen and (max-width: 1024px) {
    width: 60vw;
  }

  @media screen and (max-width: 768px) {
    width: 55vw;
  }

  @media screen and (max-width: 480px) {
    padding-right: 5px;
  }

  @media screen and (max-width: 376px) {
    width: 100%;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const SidebarArea = styled.div`
  background: transparent;
  display: flex;
  flex-direction: column;
`;

const SubmissionList = styled.div`
  flex: 1;
`;

const AccordionBox = styled.div`
  margin-bottom: 18px;
`;

const AccordionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: ${(props) => (props.isOpen ? "10px 10px 0 0" : "10px")};
  padding: 24px 28px;
  font-size: 17px;
  font-weight: 700;
  background: #fff;
  cursor: ${(props) => (props.hasAssignments ? "pointer" : "default")};
  border-bottom: ${(props) => (props.isOpen ? "1px solid #E5E5E5" : "none")};
  opacity: ${(props) => (props.hasAssignments ? "1" : "0.6")};
`;

const AccordionTitle = styled.div``;
const AccordionIcon = styled.div`
  font-size: 16px;

  @media screen and (max-width: 376px) {
    font-size: 14px;
  }
`;
const AccordionContent = styled.div`
  padding: 24px 28px;
  background: #fff;
  border-radius: 0 0 10px 10px;
  width: 100%;
  box-sizing: border-box;
`;
const NoAssignment = styled.div`
  color: #bbb;
  font-size: 15px;
  padding: 16px 0;
`;
const SubmissionBox = styled.div`
  background: #fff;
  border-radius: 12px;
  margin-top: 14px;
  &:not(:first-child) {
    margin-top: 38px;
  }
`;

const SubmissionHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const AssignmentInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  h4 {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 2px 0;
  }
`;

const SubmissionDate = styled.span`
  font-size: 13px;
  font-weight: 400;
  color: #474747;
  margin-bottom: 12px;
  margin-left: 3px;
`;

const FileList = styled.div`
  display: flex;
  gap: 6px;
  justify-content: flex-end;
`;

const DownloadLink = styled.a`
  color: var(--main-color);
  text-decoration: none;
  font-size: 14px;
  &:hover {
    text-decoration: underline;
  }
`;

const ReadThinText = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #ff4747;
`;

const TextContent = styled.div`
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  white-space: pre-wrap;
  padding: 6px;
  border-radius: 8px;
  margin-top: 8px;
  margin-bottom: 12px;
`;

const GalleryWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  width: 100%;
  height: 360px;
  background: #f6f7f9;
  border-radius: 16px;
  margin: 0 auto 8px auto;
  overflow: hidden;

  @media screen and (max-width: 376px) {
    height: 300px;
  }
`;

const GalleryImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 12px;
  object-fit: contain;
  display: block;
  margin: auto;
`;

const GalleryArrow = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #888;
  font-size: 28px;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transition:
    background 0.2s,
    color 0.2s;
  ${({ left }) => left && "left: 16px;"}
  ${({ right }) => right && "right: 16px;"}
  &:disabled {
    color: #eee;
    cursor: default;
  }
`;

// dot 네비게이션 스타일
const GalleryDots = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
`;
const Dot = styled.button`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: ${({ active }) => (active ? "#FFADAD" : "#e0e0e0")};
  transition: background 0.2s;
  cursor: pointer;
  padding: 0;
`;

const PdfList = styled.div`
  margin: 10px 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PdfListTitle = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: #474747;
  margin-bottom: 8px;
`;

const PdfListContent = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

const PdfListName = styled.div`
  color: #ff4747;
  text-decoration: underline;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
`;

const PdfListSize = styled.div`
  font-size: 13px;
  font-weight: 400;
  color: #d1d1d1;
`;

const PdfLinkButton = styled.button`
  width: 180px;
  padding: 12px 14px;
  margin: 0;
  border-radius: 5px;
  background-color: #f6f7f9;
  border: 0;
  cursor: pointer;
  text-align: left;

  @media screen and (max-width: 376px) {
    width: 120px;
    padding: 10px 12px;
  }
`;

// 과제 구분선 스타일
const AssignmentDivider = styled.div`
  width: 100%;
  height: 1px;
  background: #e5e5e5;
  margin: 24px 0 0 0;
`;

const MobileToggleButton = styled.button`
  display: none;

  @media (max-width: 376px) {
    display: block;
    position: fixed;
    bottom: 4.6%;
    left: 5%;
    z-index: 1300;
    background: white;
    border: 1px solid #ccc;
    border-radius: 50%;
    padding: 0.8vh;
    font-size: 0.5vh;
    cursor: pointer;
    color: var(--main-color);
  }
`;

const SidebarSlideWrapper = styled.div`
  @media (max-width: 376px) {
    position: fixed;
    top: 0;
    left: ${(props) => (props.show ? "0" : "-100%")};
    width: 55%;
    padding: 1rem 0;
    height: 100%;
    background-color: white;
    z-index: 1100;
    transition: left 0.3s ease-in-out;
    box-shadow: 2px 0px 10px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
  }
`;

export default AssignmentBrowse;
