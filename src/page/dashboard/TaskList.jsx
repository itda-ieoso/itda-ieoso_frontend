import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { getDashboard } from "../../api/dashboardApi.js";
import Video from "../../img/icon/videored.svg";
import Assignment from "../../img/icon/docs.svg";
import Material from "../../img/icon/pdf.svg";

function TaskList({ userId, selectedDate }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const formattedDate = selectedDate.toLocaleDateString("en-CA");
        const data = await getDashboard(userId, formattedDate);

        if (data.success) {
          const filteredTasks = data.data.reduce((acc, task) => {
            const hasContent =
              (Array.isArray(task.assignmentDtos) &&
                task.assignmentDtos.some((assignment) => {
                  const assignmentEndDate = new Date(
                    assignment.endDate,
                  ).toLocaleDateString("en-CA");
                  const isOwnLecture =
                    String(userId) === String(task.creatorId);
                  return (
                    assignmentEndDate === formattedDate &&
                    (isOwnLecture ||
                      Object.values(assignment).every(
                        (value) => value !== null,
                      ))
                  );
                })) ||
              (Array.isArray(task.materialDtos) &&
                task.materialDtos.some((material) => {
                  const materialStartDate = new Date(
                    material.startDate,
                  ).toLocaleDateString("en-CA");
                  const isOwnLecture =
                    String(userId) === String(task.creatorId);
                  return (
                    materialStartDate === formattedDate &&
                    (isOwnLecture ||
                      Object.values(material).every((value) => value !== null))
                  );
                })) ||
              (Array.isArray(task.videoDtos) &&
                task.videoDtos.some((video) => {
                  const videoStartDate = new Date(
                    video.startDate,
                  ).toLocaleDateString("en-CA");
                  const isOwnLecture =
                    String(userId) === String(task.creatorId);
                  return (
                    videoStartDate === formattedDate &&
                    (isOwnLecture ||
                      Object.values(video).every((value) => value !== null))
                  );
                }));
            if (hasContent) acc.push(task);
            return acc;
          }, []);
          setTasks(filteredTasks);
        }
      } catch (error) {
        console.error("TaskList API 호출 에러:", error);
      }
    };

    fetchTasks();
  }, [userId, selectedDate]);

  const getTasksByType = (lecture, formattedDate) => {
    const tasks = [];

    if (lecture.videoDtos) {
      tasks.push(
        ...lecture.videoDtos
          .filter((video) => {
            const videoStartDate = new Date(video.startDate).toLocaleDateString(
              "en-CA",
            );
            return videoStartDate === formattedDate;
          })
          .map((video) => ({
            ...video,
            type: "video",
            title: video.videoTitle,
            submissionStatus: true,
          })),
      );
    }
    if (lecture.materialDtos) {
      tasks.push(
        ...lecture.materialDtos
          .filter((material) => {
            const materialStartDate = new Date(
              material.startDate,
            ).toLocaleDateString("en-CA");
            const isOwnLecture = String(userId) === String(lecture.creatorId);
            return (
              materialStartDate === formattedDate &&
              (isOwnLecture ||
                Object.values(material).some((value) => value !== null))
            );
          })
          .map((material) => ({
            ...material,
            type: "material",
            title: material.originalFilename,
            submissionStatus: material.materialHistoryStatus,
          })),
      );
    }
    if (lecture.assignmentDtos) {
      tasks.push(
        ...lecture.assignmentDtos
          .filter((assignment) => {
            const assignmentEndDate = new Date(
              assignment.endDate,
            ).toLocaleDateString("en-CA");
            const isOwnLecture = String(userId) === String(lecture.creatorId);
            return (
              assignmentEndDate === formattedDate &&
              (isOwnLecture ||
                Object.values(assignment).some((value) => value !== null))
            );
          })
          .map((assignment) => ({
            ...assignment,
            type: "assignment",
            title: assignment.assignmentTitle,
            submissionStatus:
              assignment.submissionStatus === "SUBMITTED" ||
              assignment.submissionStatus === "LATE",
          })),
      );
    }
    return tasks;
  };

  return (
    <TaskContainer>
      <TaskHeader
        date={selectedDate.toLocaleDateString()}
        title="이 날의 할 일"
      />
      <TaskListContainer>
        {tasks.map((lecture, index) => {
          const formattedDate = selectedDate.toLocaleDateString("en-CA");
          const lectureTasks = getTasksByType(lecture, formattedDate);
          if (lectureTasks.length > 0) {
            return (
              <div key={lecture.id || index}>
                <TaskSection
                  title={lecture.courseTitle || "제목 없음"}
                  tasks={lectureTasks}
                  userId={userId}
                  creatorId={lecture.creatorId}
                />
                {lectureTasks.length === 0 && <div>할 일이 없습니다</div>}
                {index < tasks.length - 1 && (
                  <hr style={{ border: "1px solid #E0E0E0", width: "92%" }} />
                )}
              </div>
            );
          }
          return null;
        })}
      </TaskListContainer>
    </TaskContainer>
  );
}

