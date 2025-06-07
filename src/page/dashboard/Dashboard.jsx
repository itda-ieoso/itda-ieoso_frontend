import { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import TopBar from "../../component/TopBar.jsx";
import { PageLayout } from "../../component/class/ClassLayout.jsx";
import WeeklyCalendar from "./WeekCalendar.jsx";
import Sidebar from "./Sidebar.jsx";
import TaskList from "./TaskList.jsx";
import { UsersContext } from "../../contexts/usersContext.jsx";
import { getDashboard } from "../../api/dashboardApi.js";

export default function DashBoard() {
  const { user } = useContext(UsersContext);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [lectures, setLectures] = useState({});
  const [filteredLectures, setFilteredLectures] = useState([]);

  useEffect(() => {
    fetchData();
  }, [user?.userId, currentWeek]);

  const getCurrentWeekDates = (date) => {
    const startOfWeek = new Date(date);
    const dayOfWeek = startOfWeek.getDay();
    const firstDay = new Date(
      startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek + 1),
    );

    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(firstDay);
      day.setDate(firstDay.getDate() + i);

      return day.toISOString().split("T")[0];
    });
  };

  const fetchData = async () => {
    if (!user) return;

    try {
      const weekDates = getCurrentWeekDates(currentWeek);
      const newLectures = { ...lectures };

      const responses = await Promise.all(
        weekDates.map(async (date) => {
          if (!newLectures[date]) {
            const data = await getDashboard(user.userId, date);
            return { date, data };
          }
          return { date, data: newLectures[date] };
        }),
      );

      responses.forEach(({ date, data }) => {
        if (data.success) {
          newLectures[date] = data.data;
        }
      });

      setLectures(newLectures);
    } catch (error) {
      console.error("데이터 가져오기 실패:", error);
    }
  };

  if (!user) {
    return <div>사용자 정보가 없습니다.</div>;
  }

  const getWeekDates = (date) => {
    return getCurrentWeekDates(date).map((dateStr) => new Date(dateStr));
  };

  const nextWeek = () =>
    setCurrentWeek(
      (prev) =>
        new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 7),
    );
  const prevWeek = () =>
    setCurrentWeek(
      (prev) =>
        new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 7),
    );

  const weekDates = getWeekDates(new Date(currentWeek));

  const weeklyLectures = weekDates.reduce((acc, date) => {
    const dateStr = date.toISOString().split("T")[0];
    if (lectures[dateStr]) {
      acc[dateStr] = lectures[dateStr];
    }
    return acc;
  }, {});

  return (
    <>
      <TopBar />
      <PageLayout>
        <WeekRange>
          <WeekTitle>
            <div className="week-text">이번 주 강의표</div>
            <div className="date-text">
              {weekDates[0].toLocaleDateString()} -{" "}
              {weekDates[6].toLocaleDateString()}
            </div>
          </WeekTitle>
          <WeekButton>
            <button onClick={prevWeek} style={{ transform: "scale(0.8)" }}>
              <ChevronLeft style={{ fontSize: "30px" }} />
            </button>
            <button onClick={nextWeek} style={{ transform: "scale(0.8)" }}>
              <ChevronRight style={{ fontSize: "30px" }} />
            </button>
          </WeekButton>
        </WeekRange>

        {/* WeekCalendar에 필터링된 강의 데이터 전달 */}
        <WeeklyCalendar
          currentWeek={currentWeek}
          setSelectedDate={setSelectedDate}
          lectures={weeklyLectures}
          userId={String(user.userId)}
        />

        <ToDoContainer>
          <Sidebar
            userId={String(user.userId)}
            selectedDate={selectedDate}
            lectures={filteredLectures}
          />
          <TaskList
            userId={String(user.userId)}
            selectedDate={selectedDate}
            lectures={filteredLectures}
          />
        </ToDoContainer>
      </PageLayout>
    </>
  );
}

const WeekRange = styled.div`
  display: flex;
  align-items: center;
  color: #888;
  margin-bottom: 10px;
  justify-content: space-between;
`;

const WeekTitle = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-left: 2px;

  @media all and (max-width: 479px) {
    display: block;
  }

  .week-text {
    font-size: 26px;
    font-weight: bold;
    color: #000000;

    @media all and (max-width: 479px) {
      font-size: 20px;
    }
  }
  .date-text {
    font-size: 16px;
    color: #888;
    padding-top: 5px;
    margin-left: 15px;

    @media all and (max-width: 479px) {
      font-size: 14px;
      margin-left: 0;
    }
  }
`;

const WeekButton = styled.div`
  display: flex;
  gap: 10px;
  button {
    background: #c3c3c3;
    border: none;
    border-radius: 100%;
    color: #fff;
    padding: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    @media all and (max-width: 479px) {
      padding: 2px;
    }
  }
`;

const ToDoContainer = styled.div`
  display: flex;
  margin-top: 40px;
`;
