import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { getDashboard } from "../../api/dashboardApi.js";

function Sidebar({ userId, selectedDate }) {
  const [lectures, setLectures] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const formattedDate = selectedDate.toLocaleDateString("en-CA");
        const data = await getDashboard(userId, formattedDate);

        if (data.success) {
          const filteredLectures = data.data.filter((task) => {
            const isOwnLecture = String(userId) === String(task.creatorId);

            const hasContent =
              (Array.isArray(task.assignmentDtos) &&
                task.assignmentDtos.some((assignment) => {
                  const assignmentEndDate = new Date(
                    assignment.endDate,
                  ).toLocaleDateString("en-CA");
                  return (
                    assignmentEndDate === formattedDate &&
                    (isOwnLecture || !Object.values(assignment).includes(null))
                  );
                })) ||
              (Array.isArray(task.materialDtos) &&
                task.materialDtos.some((material) => {
                  const materialStartDate = new Date(
                    material.startDate,
                  ).toLocaleDateString("en-CA");
                  return (
                    materialStartDate === formattedDate &&
                    (isOwnLecture || !Object.values(material).includes(null))
                  );
                })) ||
              (Array.isArray(task.videoDtos) &&
                task.videoDtos.some((video) => {
                  const videoStartDate = new Date(
                    video.startDate,
                  ).toLocaleDateString("en-CA");
                  return (
                    videoStartDate === formattedDate &&
                    (isOwnLecture || !Object.values(video).includes(null))
                  );
                }));
            return hasContent;
          });

          setLectures(filteredLectures);
        } else {
          console.log("Data fetch was not successful.");
        }
      } catch (error) {
        console.error("Sidebar API 호출 에러:", error);
      }
    };

    fetchDashboard();
  }, [userId, selectedDate]);

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

    // 모든 과제가 제출되었고, 모든 자료가 활성화된 경우에만 SUBMITTED
    if (allAssignmentsSubmitted && allMaterialsActive) {
      return "DONE";
    }

    return "NOT_DONE";
  };

  const getLectureIcon = (iconType) => {
    switch (iconType) {
      case "MY_LECTURE":
        return <div className="mylectureicon"></div>;
      case "DONE":
        return <div className="activeicon"></div>;
      case "NOT_DONE":
        return <div className="unactiveicon"></div>;
      default:
        return null;
    }
  };

  return (
    <SidebarContainer>
      {lectures.length > 0 ? (
        lectures.map((lecture) => {
          return (
            <MenuItem key={lecture.courseId}>
              {getLectureIcon(
                getIconType(lecture, selectedDate.toLocaleDateString("en-CA")),
              )}
              {lecture.courseTitle}
            </MenuItem>
          );
        })
      ) : (
        <div></div>
      )}
    </SidebarContainer>
  );
}

Sidebar.propTypes = {
  userId: PropTypes.string.isRequired,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
};

const SidebarContainer = styled.div`
  min-width: 75px;
  width: 15%;
  max-width: 200px;
  min-height: 20vh;
  height: 40vh;
  background-color: #fff;
  padding: 20px;
  border-radius: 15px;

  @media all and (max-width: 479px) {
    display: none;
  }
`;

const MenuItem = styled.div`
  padding: 5px;
  margin-bottom: 10px;
  color: #000;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  .activeicon {
    margin-right: 10px;
    display: inline-block;
    width: 12px;
    height: 12px;
    background: #ff4747;
    border-radius: 50%;
    text-align: center;
    line-height: 12px;
  }

  .unactiveicon {
    margin-right: 10px;
    display: inline-block;
    width: 12px;
    height: 12px;
    background: #d9d9d9;
    border-radius: 50%;
    text-align: center;
    line-height: 12px;
  }
  .mylectureicon {
    margin-right: 10px;
    display: inline-block;
    width: 12px;
    height: 12px;
    background: var(--guide-green-color);
    border-radius: 50%;
    text-align: center;
    line-height: 12px;
  }
`;

export default Sidebar;