TaskList.propTypes = {
  userId: PropTypes.string.isRequired,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
};

function TaskHeader({ date, title }) {
  return (
    <HeaderContainer>
      <HeaderTitle>{title}</HeaderTitle>
      <TaskDate>{date}</TaskDate>
    </HeaderContainer>
  );
}

TaskHeader.propTypes = {
  date: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

function TaskSection({ title, tasks, userId, creatorId }) {
  const getIcon = (type) => {
    switch (type) {
      case "video":
        return (
          <img
            src={Video}
            alt="동영상 아이콘"
            style={{ width: "24px", height: "24px" }}
          />
        );
      case "assignment":
        return (
          <img
            src={Assignment}
            alt="과제 아이콘"
            style={{ width: "20px", height: "28px" }}
          />
        );
      case "material":
        return (
          <img
            src={Material}
            alt="강의 자료 아이콘"
            style={{ width: "20px", height: "28px" }}
          />
        );
      default:
        return "";
    }
  };

  return (
    <>
      <SectionContainer>
        <TaskTitle>{title}</TaskTitle>
        {tasks.map((task) => {
          const isOwnLecture = String(userId) === String(creatorId);
          return (
            <TaskItem key={task.title}>
              {getIcon(task.type)} {task.title}
              {!isOwnLecture && task.type !== "video" && (
                <button
                  style={{
                    marginLeft: "auto",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "50%",
                    padding: "5px",
                  }}
                >
                  {CustomCheckboxCircle(task.submissionStatus)}
                </button>
              )}
            </TaskItem>
          );
        })}
      </SectionContainer>
    </>
  );
}

TaskSection.propTypes = {
  title: PropTypes.string.isRequired,
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }),
  ).isRequired,
  userId: PropTypes.string.isRequired,
  creatorId: PropTypes.string.isRequired,
};

const TaskContainer = styled.div`
  flex-grow: 1;
  background-color: transparent;
  border-radius: 15px;
  margin-left: 20px;

  @media all and (max-width: 479px) {
    margin-left: 0;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 5px;
  background-color: rgb(255, 255, 255);
  border-radius: 15px;

  @media all and (max-width: 479px) {
    padding: 5px;
  }
`;

const HeaderTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  padding: 10px 0 10px 10px;

  @media all and (max-width: 479px) {
    font-size: 16px;
  }
`;

const TaskDate = styled.div`
  font-size: 14px;
  color: #ff4747;
  margin: 3px 10px -3px 10px;
`;

const TaskListContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 15px;
`;

const SectionContainer = styled.div`
  margin-bottom: 20px;
  padding: 5px 30px;
  background-color: rgb(255, 255, 255);
  border-radius: 15px;

  @media all and (max-width: 479px) {
    padding: 5px 12px;
  }
`;

const TaskTitle = styled.h3`
  font-size: 18px;
  color: #ff4747;
  margin-bottom: 15px;
  background-color: #f5f5f5;
  border-radius: 15px;
  padding: 10px;

  @media all and (max-width: 479px) {
    font-size: 14px;
  }
`;

const TaskItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  padding: 7px;
  margin-left: 5px;
  gap: 15px;

  @media all and (max-width: 479px) {
    font-size: 12px;
  }
`;

const CustomCheckboxCircle = (checked) => {
  if (checked) {
    return (
      <span
        className="material-icons"
        style={{ color: "#909090", fontSize: "24px" }}
      >
        check_circle
      </span>
    );
  }
  return (
    <span
      className="material-icons"
      style={{ color: "#d4d4d4", fontSize: "24px" }}
    >
      circle
    </span>
  );
};

export default TaskList;
