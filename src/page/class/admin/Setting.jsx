import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import styled from "styled-components";
import api from "../../../api/api.js";
import { UsersContext } from "../../../contexts/usersContext.jsx";
import EntryCodeCopyModal from "../../../component/class/EntryCodeCopyModal.jsx";

export default function Setting() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { user } = useContext(UsersContext);
  const { courseData } = useOutletContext();
  const timeSlots = ["월", "화", "수", "목", "금", "토", "일"];
  const [isAssignmentPending, setIsAssignmentPending] = useState(false);
  const [isLecturePending, setIsLecturePending] = useState(false);
  const [showDifficultyChange, setShowDifficultyChange] = useState("");
  const [showPublicChange, setShowPublicChange] = useState("");
  const [copyModalOpen, setCopyModalOpen] = useState(false);

  const [form, setForm] = useState({
    coursename: "",
    instructor: "",
    entrycode: "",
    startDate: null,
    durationWeeks: 1,
    lectureDays: [],
    lectureTime: "",
    assignmentDays: [],
    assignmentTime: "",
    difficulty: "easy",
    isAssignmentPublic: true,
  });
  let [titleInputCount, setTitleInputCount] = useState(form.coursename.length);
  let [instructorInputCount, setInstructorInputCount] = useState(
    form.instructor.length,
  );

  useEffect(() => {
    setTitleInputCount(form.coursename.length);
  }, [form.coursename]);

  const onTitleInputHandler = (e) => {
    setTitleInputCount(e.target.value.length);
  };

  useEffect(() => {
    setInstructorInputCount(form.instructor.length);
  }, [form.instructor]);

  const onInstructorInputHandler = (e) => {
    setInstructorInputCount(e.target.value.length);
  };

  useEffect(() => {
    if (courseData) {
      setForm({
        coursename: courseData.courseTitle,
        instructor: courseData.instructorName,
        entrycode: courseData.entryCode,
        startDate: courseData.startDate,
        durationWeeks: courseData.durationWeeks,
        lectureDays: courseData.lectureDay
          ? courseData.lectureDay.split(",").map(Number)
          : [],
        lectureTime: courseData.lectureTime?.slice(0, -3),
        assignmentDays: courseData.assignmentDueDay
          ? courseData.assignmentDueDay.split(",").map(Number)
          : [],
        assignmentTime: courseData.assignmentDueTime?.slice(0, -3),
        difficulty: courseData.difficultyLevel?.toLowerCase(),
        isAssignmentPublic: courseData.isAssignmentPublic,
      });

      setIsAssignmentPending(
        !courseData.assignmentDueDay || courseData.assignmentDueTime === "",
      );
      setIsLecturePending(
        !courseData.lectureDay || courseData.lectureTime === "",
      );
    }
  }, [courseData]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCopy = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopyModalOpen(true);
      })
      .catch((err) => {
        console.error("복사 중 오류가 발생했습니다:", err);
      });
  };

  const formatTimeWithMeridiem = (timeString) => {
    if (!timeString) return "";

    const [hours, minutes] = timeString.split(":");
    const hourNum = parseInt(hours, 10);

    if (hourNum === 0) return "오전 12:" + minutes;
    if (hourNum === 12) return "오후 12:" + minutes;

    if (hourNum < 12) {
      return `오전 ${String(hourNum).padStart(2, "0")}:${minutes}`;
    } else {
      return `오후 ${String(hourNum - 12).padStart(2, "0")}:${minutes}`;
    }
  };

  const handleDifficultySelect = (newLevel) => {
    if (form.difficulty !== newLevel) {
      const difficultyText = {
        easy: "쉬움",
        medium: "보통",
        hard: "어려움",
      };
      setShowDifficultyChange(
        `난이도를 ${difficultyText[newLevel]}으로 변경했어요!`,
      );
    }
    setForm((prev) => ({ ...prev, difficulty: newLevel }));
  };

  const handleAssignmentVisibility = (isPublic) => {
    if (form.isAssignmentPublic !== isPublic) {
      if (isPublic)
        setShowPublicChange(
          '강의실 관리 메뉴의 "요약 보기"와 "학생별 보기" 페이지가 수강생에게 표시됩니다.',
        );
      else
        setShowPublicChange(
          '강의실 관리 메뉴의 "요약 보기"와 "학생별 보기" 페이지가 수강생에게 표시되지 않습니다.',
        );
    }
    setForm((prev) => ({ ...prev, isAssignmentPublic: isPublic }));
  };

  const handleSubmit = async () => {
    try {
      if (!user) {
        console.log("사용자 정보가 없습니다");
        return;
      }

      const settingData = {
        title: form.coursename,
        instructorName: form.instructor,
        startDate: form.startDate,
        durationWeeks: Number(form.durationWeeks),
        lectureDay: form.lectureDays,
        lectureTime: isLecturePending ? null : form.lectureTime + ":00",
        assignmentDueDay: form.assignmentDays,
        assignmentDueTime: isAssignmentPending
          ? null
          : form.assignmentTime + ":00",
        difficultyLevel: form.difficulty.toUpperCase(),
        isAssignmentPublic: form.isAssignmentPublic,
      };

      console.log(settingData);

      const settingResponse = await api.put(
        `/courses/${courseId}/${user.userId}/setting`,
        settingData,
      );

      if (settingResponse.data.success) {
        console.log(settingResponse.data);
        //navigate(`/class/${courseId}/overview/info`);
        window.location.reload();
      } else {
        throw new Error("강의실 내용 수정에 실패했습니다");
      }
    } catch (error) {
      console.error("Failed to update course setting:", error);
    }
  };

  return (
    <main
      style={{
        flex: 1,
        borderRadius: "8px",
      }}
    >
      <div style={{ margin: "1vh 0vh" }}>
        <Container>
          <Section>
            <Title style={{ marginTop: "6px" }}>
              STEP 1. 강의실을 만들어볼까요?
            </Title>

            <FormGroup>
              <FormItem>
                <Label>
                  강의명
                  <Required>*</Required>
                  <Text>{titleInputCount}</Text>
                  <Text>/30 자</Text>
                </Label>
                <FormInput
                  type="text"
                  name="coursename"
                  maxlength="30"
                  value={form.coursename}
                  onChange={(e) => {
                    handleFormChange(e);
                    onTitleInputHandler(e);
                  }}
                  style={{ width: "100%" }}
                  autoComplete="off"
                />
              </FormItem>

              <FormItem>
                <Label>
                  강의자명
                  <Required>*</Required>
                  <Text>{instructorInputCount}</Text>
                  <Text>/5 자</Text>
                </Label>
                <FormInput
                  type="text"
                  name="instructor"
                  maxlength="5"
                  placeholder="ex. 김잇다"
                  value={form.instructor}
                  onChange={(e) => {
                    handleFormChange(e);
                    onInstructorInputHandler(e);
                  }}
                  style={{ width: "100%" }}
                  autoComplete="off"
                />
              </FormItem>

              <FormItem>
                <Label>강의코드</Label>
                <CopyGrop>
                  <CodeInput
                    value={form.entrycode}
                    disabled
                    style={{ marginRight: "10px", color: "#FF4747" }}
                  />
                  <RadioButton
                    active={true}
                    onClick={() => handleCopy(form.entrycode)}
                  >
                    복사하기
                  </RadioButton>
                </CopyGrop>
              </FormItem>
            </FormGroup>
          </Section>

          <Section>
            <Title>STEP 2. 수강생이 얼마나 강의를 들어야 하나요?</Title>

            <FormGroup>
              <HalfGroup>
                <FormHalfItem>
                  <Label>
                    커리큘럼 시작
                    <Required>*</Required>
                  </Label>
                  <DisableInput
                    value={new Date(form.startDate).toLocaleDateString()}
                    disabled
                    style={{ width: "100%" }}
                  />
                </FormHalfItem>

                <FormHalfItem>
                  <Label>
                    커리큘럼 주차
                    <Required>*</Required>
                  </Label>
                  <CuliculumGroup>
                    <DisableInput
                      value={form.durationWeeks}
                      disabled
                      style={{ width: "100%" }}
                    />
                    <Label style={{ marginTop: "0px", marginLeft: "5px" }}>
                      주
                    </Label>
                  </CuliculumGroup>
                </FormHalfItem>
              </HalfGroup>

              <FormItem>
                <Label>강의 업로드 일시</Label>
                <HalfGroup>
                  <TimeGroup>
                    <DayButtonGroup>
                      {timeSlots.map((day) => (
                        <DayButton
                          key={day}
                          active={form.lectureDays?.includes(
                            timeSlots.indexOf(day) + 1,
                          )}
                        >
                          {day}
                        </DayButton>
                      ))}
                    </DayButtonGroup>
                  </TimeGroup>

                  <TimeGroup>
                    <DisableInput
                      name="lectureTime"
                      style={{ width: "100%" }}
                      value={
                        isLecturePending
                          ? ""
                          : formatTimeWithMeridiem(form.lectureTime)
                      }
                      active={isLecturePending}
                      disabled
                    />
                  </TimeGroup>

                  <TimeGroup>
                    <PendingButton active={isLecturePending}>
                      정해지지 않았어요
                    </PendingButton>
                  </TimeGroup>
                </HalfGroup>
                <GreyHelpText style={{ marginTop: "10px" }}>
                  {isLecturePending ? (
                    "자유롭게 설정합니다."
                  ) : (
                    <>
                      매주{" "}
                      {form.lectureDays
                        ?.map((day) => timeSlots[day - 1])
                        .join("요일, ")}
                      요일 {form.lectureTime} 강의를 진행합니다.
                    </>
                  )}
                </GreyHelpText>
              </FormItem>

              <FormItem>
                <Label>과제 마감 일시</Label>
                <HalfGroup>
                  <TimeGroup>
                    <DayButtonGroup>
                      {timeSlots.map((day) => (
                        <DayButton
                          key={day}
                          active={form.assignmentDays?.includes(
                            timeSlots.indexOf(day) + 1,
                          )}
                        >
                          {day}
                        </DayButton>
                      ))}
                    </DayButtonGroup>
                  </TimeGroup>

                  <TimeGroup>
                    <DisableInput
                      name="assignmentTime"
                      style={{ width: "100%" }}
                      value={
                        isAssignmentPending
                          ? ""
                          : formatTimeWithMeridiem(form.assignmentTime)
                      }
                      active={isAssignmentPending}
                      disabled
                    />
                  </TimeGroup>

                  <TimeGroup>
                    <PendingButton active={isAssignmentPending}>
                      정해지지 않았어요
                    </PendingButton>
                  </TimeGroup>
                </HalfGroup>
                <GreyHelpText style={{ marginTop: "10px" }}>
                  {isAssignmentPending ? (
                    "자유롭게 설정합니다."
                  ) : (
                    <>
                      매주{" "}
                      {form.assignmentDays
                        ?.map((day) => timeSlots[day - 1])
                        .join("요일, ")}
                      요일 {form.assignmentTime} 강의를 진행합니다.
                    </>
                  )}
                </GreyHelpText>
              </FormItem>
            </FormGroup>
          </Section>

          <Section style={{ borderBottom: "none" }}>
            <Title>STEP 3. 수강생에게 강좌를 어떻게 공개하실 건가요?</Title>
            <FormGroup>
              <FormItem>
                <RowContainer>
                  <Label style={{ marginRight: "50px" }}>
                    수업 난이도<Required>*</Required>
                  </Label>
                  <ButtonGroup>
                    {["easy", "medium", "hard"].map((level) => (
                      <LevelButton
                        key={level}
                        active={form.difficulty === level}
                        onClick={() => handleDifficultySelect(level)}
                      >
                        {level === "easy"
                          ? "쉬움"
                          : level === "medium"
                            ? "보통"
                            : "어려움"}
                      </LevelButton>
                    ))}
                  </ButtonGroup>
                </RowContainer>
                <LevelText>
                  {showDifficultyChange ? (
                    <GreyHelpText>{showDifficultyChange}</GreyHelpText>
                  ) : (
                    <>
                      {form.difficulty === "easy" && (
                        <GreyHelpText>
                          입문자를 위한 쉬운 개념 강의!
                        </GreyHelpText>
                      )}
                      {form.difficulty === "medium" && (
                        <GreyHelpText>
                          개념을 응용하고 실전 활용 능력을 키우는 강의!
                        </GreyHelpText>
                      )}
                      {form.difficulty === "hard" && (
                        <GreyHelpText>
                          실무에 적용할 수 있는 전문 강의!
                        </GreyHelpText>
                      )}
                    </>
                  )}
                </LevelText>
              </FormItem>
            </FormGroup>

            <FormGroup>
              <FormItem>
                <RowContainer>
                  <Label style={{ marginRight: "50px" }}>
                    수강생 간 과제 제출<Required>*</Required>
                  </Label>
                  <ButtonGroup>
                    {["open", "close"].map((option) => (
                      <LevelButton
                        key={option}
                        active={form.isAssignmentPublic === (option === "open")}
                        onClick={() =>
                          handleAssignmentVisibility(option === "open")
                        }
                      >
                        {option === "open" ? "공개" : "비공개"}
                      </LevelButton>
                    ))}
                  </ButtonGroup>
                </RowContainer>
                <LevelText>
                  {showPublicChange ? (
                    <GreyHelpText>{showPublicChange}</GreyHelpText>
                  ) : (
                    <>
                      {form.isAssignmentPublic && (
                        <GreyHelpText
                          style={{ color: "var(--guide-gray-color)" }}
                        >
                          수강생들이 서로 제출한 과제를 볼 수 있어요.
                        </GreyHelpText>
                      )}
                      {!form.isAssignmentPublic && (
                        <GreyHelpText
                          style={{ color: "var(--guide-gray-color)" }}
                        >
                          수강생들은 자신이 제출한 과제만 볼 수 있어요.
                        </GreyHelpText>
                      )}
                    </>
                  )}
                </LevelText>
              </FormItem>
            </FormGroup>
          </Section>
          <CreateButton onClick={handleSubmit}>
            강의실 업데이트하기
          </CreateButton>

          {copyModalOpen && (
            <EntryCodeCopyModal
              entrycode={form.entrycode}
              onClose={() => setCopyModalOpen(false)}
            />
          )}
        </Container>
      </div>
    </main>
  );
}

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const RadioButton = styled.button`
  padding: 8px 20px;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  background-color: #ff4747;
  color: #ffffff;
  cursor: pointer;
`;

