import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

function WeeklyCalendar({ currentWeek, setSelectedDate, lectures, userId }) {
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [tasks, setTasks] = useState({});

  const getWeekDates = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // 주의 첫 번째 날(일요일)로 설정
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  };

  const weekDates = getWeekDates(new Date(currentWeek));
  const days = ["일", "월", "화", "수", "목", "금", "토"];

  const getIconType = (lecture, formattedDate) => {
    const isOwnLecture = String(userId) === String(lecture.creatorId);
    if (isOwnLecture) return "MY_LECTURE";

    // 해당 날짜에 있는 과제가 SUBMITTED 상태인지 확인
    const assignmentsOnDate = (lecture.assignmentDtos || []).filter(
      (task) =>
        new Date(task.endDate).toLocaleDateString("en-CA") === formattedDate,
    );
    const allAssignmentsSubmitted = assignmentsOnDate.every(
      (task) =>
        task.submissionStatus === "SUBMITTED" ||
        task.submissionStatus === "LATE",
    );

    // 해당 날짜에 있는 자료가 활성화 상태인지 확인
    const materialsOnDate = (lecture.materialDtos || []).filter(
      (material) =>
        new Date(material.startDate).toLocaleDateString("en-CA") ===
        formattedDate,
    );
    const allMaterialsActive = materialsOnDate.every(
      (material) => material.materialHistoryStatus === true,
    );

    // 존재하는 항목들끼리만 조건을 만족하면 DONE
    if (
      (assignmentsOnDate.length === 0 || allAssignmentsSubmitted) &&
      (materialsOnDate.length === 0 || allMaterialsActive)
    ) {
      return "DONE";
    }

    return "NOT_DONE";
  };

  const getIconColor = (iconType) => {
    switch (iconType) {
      case "MY_LECTURE":
        return "var(--guide-green-color)";
      case "DONE":
        return "var(--main-color)";
      case "NOT_DONE":
        return "#DEDEDE";
      default:
        return null;
    }
  };

  useEffect(() => {
    const newTasks = weekDates.reduce((acc, date) => {
      const formattedDate = date.toLocaleDateString("en-CA");
      const dayLectures = lectures[formattedDate] || [];

      const dayTasks = dayLectures
        .filter((lecture) => {
          const isOwnLecture = String(userId) === String(lecture.creatorId);

          const hasContent =
            (Array.isArray(lecture.assignmentDtos) &&
              lecture.assignmentDtos.some((assignment) => {
                const assignmentEndDate = new Date(
                  assignment.endDate,
                ).toLocaleDateString("en-CA");
                return (
                  assignmentEndDate === formattedDate &&
                  (isOwnLecture || !Object.values(assignment).includes(null))
                );
              })) ||
            (Array.isArray(lecture.materialDtos) &&
              lecture.materialDtos.some((material) => {
                const materialStartDate = new Date(
                  material.startDate,
                ).toLocaleDateString("en-CA");
                return (
                  materialStartDate === formattedDate &&
                  (isOwnLecture || !Object.values(material).includes(null))
                );
              })) ||
            (Array.isArray(lecture.videoDtos) &&
              lecture.videoDtos.some((video) => {
                const videoStartDate = new Date(
                  video.startDate,
                ).toLocaleDateString("en-CA");
                return (
                  videoStartDate === formattedDate &&
                  (isOwnLecture || !Object.values(video).includes(null))
                );
              }));

          return hasContent;
        })
        .map((lecture) => {
          const iconType = getIconType(lecture, formattedDate);
          return {
            courseId: lecture.courseId,
            iconColor: getIconColor(iconType),
          };
        });

      if (dayTasks.length > 0) {
        acc[date.getDate()] = dayTasks;
      }
      return acc;
    }, {});

    setTasks(newTasks);
  }, [lectures, currentWeek, selectedDay, userId]);

  return (
    <CalendarContainer>
      {weekDates.map((date, index) => (
        <DateBox
          key={index}
          onClick={() => {
            setSelectedDay(date.getDate());
            setSelectedDate(date);
          }}
          isSelected={selectedDay === date.getDate()}
        >
          <DayLabel data-translate-id={`day-${days[index]}`}>
            {days[index]}
          </DayLabel>
          <DateNumber isSelected={selectedDay === date.getDate()}>
            {date.getDate()}
          </DateNumber>
          <DateTodo>
            {(tasks[date.getDate()] || []).map((task, i) => (
              <React.Fragment key={i}>
                <TodoCircle style={{ backgroundColor: task.iconColor }} />
              </React.Fragment>
            ))}
          </DateTodo>
        </DateBox>
      ))}
    </CalendarContainer>
  );
}

WeeklyCalendar.propTypes = {
  currentWeek: PropTypes.instanceOf(Date).isRequired,
  setSelectedDate: PropTypes.func.isRequired,
  lectures: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
};

const CalendarContainer = styled.div`
  display: flex;
  align-items: stretch;
  gap: 5px;
  background-color: #fff;
  border-radius: 10px;
  width: 100%;
  box-sizing: border-box;
  padding: 2vh 0;
  height: 14vh;
  overflow: hidden;
`;

const DateBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  font-size: 16px;
  gap: 10px;
  cursor: pointer;

  @media all and (max-width: 479px) {
    font-size: 12px;
  }
`;

const DayLabel = styled.div`
  font-size: 14px;

  @media all and (max-width: 479px) {
    font-size: 12px;
  }
`;

const DateNumber = styled.div`
  color: #000;
  background-color: ${({ isSelected }) =>
    isSelected ? "#FFD1D1" : "transparent"};
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media all and (max-width: 479px) {
    font-size: 12px;
    width: 25px;
    height: 25px;
  }
`;

const DateTodo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  height: 10px;
`;

const TodoCircle = styled.div`
  width: 8px;
  height: 8px;
  background-color: ${({ completed }) => (completed ? "#FF4747" : "#DEDEDE")};
  border-radius: 50%;

  @media all and (max-width: 479px) {
    width: 6px;
    height: 6px;
  }
`;

export default WeeklyCalendar;
