import { useState, useEffect, useContext } from "react";
import {
  useNavigate,
  useLocation,
  useParams,
  useOutletContext,
} from "react-router-dom";
import styled from "styled-components";
import LogoSymbol from "../../img/logo/itda_logo_symbol.svg";
import CurriculumSidebar from "../../ui/class/CurriculumSidebar";
import ClassThumbnail from "../../img/class/class_thumbnail.svg";
import DoneIcon from "../../img/class/check/done_icon.svg";
import UndoneIcon from "../../img/class/check/undone_icon.svg";
import Assignment from "../../img/icon/docs.svg";
import Material from "../../img/icon/pdf.svg";
import PlayIcon from "../../img/class/play_icon.svg";
import SelectedSection from "../../img/class/check/sel_sec.svg";
import UnselectedSection from "../../img/class/check/unsel_sec.svg";
import DoneSection from "../../img/class/check/done_sec.svg";
import EditButton from "../../ui/class/EditButton";
import Close from "@mui/icons-material/Close";
import api from "../../api/api";
import { UsersContext } from "../../contexts/usersContext";
import { getYouTubeThumbnail } from "../../ui/curriculum/EditableSection";

const Section = styled.div`
  display: flex;
  padding: 1.3rem 1.5rem;
  border-radius: 14px;
  margin: 1.15rem 0rem;
  background-color: #ffffff;
  cursor: pointer;
  width: 100%;
`;

const CurriculumTitle = styled.h3`
  font-size: 1.65rem;
  font-weight: 700;
  margin-bottom: -0.3rem;
  margin-top: 0.5rem;
  letter-spacing: -1px;

  @media (max-width: 1024px) {
    font-size: 23px;
    height: 4.5vh;
  }

  @media (max-width: 768px) {
    font-size: 21px;
    height: 3vh;
    margin-left: -2vh;
  }

  @media (max-width: 480px) {
    font-size: 11px;
    padding: 0.3vh 1vh;
    height: 4.7vh;
  }
`;

const VideoContainer = styled.div`
  position: relative;
  width: 14.5rem;
  border-radius: 8px;

  @media (max-width: 1024px) {
    width: 24vh;
  }

  @media (max-width: 768px) {
    font-size: 14.5px;
    padding: 0vh 1.3vh;
    height: 5vh;
  }

  @media (max-width: 480px) {
    font-size: 11px;
    padding: 0.3vh 1vh;
    height: 4.7vh;
  }
`;

const VideoThumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
`;

const MaterialSection = styled.div`
  display: flex;
  background-color: var(--lightgrey-color);
  width: 100%;
  padding: 1.2rem 1.5rem;
  border-radius: 8px;
  font-size: 1.07rem;
`;

const Icon = styled.img`
  width: 4.3vh;
  height: 50%;
  marginleft: 1rem;
  marginright: 1rem;

  @media (max-width: 1024px) {
    width: 15vh;
  }

  @media (max-width: 768px) {
    width: 15px;
    padding: 0vh 1.3vh;
    height: 5vh;
  }

  @media (max-width: 480px) {
    width: 15px;
    padding: 0.3vh 1vh;
  }
`;

const SectionIcon = styled.img`
  margin-left: auto;

  @media (max-width: 1024px) {
    width: 15vh !important;
  }

  @media (max-width: 768px) {
    font-size: 14.5px;
    padding: 0vh 1.3vh;
    height: 5vh;
  }

  @media (max-width: 480px) {
    font-size: 11px;
    padding: 0.3vh 1vh;
    height: 4.7vh;
  }
`;

const LectureTitle = styled.h1`
  font-size: 2.3rem;
  font-weight: 700;
  color: var(--main-color);
  margin: 0;
  margin-bottom: -0.2rem;

  @media (max-width: 1024px) {
    font-size: 30px;
  }
`;

const LectureDescription = styled.span`
  font-size: 1.6rem;
  font-weight: bolder;

  @media (max-width: 1024px) {
    font-size: 22px;
  }
`;

const VideoDetails = styled.p`
  font-size: 17.3px;
  color: #909090;
  display: flex;
  gap: 1vh;
  display: flex;

  @media (max-width: 1024px) {
    font-size: 16px;
    display: flex;
    flex-direction: column;
  }
  @media (max-width: 768px) {
    font-size: 14px;
    margin-left: -2vh;
  }
