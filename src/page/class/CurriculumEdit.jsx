import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import TopBar from "../../component/TopBar.jsx";
import CurriculumSidebar from "../../component/class/CurriculumSidebar.jsx";
import ClassTopbar from "../../component/class/ClassTopbar.jsx";
import { PageLayout } from "../../component/class/ClassLayout.jsx";
import EditableSection from "../../component/curriculum/EditableSection.jsx";
import CurriculumSection from "../../component/curriculum/CurriculumSection.jsx";
import api from "../../api/api.js";
import EditContainer from "../../component/curriculum/EditContainer.jsx";
import { UsersContext } from "../../contexts/usersContext.jsx";
import { formatLecturePeriod } from "./Curriculum.jsx";
import EditButton from "../../component/class/EditButton.jsx";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Description, StyleOutlined } from "@mui/icons-material";

const CurriculumPage = styled.div`
  display: flex;
  width: 100%;
`;

const Curriculum = styled.div`
  flex: 1;
  padding: 3.5vh;
  border-radius: 8px;

  @media (max-width: 1024px) {
    padding: 3.25vh;
  }

  @media (max-width: 768px) {
    padding: 3vh;
  }

  @media (max-width: 480px) {
    padding: 3vh 1vh;
  }
`;

const SectionWrapper = styled.div`
  display: flex;
  position: relative;
  width: 100%;
`;

const Section = styled.div`
  display: flex;
  padding: 1.3rem 1.5rem;
  border-radius: 12px;
  margin: 1rem 0rem;
  background-color: #ffffff;
  cursor: pointer;
  position: relative;
  ${({ isEditing }) =>
    isEditing &&
    `
    padding-bottom: 8.5rem;
  `}
`;

const LectureSection = styled.div`
  display: flex;
  border-radius: 14px;
  cursor: pointer;
  position: relative;
  align-items: flex-end;
  background-color: var(--main-color);
  padding: 2vh 2.5vh;

  ${({ isEditing }) =>
    isEditing &&
    `
    padding-bottom: 8.5rem;
  `}
  @media (max-width: 1024px) {
    padding: 1vh 1.5vh;
    margin-bottom: 1vh;
    border-radius: 11px;
  }

  @media (max-width: 768px) {
    padding: 1vh 1.5vh;
    margin-bottom: 1vh;
    border-radius: 9px;
  }

  @media (max-width: 480px) {
    padding: 1.8vh 3vh;
    border-radius: 8px;
  }
  @media (max-width: 376px) {
    padding: 1.2vh 2vh;
    border-radius: 7px;
  }
`;

const LectureTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: var(--white-color);
  margin: 0;
  margin-bottom: -0.2rem;

  @media (max-width: 1024px) {
    font-size: 24px;
  }
  @media (max-width: 768px) {
    font-size: 21px;
  }
  @media (max-width: 480px) {
    font-size: 18px;
    font-weight: 650;
  }
  @media (max-width: 376px) {
    font-size: 17px;
  }
`;

const LectureDescriptionSection = styled.div`
  display: flex;
  border-radius: 14px;
  margin: 1.15rem 0rem;
  cursor: pointer;
  position: relative;
  background-color: var(--grey-color);
  padding: 2vh 2.5vh;
  ${({ isEditing }) =>
    isEditing &&
    `
    padding-bottom: 8.5rem;
  `}

  @media (max-width: 1024px) {
    padding: 1.5vh 1.7vh;
  }

  @media (max-width: 768px) {
    border-radius: 9px;
  }

  @media (max-width: 480px) {
    padding: 1.7vh 2vh;
    margin: 2vh 0vh;
    border-radius: 7px;
    box-sizing: border-box;
  }

  @media (max-width: 376px) {
    margin: 2.3vh 0vh;
  }
`;

const EditingDescription = styled.input`
  font-size: 21px;
  font-weight: 650;
  letter-spacing: -1px;
  width: 100%;
  background-color: white;
  border: 1.5px solid var(--darkgrey-color);
  border-radius: 8px;
  outline: none;
  padding: 1.5vh 2vh;
  margin: 1.5vh 0vh;

  @media (max-width: 1024px) {
    font-size: 19px;
    padding: 0.8vh 1vh;
    margin: 0.8vh 0vh;
  }

  @media (max-width: 768px) {
    font-size: 17px;
  }

  @media (max-width: 376px) {
    font-size: 15px;
    border: 1.3px solid var(--darkgrey-color);
    border-radius: 6px;
    font-weight: 600;
    padding: 1vh 1vh;
  }