const PendingButton = styled.button`
  padding: 8px 20px;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  background-color: ${(props) => (props.active ? "#C3C3C3" : "#F4F4F4")};
  color: #909090;

  @media (max-width: 900px) {
    width: 100%;
  }
`;

const LevelButton = styled.button`
  border: none;
  border-radius: 10px;
  font-size: 15px;
  background-color: ${(props) => (props.active ? "#FF4747" : "#EEEEEE ")};
  color: ${(props) => (props.active ? "#FFFFFF" : "#909090")};
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  margin-bottom: 8px;

  @media (max-width: 900px) {
    padding: 6px 12px;
  }
`;

const CreateButton = styled.button`
  border: none;
  cursor: pointer;
  width: 100%;
  padding: 12px 0;
  background-color: #ff4747;
  color: white;
  font-size: 17px;
  font-weight: 400;
  border-radius: 10px;
`;

const Container = styled.div`
  padding: 24px 30px;
  background-color: white;
  border-radius: 12px;
  margin-top: 1.5rem;
`;

const Section = styled.div`
  width: 100%;
  padding-bottom: 30px;
  border-bottom: 2px solid #c3c3c3;
`;

const Title = styled.div`
  font-size: 21px;
  font-weight: 700;
  margin-top: 30px;

  @media all and (max-width: 479px) {
    font-size: 18px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormItem = styled.div`
  margin-bottom: 15px;
  width: 100%;
