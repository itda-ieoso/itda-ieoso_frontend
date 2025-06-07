import { useRef, useEffect } from "react";
import styled from "styled-components";
import Profile from "../../img/class/profile.svg";
import Done from "../../img/class/check/progress_done.svg";
import Undone from "../../img/class/check/progress_undone.svg";
import LateSubmission from "../../img/class/check/late_submission.svg";
import { useNavigate, useParams } from "react-router-dom";

const ScrollableTableContainer = styled.div`
  width: 100%;
  position: relative;

  overflow-x: hidden;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  ::-webkit-scrollbar {
    display: none; /* Webkit */
  }

  .custom-scrollbar {
    margin-top: 3rem;
    height: 8px;
    width: 100%;
    background: #f1f1f1;
    border-radius: 10px;
    overflow: hidden;

    @media (max-width: 1024px) {
      margin-top: 2.8vh;
      height: 6.8px;
    }
    @media (max-width: 768px) {
      margin-top: 2.2vh;
      height: 5.3px;
    }

    @media (max-width: 480px) {
      margin-top: 3vh;
      height: 3.8px;
    }
  }

  .custom-scrollbar-thumb {
    height: 100%;
    background: #c4c4c4;
    border-radius: 10px;
    cursor: pointer;
    position: relative;
    transition: background-color 0.3s ease;
  }

  .custom-scrollbar-thumb:hover {
    background: #a6a6a6;
  }
`;

const Table = styled.table`
  width: auto;
  border-collapse: collapse;
  text-align: center;

  th,
  td {
    padding: 0.7rem 6vh;
    width: 3rem;
    border-bottom: 1px solid #cdcdcd;

    @media (max-width: 1024px) {
      padding: 0.75vh 2.9vh;
    }

    @media (max-width: 768px) {
      padding: 0.9vh 3.2vh;
    }

    @media (max-width: 480px) {
      padding: 1.4vh 3.2vh;
    }
    @media (max-width: 376px) {
      padding: 0.8vh 2.5vh;
    }
  }

  th {
    font-size: 1.2rem;
    white-space: nowrap;

    @media (max-width: 1024px) {
      font-size: 16px;
      font-weight: 700;
    }

    @media (max-width: 768px) {
      font-size: 13.3px;
      font-weight: 600;
    }

    @media (max-width: 480px) {
      font-size: 9.3px;
    }

    @media (max-width: 376px) {
      font-size: 9px;
    }
  }

  th:first-child {
    text-align: left;
  }

  td {
    font-size: 1.05rem;
    font-weight: bold;
    white-space: nowrap;

    @media (max-width: 1024px) {
      font-size: 15px;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      font-size: 13px;
    }
    @media (max-width: 480px) {
      font-size: 8.6px;
    }

    @media (max-width: 376px) {
      font-size: 8.3px;
    }
  }

  td:first-child {
    text-align: left !important;
    padding-left: 0rem !important;
    padding-right: 15vh;

    @media (max-width: 1024px) {
      padding-right: 6vh;
    }

    @media (max-width: 376px) {
      padding-right: 4.2vh;
    }
  }
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  justify-content: flex-start;

  @media (max-width: 480px) {
    gap: 0.35rem;
  }
`;

const ProfileImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;

  @media (max-width: 1024px) {
    width: 2vh;
    height: 1.8vh;
  }

  @media (max-width: 480px) {
    width: 3.2vh;
    height: 3vh;
  }

  @media (max-width: 376px) {
    width: 2.5vh;
    height: 2.3vh;
  }
`;

const CheckMarkIcon = styled.img`
  width: 1.7rem;
  height: 1.7rem;

  @media (max-width: 1024px) {
    height: 1.6vh;
  }

  @media (max-width: 480px) {
    height: 2.7vh;
  }

  @media (max-width: 376px) {
    height: 2vh;
  }
`;

const StudentProgressTable = ({ assignments }) => {
  if (!assignments.length) return <div>과제 데이터가 없습니다.</div>;

  const studentsMap = new Map();

  assignments.forEach((assignment) => {
    assignment.studentStatuses.forEach((student) => {
      if (!studentsMap.has(student.userId)) {
        studentsMap.set(student.userId, {
          userId: student.userId,
          name: student.studentName,
          profile: Profile,
          submissions: [],
        });
      }
      studentsMap.get(student.userId).submissions.push(student.status); // 상태를 그대로 저장
    });
  });
  const students = Array.from(studentsMap.values());

  const tableRef = useRef(null);
  const scrollbarThumbRef = useRef(null);
  const isDragging = useRef(false); // 드래그 상태 추적
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const navigate = useNavigate();
  const { courseId } = useParams();

  const handleScroll = () => {
    const scrollWidth =
      tableRef.current.scrollWidth - tableRef.current.clientWidth;
    const scrollbarWidth = scrollbarThumbRef.current.parentElement.offsetWidth;

    const thumbWidth =
      (tableRef.current.clientWidth / tableRef.current.scrollWidth) *
      scrollbarWidth;
    scrollbarThumbRef.current.style.width = `${thumbWidth}px`;

    const thumbPosition =
      (tableRef.current.scrollLeft / scrollWidth) *
      (scrollbarWidth - thumbWidth);
    scrollbarThumbRef.current.style.transform = `translateX(${thumbPosition}px)`;
  };

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.clientX;
    scrollLeft.current = tableRef.current.scrollLeft;
    document.body.style.userSelect = "none"; // 드래그 중 텍스트 선택 방지
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - startX.current;
    const scrollWidth =
      tableRef.current.scrollWidth - tableRef.current.clientWidth;
    const scrollbarWidth = scrollbarThumbRef.current.parentElement.offsetWidth;

    const thumbWidth =
      (tableRef.current.clientWidth / tableRef.current.scrollWidth) *
      scrollbarWidth;
    const moveRatio = scrollWidth / (scrollbarWidth - thumbWidth);
    tableRef.current.scrollLeft = scrollLeft.current + dx * moveRatio;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.body.style.userSelect = "auto";
  };

  useEffect(() => {
    const currentTable = tableRef.current;
    currentTable.addEventListener("scroll", handleScroll);
    handleScroll(); // 초기 스크롤바 상태 설정

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      currentTable.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <ScrollableTableContainer>
      <div
        ref={tableRef}
        onScroll={handleScroll}
        style={{ overflowX: "auto", position: "relative" }}
      >
        <Table>
          <thead>
            <tr>
              <th>이름</th>
              {assignments.map((assignment) => (
                <th key={assignment.assignmentId}>
                  {assignment.assignmentTitle}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index}>
                <td>
                  <ProfileContainer
                    onClick={() =>
                      navigate(
                        `/class/${courseId}/admin/students/${student.userId}`,
                      )
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <ProfileImage src={student.profile} alt="프로필" />
                    {student.name}
                  </ProfileContainer>
                </td>

                {student.submissions.map((status, idx) => {
                  let iconSrc;
                  if (status === "SUBMITTED") {
                    iconSrc = Done;
                  } else if (status === "NOT_SUBMITTED") {
                    iconSrc = Undone;
                  } else if (status === "LATE") {
                    iconSrc = LateSubmission;
                  } else {
                    iconSrc = Undone; // 기본값 처리
                  }
                  return (
                    <td key={idx}>
                      <CheckMarkIcon src={iconSrc} alt={status} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <div className="custom-scrollbar">
        <div
          ref={scrollbarThumbRef}
          className="custom-scrollbar-thumb"
          onMouseDown={handleMouseDown}
        />
      </div>
    </ScrollableTableContainer>
  );
};

export default StudentProgressTable;