`;

const PlayButton = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1.8rem;
  height: auto;
  cursor: pointer;
  z-index: 10;
`;

export const formatDate = (isoString) => {
  if (!isoString) return " ";
  const date = new Date(isoString);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const sec = String(date.getSeconds()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd} ${hh}:${min}:${sec}`;
};

export const formatLecturePeriod = (isoString) => {
  if (!isoString) return " ";
  const date = new Date(isoString);
  const monthNames = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  return `${month} ${day}일`;
};

const Curriculum = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const { courseId, lectureId } = useParams();

  const { user } = useContext(UsersContext);
  const userId = user.userId;
  const { courseData } = useOutletContext();
  const [curriculumData, setCurriculumData] = useState([]);
  const [historyData, setHistoryData] = useState({
    materials: [],
    submissions: [],
  });
  const [activeLectureId, setActiveLectureId] = useState(
    Number(lectureId) || 1
  );
  const [activeLecture, setActiveLecture] = useState(null);

  const context = useOutletContext();
  const isCreator = context?.isCreator || false;
  const [allCompleted, setAllCompleted] = useState(false);
  const [allCompletedLectures, setAllCompletedLectures] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const curriculumRes = await api.get(
          `/lectures/curriculum/${courseId}/${userId}`
        );
        const historyRes = await api.get(
          `/lectures/history/${courseId}/${userId}`
        );

        if (curriculumRes.data.success) {
          // const lectures = curriculumRes.data.data || [];
          // const lectures = curriculumRes.data.data?.curriculumResponses || [];

          // setCurriculumData(lectures);

          // const defaultLecture =
          //   lectures.find((lec) => lec.lectureId === Number(lectureId)) ||
          //   lectures[0];

          const { curriculumResponses, instructorName } =
            curriculumRes.data.data || {};
          const lectures = curriculumResponses || [];
          setCurriculumData(lectures);

          const defaultLecture =
            lectures.find((lec) => lec.lectureId === Number(lectureId)) ||
            lectures[0];

          setActiveLectureId(defaultLecture.lectureId);

          setActiveLecture({
            ...defaultLecture,
            instructorName,
            subSections: [
              ...(defaultLecture.videos || []).map((v) => ({
                ...v,
                title: v.videoTitle,
                id: v.contentOrderIndex,
                url: v.videoUrl,
                thumbnail: getYouTubeThumbnail(v.videoUrl),
                checked: false,
              })),
              ...(defaultLecture.materials || []).map((m) => ({
                ...m,
                title: m.originalFilename,
                id: m.contentOrderIndex,
                url: m.materialFile,
                checked: false,
              })),
              ...(defaultLecture.assignments || []).map((a) => ({
                ...a,
                title: a.assignmentTitle,
                id: a.contentOrderIndex,
                deadline: a.endDate,
                checked: false,
              })),
            ].sort(
              (a, b) => (a.contentOrderIndex || 0) - (b.contentOrderIndex || 0)
            ),
          });
        }
        if (historyRes.data.success) {
          setHistoryData(historyRes.data.data);
        }
      } catch (error) {
        console.error("커리큘럼 데이터 로딩 오류:", error);
      }
    }
    fetchData();
  }, [courseId, userId, lectureId]);

  useEffect(() => {
    if (!activeLecture || !historyData) return;

    // 변경 사항이 없으면 업데이트하지 않도록 최적화
    const updatedSubSections = activeLecture.subSections.map((sub) => {
      let isChecked = false;

      if (sub.contentType === "material") {
        const materialHistory = historyData.materials.find(
          (m) => m.materialId === sub.materialId
        );
        isChecked = materialHistory?.materialHistoryStatus || false;
      } else if (sub.contentType === "assignment") {
        const assignmentHistory = historyData.submissions.find(
          (a) => a.assignmentId === sub.assignmentId
        );
        isChecked =
          assignmentHistory?.submissionStatus === "SUBMITTED" ||
          assignmentHistory?.submissionStatus === "LATE";
      }

      return { ...sub, checked: isChecked };
    });

    if (
      JSON.stringify(activeLecture.subSections) !==
      JSON.stringify(updatedSubSections)
    ) {
      setActiveLecture((prev) => ({
        ...prev,
        subSections: updatedSubSections,
      }));
    }
  }, [historyData]);

  // 과제 제출 및 자료 다운 여부
  useEffect(() => {
    if (!curriculumData || !historyData) return;

    const completedStatus = {};

    curriculumData.forEach((lecture) => {
      const lectureMaterials = lecture.materials || [];
      const lectureAssignments = lecture.assignments || [];

      const allMaterialsCompleted = lectureMaterials.every((material) =>
        historyData.materials.some(
          (history) =>
            history.materialId === material.materialId &&
            history.materialHistoryStatus
        )
      );

      const allAssignmentsSubmitted = lectureAssignments.every((assignment) =>
        historyData.submissions.some(
          (history) =>
            history.assignmentId === assignment.assignmentId &&
            (history.submissionStatus === "SUBMITTED" ||
              history.submissionStatus === "LATE")
        )
      );

      completedStatus[lecture.lectureId] =
        allMaterialsCompleted && allAssignmentsSubmitted;
    });

    setAllCompletedLectures(completedStatus);
  }, [curriculumData, historyData]);

  const handleSectionClick = (sub) => {
    if (isCreator && sub.contentType === "assignment") {
      return;
    }
    const now = new Date();
    const startDate = new Date(sub.startDate);
    const endDate = new Date(sub.endDate);

    if (sub.contentType === "video") {
      if (
        now.getTime() < startDate.getTime() ||
        now.getTime() > endDate.getTime()
      ) {
        alert(
          `이 콘텐츠는 ${startDate.toLocaleString()} ~ ${endDate.toLocaleString()}까지만 접근 가능합니다.`
        );
        return;
      }

      navigate(`/playing/${courseId}/${activeLectureId}/${sub.videoId}`);
    } else if (sub.contentType === "assignment") {
      if (now.getTime() < startDate.getTime()) {
        alert(
          `이 과제는 ${startDate.toLocaleString()} 이후에 제출할 수 있습니다.`
        );
        return;
      }
      navigate(
        `/assignment/submit/${courseId}/${activeLectureId}/${sub.assignmentId}`
      );
    }
  };

  const handleMaterialClick = async (material) => {
    const now = new Date();
    const startDate = new Date(material.startDate);
    const endDate = new Date(material.endDate);

    if (
      now.getTime() < startDate.getTime() ||
      now.getTime() > endDate.getTime()
    ) {
      alert(
        `이 자료는 ${startDate.toLocaleString()} ~ ${endDate.toLocaleString()}까지만 다운로드 가능합니다.`
      );
      return;
    }

    try {
      const response = await api.get("/materials/download", {
        params: {
          fileUrl: material.materialFile,
          materialId: material.materialId,
        },
      });

      const presignedUrl = response.data.data;
      const fileResponse = await fetch(presignedUrl);
      const arrayBuffer = await fileResponse.arrayBuffer();

      const fileExtension = material.originalFilename
        .split(".")
        .pop()
        .toLowerCase();
      let mimeType = "application/octet-stream";

      if (fileExtension === "pdf") {
        mimeType = "application/pdf";
      } else if (fileExtension === "txt") {
        mimeType = "text/plain";
      } else if (["jpg", "jpeg", "png", "gif"].includes(fileExtension)) {
        mimeType = `image/${fileExtension}`;
      } else if (fileExtension === "zip") {
        mimeType = "application/zip";
      }

      const blob = new Blob([arrayBuffer], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = material.originalFilename;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("파일 처리 중 오류:", error);
    }
  };

  // 학생들에게 보일 섹션 / 교육자에게 보일 섹션 필터
  const filteredSubSections = isCreator
    ? activeLecture?.subSections
    : activeLecture?.subSections.filter((sub) =>
        Object.values(sub).every((value) => value !== null)
      );

  return (
    <div style={{ display: "flex" }}>
      <CurriculumSidebar
        sections={curriculumData}
        activeItem={activeLectureId}
        setActiveItem={setActiveLectureId}
        edit={false}
        completedLectures={allCompletedLectures}
      />
      <main
        style={{
          flex: 1,
          padding: "2rem",
          borderRadius: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <LectureTitle>{activeLecture?.lectureTitle}</LectureTitle>

          <p
            style={{
              color: "#969696",
              fontSize: "1.2rem",
              marginLeft: "1rem",
              fontWeight: "510",
              margin: "0 1rem",
            }}
          >
            [{formatLecturePeriod(activeLecture?.startDate)} ~{" "}
            {formatLecturePeriod(activeLecture?.endDate)}]
          </p>
        </div>

        <Section
          style={{
            backgroundColor: allCompletedLectures[activeLectureId]
              ? "var(--pink-color)"
              : "var(--grey-color)",
            padding: "2vh 2.5vh",
          }}
        >
          <LectureDescription>
            {activeLecture?.lectureDescription}
          </LectureDescription>
          {!isCreator && (
            <SectionIcon
              src={
                allCompletedLectures[activeLectureId]
                  ? DoneSection
                  : UnselectedSection
              }
              style={{
                marginLeft: "auto",
                marginRight: "1.35rem",
                width: "1.8rem",
              }}
            />
          )}
        </Section>

        {filteredSubSections?.map((sub) => (
          <div key={sub.id}>
            <div>
              {sub.contentType === "video" && (
                <Section
                  style={{ display: "flex" }}
                  onClick={() => handleSectionClick(sub)}
                >
                  <VideoContainer>
                    {sub.thumbnail ? (
                      <VideoThumbnail
                        src={sub.thumbnail}
                        alt="YouTube 썸네일"
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "8rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#f0f0f0",
                          borderRadius: "8px",
                          color: "#909090",
                          fontSize: "1rem",
                        }}
                      />
                    )}
                    <PlayButton src={PlayIcon} />
                  </VideoContainer>
                  <div
                    style={{
                      marginLeft: "2rem",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      justifyContent: "flex-start",
                    }}
                  >
                    <CurriculumTitle>{sub.title}</CurriculumTitle>
                    <VideoDetails>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <span>{activeLecture.instructorName}</span>
                        <span
                          style={{
                            borderLeft: "1.5px solid #909090",
                            height: "1rem",
                            marginLeft: "1.3vh",
                            marginRight: "0.5vh",
                          }}
                        ></span>
                      </div>

                      <span
                      // style={{
                      //   whiteSpace: "nowrap",
                      //   flexShrink: 0,
                      // }}
                      >
                        {formatDate(sub?.startDate)} ~{" "}
                        {formatDate(sub?.endDate)}
                      </span>
                    </VideoDetails>
                  </div>
                </Section>
              )}

              {sub.contentType === "material" && (
                <Section
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  <Icon
                    src={Material}
                    style={{
                      width: "4.3vh",
                      height: "50%",
                      marginLeft: "1rem",
                      marginRight: "1rem",
                    }}
                  />
                  <MaterialSection>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "0.5vh",
                      }}
                    >
                      <span
                        style={{
                          marginRight: "0.6rem",
                          cursor: "pointer",
                          display: "inline-block",
                        }}
                        onClick={() => handleMaterialClick(sub)}
                      >
                        {sub.title}
                      </span>
                      <span
                        style={{
                          color: "var(--main-color)",
                          fontSize: "0.9rem",
                        }}
                      >
                        {sub.fileSize || ""}
                      </span>
                    </div>

                    {!isCreator && (
                      <img
                        src={sub.checked ? DoneIcon : UndoneIcon}
                        alt="download status"
                        style={{ marginLeft: "auto", width: "1.2rem" }}
                      />
                    )}
                  </MaterialSection>
                </Section>
              )}

              {sub.contentType === "assignment" && (
                <Section
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "2rem",
                  }}
                  onClick={() => handleSectionClick(sub)}
                >
                  <Icon
                    src={Assignment}
                    alt="assignment icon"
                    style={{
                      width: "4.3vh",
                      height: "50%",
                      marginLeft: "1rem",
                      marginRight: "1rem",
                    }}
                  />
                  <MaterialSection
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "baseline",
                    }}
                  >
                    <span
                      style={{
                        flexShrink: 1,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        marginRight: "0.8rem",
                      }}
                    >
                      {sub.title ?? "과제 없음"}
                    </span>
                    <span
                      style={{
                        color: "var(--main-color)",
                        marginTop: "0.3rem",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      {formatDate(sub?.startDate)} ~ {formatDate(sub?.endDate)}
                    </span>
                    {!isCreator && (
                      <img
                        src={sub.checked ? DoneIcon : UndoneIcon}
                        alt="submission status"
                        style={{ marginLeft: "auto", width: "1.2rem" }}
                      />
                    )}
                  </MaterialSection>
                </Section>
              )}
            </div>
          </div>
        ))}
      </main>
      {isCreator && (
        <EditButton
          to={`/class/${courseId}/curriculum/${activeLectureId}/edit`}
          edit={true}
        />
      )}
    </div>
  );
};

export default Curriculum;