`;

const RowContainer = styled.div`
  display: flex;
  align-items: baseline;

  @media (max-width: 800px) {
    flex-direction: column;
    padding: 6px 10px;
  }
`;

const LevelText = styled.div`
  margin-left: 150px;

  @media (max-width: 800px) {
    margin-left: 0px;
  }
`;

const FormHalfItem = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 8px;
  color: #000000;
  font-size: 17px;
  font-weight: 500;
  margin-top: 20px;
  align-items: flex-end;
`;

const Required = styled.span`
  position: relative;
  color: #ff4747;
  font-weight: 800;
  top: -5px;
  left: 0px;
  margin-right: 5px;
`;

const FormInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  font-size: 13px;
  padding: 10px 12px;
  border: 2px solid #c3c3c3;
  border-radius: 10px;
`;

const DisableInput = styled.input`
  box-sizing: border-box;
  font-size: 13px;
  font-weight: 500;
  padding: 10px 12px;
  color: #767676;
  background-color: #c3c3c3;
  background-color: ${(props) => (props.active ? "#F4F4F4" : "#C3C3C3")};
  border: 2px solid #c3c3c3;
  border-radius: 10px;
  margin-right: 10px;
`;

const CodeInput = styled.input`
  box-sizing: border-box;
  font-size: 13px;
  padding: 10px 12px;
  color: #000000;
  border: 2px solid #c3c3c3;
  border-radius: 10px;
  margin-right: 10px;

  @media all and (max-width: 479px) {
    width: 58%;
  }
`;

const GreyHelpText = styled.div`
  height: 13px;
  min-height: 13px;
  color: #909090;
  font-size: 11px;
  font-weight: 400;
  margin-top: 4px;
`;

const DayButtonGroup = styled.div`
  display: flex;
  gap: 5px;
  margin-right: 10px;
  margin-left: 10px;
`;

const DayButton = styled.button`
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: ${(props) => (props.active ? "#C3C3C3" : "#F4F4F4")};
  color: #909090;
  font-size: 16px;
`;

const TimeGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const CuliculumGroup = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
`;

const CopyGrop = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;

  @media all and (max-width: 479px) {
    font-size: 18px;
  }
`;

const HalfGroup = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const Text = styled.div`
  font-size: 13px;
  color: var(--main-color);
`;
