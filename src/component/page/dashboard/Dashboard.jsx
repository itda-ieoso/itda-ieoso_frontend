import { useState, useEffect, useContext } from 'react';
import styled from "styled-components";
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import TopBar from "../../ui/TopBar";
import WeeklyCalendar from "./WeekCalendar";
import Sidebar from "./Sidebar";
import TaskList from "./TaskList";
import { UsersContext } from "../../contexts/usersContext";
import { getDashboard } from '../../api/dashboardApi';

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
  const firstDay = new Date(startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek + 1));

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

    const responses = await Promise.all(weekDates.map(async (date) => {
      if (!newLectures[date]) {
        const data = await getDashboard(user.userId, date);
        return { date, data };
      }
      return { date, data: newLectures[date] };
    }));

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
  return getCurrentWeekDates(date).map(dateStr => new Date(dateStr));
};

const nextWeek = () => setCurrentWeek(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 7));
const prevWeek = () => setCurrentWeek(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 7));

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
    <Container>
      <WeekRange>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#000' }}>이번 주 강의표</div>
          <div style={{ fontSize: '16px', color: '#888', marginLeft: '10px', paddingTop: '5px' }}>
            {weekDates[0].toLocaleDateString()} - {weekDates[6].toLocaleDateString()}
          </div>
        </div>
        <WeekButton>
          <button onClick={prevWeek} style={{ transform: 'scale(0.8)' }}>
            <ChevronLeft style={{ fontSize: '30px' }} />
          </button>
          <button onClick={nextWeek} style={{ transform: 'scale(0.8)' }}>
            <ChevronRight style={{ fontSize: '30px' }} />
          </button>
        </WeekButton>
      </WeekRange>
      
      {/* WeekCalendar에 필터링된 강의 데이터 전달 */}
      <WeeklyCalendar currentWeek={currentWeek} setSelectedDate={setSelectedDate} lectures={weeklyLectures} userId={String(user.userId)} />

      <ToDoContainer>
        <Sidebar userId={String(user.userId)} selectedDate={selectedDate} lectures={filteredLectures} />
        <TaskList userId={String(user.userId)} selectedDate={selectedDate} lectures={filteredLectures} />
      </ToDoContainer>
    </Container>
  </>
);
}

// 헤더 밑 
const Container = styled.div`
  padding: 20px 30px;
`;

const WeekRange = styled.div`
  display: flex;
  align-items: center;
  color: #888;
  margin-bottom: 10px;
  justify-content: space-between;
`;

const WeekButton = styled.div`
  display: flex;
  gap: 10px;
  button {
    background: #C3C3C3;
    border: none;
    border-radius: 100%;
    color: #fff;
    padding: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const ToDoContainer = styled.div`
  display: flex;
  margin-top: 30px;
`;