import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../../api/api.js";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styled from "styled-components";
import StudentProgressTable from "../../../component/class/StudentProgressTable.jsx";
import { StyledEngineProvider } from "@mui/material";
import { style } from "@mui/system";

const StatsContainer = styled.div`
  display: flex;
  margin-left: 2rem;
  gap: 6rem;
  width: 90%;
`;

const StatBox = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;

  &:first-child {
    flex: 0 0 auto;
    width: auto;
  }

  &:last-child {
    flex: 1;
  }
`;

const CalendarWrapper = styled.div`
  width: 30%;

  .react-calendar {
    border: none;
    background-color: transparent;
  }

  .react-calendar__navigation {
    display: none;
  }

  .react-calendar__month-view__weekdays {
    font-size: 1.2rem;
    text-decoration: none;
    color: var(--black-color);
    text-align: center;
  }

  .react-calendar__month-view__weekdays__weekday abbr {
    text-decoration: none;
  }

  .react-calendar__tile {
    background: transparent;
    text-align: center;
    padding: 1.5rem;
    font-size: 1.2rem; /* 날짜 크기 확대 */
    border-radius: 50%; /* 동그란 셀 */
    transition: background-color 0.3s ease, width 0.3s, height 0.3s;
    width: 40px; /* 날짜 셀 크기 */
    height: 40px; /* 날짜 셀 크기 */
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--black-color);
  }

  .react-calendar__tile--now {
    background-color: var(--main-color) !important;
    width: 50px; /* 현재 날짜 셀 크기 */
    height: 50px; /* 현재 날짜 셀 크기 */
    color: white !important;
  }

  .react-calendar__tile--now:hover {
    background-color: var(
      --main-color
    ) !important;
  }

  .react-calendar__tile:hover {
    background-color: rgba(0, 0, 0, 0.1); ]
  }

  .react-calendar__month-view__days__day--neighboringMonth {
    color: #aaa;
  }
`;

const SummarySection = styled.div`
  display: flex;
  align-items: baseline;
  margin-left: 2.5vh;

  @media (max-width: 1024px) {
    margin-left: 2vh;
  }
`;

const Summary = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: var(--black-color);

  @media (max-width: 768px) {
    font-size: 19px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const CurrentTime = styled.p`
  color: var(--darkgrey-color);
  font-size: 15px;
  margin-left: 1.5vh;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 11px;
    margin-left: 1vh;
  }

  @media (max-width: 480px) {
    font-size: 9px;
    margin-left: 1.2vh;
  }
`;

const Section = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  margin-bottom: 2rem;
  padding: 2.2vh 4.8vh;
  padding-bottom: 3rem;

  @media (max-width: 1024px) {
    padding: 2.2vh 3.3vh;
  }

  @media (max-width: 480px) {
    padding: 5.5vh 5vh;
  }

  @media (max-width: 376px) {
    padding: 2vh 3vh;
  }
`;

const ClassSummary = () => {
  const { courseId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = `${now.getFullYear()}.${
        now.getMonth() + 1
      }.${now.getDate()}`;
      setCurrentTime(
        `${formattedTime} ${now.getHours()}:${String(now.getMinutes()).padStart(
          2,
          "0",
        )}`,
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    const fetchAssignmentStats = async () => {
      try {
        const response = await api.get(
          `/statistics/courses/${courseId}/assignments`,
        );
        if (response.data.success) {
          setAssignments(response.data.data);
        }
      } catch (error) {
        console.error("과제 통계 불러오기 오류:", error);
      }
    };

    if (courseId) {
      fetchAssignmentStats();
    }
  }, [courseId]);

  return (
    <main
      style={{
        flex: 1,
        borderRadius: "8px",
      }}
    >
      <div style={{ margin: "1vh 0vh" }}>
        <SummarySection>
          <Summary>요약</Summary>
          <CurrentTime>{currentTime} 기준</CurrentTime>
        </SummarySection>
        <Section>
          {/* <div
                style={{ display: "flex", gap: "2rem", marginBottom: "4rem" }}
              >
                <CalendarWrapper>
                  <h2>{currentMonth}</h2>
                  <Calendar
                    locale="ko"
                    showNavigation={false}
                    showNeighboringMonth={true}
                    formatDay={(locale, date) => date.getDate()}
                  />
                </CalendarWrapper>

                <StatsContainer>
                  <StatBox>
                    <h2>전체 과제 제출 현황</h2>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flex: "1",
                      }}
                    >
                      <PercentRing percent={75} />
                    </div>
                  </StatBox>
                  <StatBox>
                    <h2>최근 과제 제출 현황</h2>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flex: "1",
                      }}
                    >
                      <PercentBar percent={62} />
                    </div>
                  </StatBox>
                </StatsContainer>
              </div> */}
          <StudentProgressTable assignments={assignments} />
        </Section>
      </div>
    </main>
  );
};

export default ClassSummary;