`;

const LectureDescription = styled.span`
  font-size: 21px;
  font-weight: 700;

  @media (max-width: 1024px) {
    font-size: 19px;
  }

  @media (max-width: 768px) {
    font-size: 17px;
    font-weight: 670;
  }
  @media (max-width: 480px) {
    font-size: 14px;
    font-weight: 600;
  }
  @media (max-width: 376px) {
    font-size: 12px;
  }
`;

export const toLocalDateTime = (isoString) => {
  if (!isoString) return null;
  return isoString.replace("T", " ") + ":00";
};

const CurriculumEdit = () => {
  const { courseId, lectureId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UsersContext);
  const userId = user.userId;
  const [curriculumData, setCurriculumData] = useState([]);
  const [activeLectureId, setActiveLectureId] = useState(lectureId);
  const [activeLecture, setActiveLecture] = useState(null);
  const [subSections, setSubSections] = useState(
    activeLecture?.subSections || [],
  );
  const [editTarget, setEditTarget] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [lectureDescription, setLectureDescription] = useState(
    activeLecture?.lectureDescription || "",
  );
  const [movedItem, setMovedItem] = useState(null);

  const activeLectureRef = useRef(null);
  useEffect(() => {
    activeLectureRef.current = activeLecture;
  }, [activeLecture]);

  const fetchCurriculum = useCallback(
    async (newSectionId = null) => {
      if (!userId) return;
      try {
        const response = await api.get(
          `/lectures/curriculum/${courseId}/${userId}`,
        );
        if (!response.data || !response.data.success) {
          console.error("API 요청 실패:", response.data);
          return;
        }
        const { curriculumResponses, instructorName } =
          response.data.data || {};

        const lectures = curriculumResponses || [];
        setCurriculumData(lectures);

        const defaultLecture =
          lectures.find((lec) => lec.lectureId === parseInt(lectureId)) ||
          lectures[0];

        const sortedSubSections = [
          ...(defaultLecture.videos || []).map((v) => ({
            ...v,
            title: v.videoTitle,
            isEditing: false,
          })),
          ...(defaultLecture.materials || []).map((m) => ({
            ...m,
            title: m.originalFilename,
            isEditing: false,
          })),
          ...(defaultLecture.assignments || []).map((a) => ({
            ...a,
            title: a.assignmentTitle,
            isEditing: false,
          })),
        ].sort(
          (a, b) => (a.contentOrderIndex || 0) - (b.contentOrderIndex || 0),
        );

        const editingSectionId =
          newSectionId || sessionStorage.getItem("editingSectionId");

        setActiveLecture({
          ...defaultLecture,
          instructorName,
          subSections: sortedSubSections.map((s) =>
            newSectionId && String(s.contentOrderId) === String(newSectionId)
              ? { ...s, isEditing: true }
              : { ...s, isEditing: false },
          ),
        });

        // 설정 후 sessionStorage 값 제거
        sessionStorage.removeItem("editingSectionId");

        setSubSections(sortedSubSections);
        setActiveLectureId(defaultLecture.lectureId);
      } catch (error) {
        console.error("커리큘럼 불러오기 실패:", error);
      }
    },
    [courseId, lectureId, userId],
  );

  useEffect(() => {
    fetchCurriculum();
  }, [fetchCurriculum]);

  // 챕터 설명 수정
  const handleDescriptionClick = (event) => {
    event.stopPropagation();
    setIsEditingDescription(true);
  };

  // 드래그 시작 시 이동할 아이템을 고정
  const handleDragStart = (start) => {
    const draggedItem = subSections.find(
      (item) => item.contentOrderId === start.draggableId,
    );
    if (draggedItem) {
      setMovedItem(draggedItem);
    }
    setIsDragging(true);
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) {
      return;
    }
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    const tempSubSections = [...subSections];

    const [movedItem] = tempSubSections.splice(sourceIndex, 1);

    tempSubSections.splice(destinationIndex, 0, movedItem);

    let targetItem = null;

    if (destinationIndex > sourceIndex) {
      // 아래로 이동하는 경우
      targetItem =
        destinationIndex > 0 ? tempSubSections[destinationIndex - 1] : null;
    } else {
      // 위로 이동하는 경우
      targetItem =
        destinationIndex < tempSubSections.length - 1
          ? tempSubSections[destinationIndex + 1]
          : null;
    }

    const contentOrderId = movedItem.contentOrderId;
    const targetContentOrderId = targetItem ? targetItem.contentOrderId : null;

    try {
      await api.put(`/contentorders/${courseId}/${activeLectureId}/reorder`, {
        contentOrderId,
        targetContentOrderId,
      });

      setIsDragging(false);

      setTimeout(() => {
        setIsDragging(false);
        location.reload();
      }, 1000);
    } catch (error) {
      console.error(error);
      setIsDragging(false);
    }
  };

  // 섹션 추가
  const handleAdd = async (type) => {
    if (!activeLecture) return;

    try {
      let url = "";

      if (type === "video") {
        url = `/videos/${courseId}/${activeLectureId}/${userId}`;
      } else if (type === "material") {
        url = `/materials/${courseId}/${activeLectureId}/${userId}`;
      } else if (type === "assignment") {
        url = `/assignments/${courseId}/${activeLectureId}/${userId}`;
      }

      // 기존 편집 중이던 섹션을 모두 isEditing: false로 변경
      setActiveLecture((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          subSections: prev.subSections.map((s) => ({
            ...s,
            isEditing: false,
          })),
        };
      });

      // 새 섹션 추가 요청
      const response = await api.post(url);

      if (response.data && response.data.success) {
        const newSectionId = String(response.data.data.contentOrderId);

        sessionStorage.setItem("editingSectionId", newSectionId);
        await fetchCurriculum(newSectionId);

        setActiveLecture((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            subSections: prev.subSections.map((s) =>
              String(s.contentOrderId) === newSectionId
                ? { ...s, isEditing: true }
                : { ...s, isEditing: false },
            ),
          };
        });
      }
    } catch (error) {
      console.error("추가 실패:", error);
    }
  };

  // 섹션 삭제
  const handleDelete = async (event, index) => {
    if (event) event.stopPropagation();
    if (!activeLecture) return;

    if (activeLecture.subSections.length === 1) {
      alert("최소 하나의 섹션은 유지해야 합니다.");
      return;
    }

    const subSection = activeLecture.subSections[index];
    let url = "";

    if (subSection.contentType === "video") {
      url = `/videos/${courseId}/${subSection.videoId}/${userId}`;
    } else if (subSection.contentType === "material") {
      url = `/materials/${courseId}/${subSection.materialId}/${userId}`;
    } else if (subSection.contentType === "assignment") {
      url = `/assignments/${courseId}/${subSection.assignmentId}/${userId}`;
    }

    try {
      await api.delete(url);
      location.reload();
    } catch (error) {
      console.error("삭제 실패:", error);
    }
  };

  // 섹션 클릭 -> isEditing 상태 변경 (true, false)
  const handleSectionClick = async (index, event) => {
    event.stopPropagation();

    const excludedTags = ["INPUT", "TEXTAREA", "BUTTON", "SELECT", "LABEL"];
    if (excludedTags.includes(event.target.tagName)) {
      return;
    }

    if (event.target.closest(".datetime-edit")) {
      return;
    }

    const clickedSectionId = String(
      activeLecture?.subSections[index]?.contentOrderId,
    );

    // 현재 편집 중이던 섹션 저장
    const editingSection = activeLecture?.subSections.find((s) => s.isEditing);

    if (editingSection) {
      // 수정 사항 저장 요청
      try {
        await api.patch(
          `/contentorders/${courseId}/${activeLectureId}/${userId}`,
          {
            contentOrderId: editingSection.contentOrderId,
            updatedData: editingSection,
          },
        );
      } catch (error) {
        console.error("수정사항 저장 실패:", error);
      }
    }

    // `sessionStorage`에 클릭한 섹션 ID 저장
    sessionStorage.setItem("editingSectionId", clickedSectionId);

    // 현재 아무것도 편집 중이 아니었으면 새로고침 없이 바로 상태 업데이트
    if (!editingSection) {
      setActiveLecture((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          subSections: prev.subSections.map((s) =>
            String(s.contentOrderId) === clickedSectionId
              ? { ...s, isEditing: true }
              : s,
          ),
        };
      });
    } else {
      // 🔹 기존 편집 중인 섹션이 있었다면 fetchCurriculum 호출 (기존 상태 반영)
      await fetchCurriculum(clickedSectionId);
    }
  };

  // 섹션 외 다른 부분 클릭 시
  useEffect(() => {
    const handleClickOutside = async (event) => {
      if (isDragging) return;

      const lectureDescriptionElement = document.querySelector(
        ".lecture-description-edit",
      );

      if (lectureDescriptionElement?.contains(event.target)) {
        setIsEditingDescription(true);
        return;
      }

      if (
        event.target.closest(".editable-section") ||
        event.target.closest(".file-upload")
      ) {
        return;
      }

      const editingSection = activeLectureRef.current?.subSections.find(
        (s) => s.isEditing,
      );

      if (editingSection) {
        if (!editingSection.startDate || !editingSection.endDate) {
          // alert("시작일 또는 종료일이 입력되지 않았습니다.\n모든 날짜 항목을 입력해주시기 바랍니다.");
          return;
        }
      }

      if (isEditingDescription) {
        try {
          const response = await api.patch(
            `/lectures/${courseId}/${activeLectureId}/${userId}`,
            {
              lectureTitle: activeLecture.lectureTitle,
              lectureDescription: lectureDescription,
              startDate: activeLecture.startDate,
              endDate: activeLecture.endDate,
            },
          );

          if (response.data.success) {
            setLectureDescription(lectureDescription);
            setIsEditingDescription(false);
          } else {
            console.error("강의 설명 수정 실패:", response.data.message);
          }
        } catch (error) {
          console.error("강의 설명 수정 오류:", error);
        }
      }

      if (
        !event.target.closest(".editable-section") ||
        event.target.closest(".file-upload")
      ) {
        setActiveLecture((prev) => {
          if (!prev) return prev;

          const updatedSubSections = prev.subSections.map((s) => ({
            ...s,
            isEditing: false,
          }));

          return { ...prev, subSections: updatedSubSections };
        });
        location.reload();
      }
    };

    document.body.addEventListener("click", handleClickOutside);

    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, [isEditingDescription, lectureDescription, isDragging]);

  const handleSubSectionDateChange = (index, field, newDate) => {
    setActiveLecture((prev) => {
      if (!prev) return prev;

      const updatedSubSections = prev.subSections.map((s, i) =>
        i === index ? { ...s, [field]: newDate } : s,
      );

      return { ...prev, subSections: updatedSubSections };
    });
  };

  return (
    <div>
      <CurriculumPage>
        <CurriculumSidebar
          sections={curriculumData}
          activeItem={activeLectureId}
          setActiveItem={setActiveLectureId}
          edit={true}
        />

        <Curriculum>
          <LectureSection>
            <LectureTitle>
              {activeLecture?.lectureTitle ?? "제목 없음"}
            </LectureTitle>
            {/*
            <LecturePeriod>
              {formatLecturePeriod(activeLecture?.startDate)} ~{" "}
              {formatLecturePeriod(activeLecture?.endDate)}
            </LecturePeriod> */}
          </LectureSection>

          <LectureDescriptionSection
            className="lecture-description-edit"
            onClick={handleDescriptionClick}
          >
            {isEditingDescription ? (
              <EditingDescription
                type="text"
                value={lectureDescription}
                onChange={(e) => setLectureDescription(e.target.value)}
                autoFocus
              />
            ) : (
              <LectureDescription>
                {activeLecture?.lectureDescription || "설명 없음"}
              </LectureDescription>
            )}
          </LectureDescriptionSection>

          <DragDropContext
            onDragStart={handleDragStart}
            // onDragUpdate={handleDragUpdate}
            onDragEnd={handleDragEnd}
          >
            <Droppable droppableId="curriculum">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {activeLecture?.subSections.map((subSection, index) => (
                    <Draggable
                      key={String(subSection.contentOrderId)}
                      draggableId={String(subSection.contentOrderId)}
                      index={index}
                      isDragDisabled={!subSection.isEditing}
                    >
                      {(provided) => (
                        <SectionWrapper
                          key={subSection.id}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={(event) => handleSectionClick(index, event)}
                        >
                          {subSection.isEditing && (
                            <EditContainer
                              handleAdd={handleAdd}
                              index={index}
                            />
                          )}
                          {subSection.isEditing ? (
                            <EditableSection
                              subSection={subSection}
                              index={index}
                              className="editable-section"
                              lectureStartDate={activeLecture?.startDate}
                              lectureEndDate={activeLecture?.endDate}
                              handleDelete={(event) =>
                                handleDelete(event, index)
                              }
                              onDateChange={handleSubSectionDateChange}
                            />
                          ) : (
                            <CurriculumSection
                              lecture={activeLecture}
                              subSection={subSection}
                              index={index}
                              editTarget={editTarget}
                              handleDelete={(event) =>
                                handleDelete(event, index)
                              }
                              handleSectionClick={handleSectionClick}
                              onDateChange={handleSubSectionDateChange}
                            />
                          )}
                        </SectionWrapper>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Curriculum>
      </CurriculumPage>
      <EditButton
        edit={false}
        to={`/class/${courseId}/curriculum/${activeLectureId}/`}
        lecture={activeLecture}
      />
    </div>
  );
};

export default CurriculumEdit;
