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
import UnselectedSection from "../../img/class/check/sel_sec.svg";
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
`;

const CurriculumTitle = styled.h3`
  font-size: 1.65rem;
  font-weight: 900;
  margin-bottom: -0.3rem;
  margin-top: 0.5rem;
  letter-spacing: -1px;
`;

const VideoContainer = styled.div`
  position: relative;
  width: 14.5rem;
  border-radius: 8px;
`;

const VideoThumbnail = styled.img`
  width: 100%;
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
  width: 1.4rem;
  height: 1.4rem;
`;

const SectionIcon = styled.img`
  margin-left: auto;
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
  const location = useLocation();
  const entrycode = location.state?.entrycode || null;
  const [isEntryCodeModalOpen, setIsEntryCodeModalOpen] = useState(false);

  const { courseId, lectureId } = useParams();

  const { user } = useContext(UsersContext);
  const userId = user.userId;
  const { courseData, isCreator } = useOutletContext();
  const [curriculumData, setCurriculumData] = useState([]);
  const [historyData, setHistoryData] = useState({
    materials: [],
    submissions: [],
  });
  const [activeLectureId, setActiveLectureId] = useState(
    Number(lectureId) || 1
  );
  const [activeLecture, setActiveLecture] = useState(null);

  useEffect(() => {
    if (entrycode) setIsEntryCodeModalOpen(true);
  }, []);

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
          const lectures = curriculumRes.data.data || [];
          setCurriculumData(lectures);

          const defaultLecture =
            lectures.find((lec) => lec.lectureId === Number(lectureId)) ||
            lectures[0];

          setActiveLectureId(defaultLecture.lectureId);

          setActiveLecture({
            ...defaultLecture,
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

    setActiveLecture((prev) => ({
      ...prev,
      subSections: prev.subSections.map((sub) => ({
        ...sub,
        checked:
          sub.contentType === "material"
            ? historyData.materials.some(
                (m) => m.materialId === sub.id && m.materialHistoryStatus
              )
            : sub.contentType === "assignment"
            ? historyData.submissions.some(
                (a) =>
                  a.assignmentId === sub.id &&
                  a.submissionStatus === "SUBMITTED"
              )
            : false,
      })),
    }));
  }, [historyData]);

  const handleMaterialClick = async (material) => {
    const materialUrl = material.materialFile;

    try {
      const response = await api.get("/files/download", {
        params: {
          fileUrl: materialUrl,
        },
      });

      const presignedUrl = response.data;
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

  return (
    <div style={{ display: "flex", marginTop: "1rem" }}>
      <CurriculumSidebar
        sections={curriculumData}
        activeItem={activeLectureId}
        setActiveItem={setActiveLectureId}
        edit={false}
      />
      <main
        style={{
          flex: 1,
          padding: "2rem",
          borderRadius: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <h1
            style={{
              fontSize: "2.3rem",
              fontWeight: "bold",
              color: "var(--main-color)",
              margin: "0",
              marginBottom: "-0.2rem",
            }}
          >
            {activeLecture?.lectureTitle}
          </h1>

          <p
            style={{
              color: "#969696",
              fontSize: "1.2rem",
              marginLeft: "1rem",
              fontWeight: "540",
              margin: "0 1rem",
            }}
          >
            {formatLecturePeriod(activeLecture?.startDate)} ~{" "}
            {formatLecturePeriod(activeLecture?.endDate)}
          </p>
        </div>

        <Section
          style={{
            backgroundColor: "var(--pink-color)",
            padding: "0.15rem 1.5rem",
          }}
        >
          <h1 style={{ fontSize: "1.6rem", fontWeight: "bolder" }}>
            {activeLecture?.lectureDescription}
          </h1>
          <SectionIcon
            src={SelectedSection}
            style={{
              marginLeft: "auto",
              marginRight: "1.35rem",
              width: "1.8rem",
            }}
          />
        </Section>

        {activeLecture?.subSections.map((sub) => (
          <div key={sub.id}>
            <div>
              {sub.contentType === "video" && (
                <Section
                  style={{ display: "flex" }}
                  to={`/playing/${courseId}/${activeLectureId}/${sub.videoId}`}
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
                    <Icon
                      src={PlayIcon}
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "1.8rem",
                        height: "auto",
                        cursor: "pointer",
                      }}
                    />
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
                    <p
                      style={{
                        fontSize: "1.08rem",
                        color: "#909090",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <span>{activeLecture.instructorName}</span>
                      <span
                        style={{
                          borderLeft: "1.5px solid #909090",
                          height: "1rem",
                        }}
                      ></span>
                      <span>
                        {formatDate(sub?.startDate)} ~{" "}
                        {formatDate(sub?.endDate)}
                      </span>
                    </p>
                  </div>
                  <img
                    src={sub.checked ? DoneIcon : UndoneIcon}
                    style={{
                      marginLeft: "auto",
                      marginRight: "1.6rem",
                      width: "1.2rem",
                    }}
                  />
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
                  <img
                    src={Material}
                    style={{
                      width: "2.4rem",
                      height: "50%",
                      marginLeft: "1rem",
                      marginRight: "1rem",
                    }}
                  />
                  <MaterialSection>
                    <span
                      style={{ marginRight: "0.6rem", cursor: "pointer" }}
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
                    <img
                      src={sub.checked ? DoneIcon : UndoneIcon}
                      alt="download status"
                      style={{ marginLeft: "auto", width: "1.2rem" }}
                    />
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
                  to={`/assignment/submit/${courseId}/${activeLectureId}/${sub.assignmentId}`}
                >
                  <img
                    src={Assignment}
                    alt="assignment icon"
                    style={{
                      width: "2.4rem",
                      height: "50%",
                      marginLeft: "1rem",
                      marginRight: "1rem",
                    }}
                  />
                  <MaterialSection>
                    <span style={{ marginRight: "0.8rem" }}>{sub.title}</span>
                    <span
                      style={{
                        color: "var(--main-color)",
                      }}
                    >
                      {formatDate(sub?.startDate)} ~ {formatDate(sub?.endDate)}
                    </span>
                    <img
                      src={sub.checked ? DoneIcon : UndoneIcon}
                      alt="submission status"
                      style={{ marginLeft: "auto", width: "1.2rem" }}
                    />
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

      {isEntryCodeModalOpen && (
        <Modal
          entrycode={entrycode}
          onClose={() => setIsEntryCodeModalOpen(false)}
        />
      )}
    </div>
  );
};

function Modal({ entrycode, onClose }) {
  return (
    <ModalBackdrop>
      <ModalWrapper>
        <Close
          onClick={onClose}
          style={{ alignSelf: "flex-end", cursor: "pointer" }}
        />
        <ModalContent>
          <img src={LogoSymbol} alt="LogoSymbol" width="60" height="60" />
          <ModalText style={{ marginTop: "10px" }}>
            강의실이 개설되었습니다!
          </ModalText>
          <ModalSmallText>내 강의실 코드</ModalSmallText>
          <ModalText>{entrycode}</ModalText>
          <CloseButton onClick={onClose}>수강생 초대하기</CloseButton>
        </ModalContent>
      </ModalWrapper>
    </ModalBackdrop>
  );
}
const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalWrapper = styled.div`
  background: white;
  padding: 20px;
  border-radius: 20px;
  text-align: center;
  width: 494px;
  height: 283px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
`;

const ModalContent = styled.div``;

const ModalText = styled.div`
  font-size: 25px;
  font-weight: bold;
`;

const ModalSmallText = styled.div`
  font-size: 10px;
  margin-top: 20px;
`;

const CloseButton = styled.button`
  background: #ff4747;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 25px;
  cursor: pointer;
  font-size: 13px;
  margin-top: 20px;
`;

export default Curriculum;
