import { useState, forwardRef, useEffect } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import DateTime from "../../img/class/edit/datetime.svg";
import Calendar from "../../img/class/edit/calendar.svg";
import api from "../../api/api.js";

const DateTimeContainer = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 2rem;

  @media (max-width: 1024px) {
    margin-bottom: 1.5rem;
  }

  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }

  @media (max-width: 480px) {
    margin-bottom: 0.5rem;
  }

  /* 달력 팝업 */
  .react-datepicker {
    display: flex;
    width: 50vh;
    height: auto;
    border: 1px solid #dcdcdc;
    font-size: 14px;
    border-radius: 10px;
    overflow: hidden;

    @media (max-width: 1024px) {
      width: 50vh;
      font-size: 11.5px;
    }

    @media (max-width: 768px) {
      width: 40vh;
      font-size: 10px;
      border-radius: 7px;
    }

    @media (max-width: 480px) {
      width: 40vh;
      border-radius: 5px;
    }

    @media (max-width: 440px) {
      width: 24vh;
      border-radius: 5px;
    }

    @media (max-width: 376px) {
      width: 28vh;
      border-radius: 3px;
    }
  }

  .react-datepicker__triangle {
    display: none !important;
  }

  .react-datepicker__month-container {
    flex: 3;
    min-width: 0;
    padding: 1vh;
  }

  .react-datepicker__current-month {
    font-size: 16px;
    font-weight: bold;

    @media (max-width: 1024px) {
      font-size: 12.8px;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      font-size: 11.5px;
    }

    @media (max-width: 480px) {
      font-size: 7px;
      font-weight: 550;
    }
    @media (max-width: 376px) {
      font-size: 6.5px;
    }
  }

  .react-datepicker__month {
    @media (max-width: 1024px) {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 75%;
    }

    @media (max-width: 768px) {
      height: 70%;
    }
    @media (max-width: 480px) {
      margin: 0 auto;
    }
  }

  .react-datepicker__header {
    background-color: white;
    border-bottom: none;
    display: flex;
    flex-direction: column;
    padding: 0.5vh;
    gap: 0.5vh;

    @media (max-width: 1024px) {
      padding: 0.3vh;
      gap: 0vh;
    }

    @media (max-width: 480px) {
      padding: 0.1vh;
    }

    @media (max-width: 376px) {
      padding: 0vh;
    }
  }

  .react-datepicker__day {
    padding: 0.2vh;
    border-radius: 50%;

    @media (max-width: 1024px) {
      padding: 0vh;
    }

    @media (max-width: 768px) {
      font-size: 10px;
      align-items: center;
      justify-content: flex-start;
      padding: 0px;
      margin: 0;
    }
    @media (max-width: 480px) {
      font-size: 7px;
      line-height: 2.5;
    }

    @media (max-width: 376px) {
      font-size: 6.5px;
    }
  }

  .react-datepicker__day-names {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .react-datepicker__week {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .react-datepicker__day-name {
    flex: 1;
    text-align: center;
    font-weight: 500;
    font-size: 13px;
    padding: 1vh 0.2vh;
    padding-top: 0vh;

    @media (max-width: 1024px) {
      font-size: 11.5px;
      padding: 0vh;
    }

    @media (max-width: 768px) {
      font-size: 9px;
    }

    @media (max-width: 480px) {
      flex: 0.5;
      font-size: 7px;
    }

    @media (max-width: 376px) {
      flex: 1;
      font-size: 6.5px;
    }
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background-color: var(--main-color);
    color: white;
  }

  .react-datepicker__day:hover {
    background-color: var(--pink-color);
    border-radius: 50%;
  }

  .react-datepicker__time-container {
    border-left: 1px solid #eee;
    display: flex;
    flex-direction: column;

    @media (max-width: 768px) {
      max-height: 10vh;
    }

    @media (max-width: 480px) {
      flex: 1;
      max-height: 20vh;
    }
  }

  .react-datepicker__time {
    border-top: 1px solid #eee;
    width: 100%;
  }

  .react-datepicker__time-box {
    @media (max-width: 480px) {
      width: 10vh;
      max-width: 10vh;
      flex: 1;
      box-sizing: border-box;
    }
    @media (max-width: 376px) {
      width: 7vh;
      max-width: 7vh;
      flex: 1;
      box-sizing: border-box;
    }
  }

  .react-datepicker-time__header {
    font-size: 13px;
    font-weight: bold;

    flex-shrink: 0;
    padding: 0.5rem 0;
    z-index: 1;

    @media (max-width: 1024px) {
      font-size: 12px !important;
      padding: 0.2rem 0;
    }
    @media (max-width: 768px) {
      font-size: 10.5px !important;
      padding: 0.35rem 0;
    }

    @media (max-width: 480px) {
      font-size: 7.5px !important;
      padding: 0.15rem 0;
    }

    @media (max-width: 376px) {
      font-size: 6px !important;
      padding: 0.3rem 0;
    }
  }

  .react-datepicker__time-list {
    width: 100%;
    box-sizing: border-box;

    @media (max-width: 480px) {
      max-height: 25vh;
    }

    @media (max-width: 376px) {
      max-height: 18vh;
    }
  }

  .react-datepicker__time-list-item {
    font-size: 14px;
    color: #333;
    cursor: pointer;
    width: 100%;
    min-height: 40px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      background-color: var(--pink-color) !important;
      color: white;
    }
    @media (max-width: 1024px) {
      font-size: 12px;
    }
    @media (max-width: 768px) {
      font-size: 10px;
      min-height: 30px;
    }
    @media (max-width: 480px) {
      font-size: 7px;
      min-height: 17px;
      max-height: 17px;
    }
  }

  .react-datepicker__time-list-item--selected {
    background-color: var(--main-color) !important; /* 강조 */
    color: white !important;
    font-weight: bold;
  }
`;

const DateRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const DateTimeIcon = styled.img`
  width: 2.5rem;
  margin-left: 1rem;
  margin-right: 5.5vh;
  align-self: center;

  @media (max-width: 1024px) {
    margin-left: 0.5vh;
    margin-right: 1.55vh;
    width: 2.3vh;
  }

  @media (max-width: 768px) {
    margin-left: 0.3vh;
    margin-right: 1.5vh;
    width: 2.4vh;
  }

  @media (max-width: 480px) {
    margin-left: 0vh;
    margin-right: 1.8vh;
    width: 3.5vh;
  }

  @media (max-width: 376px) {
    margin-right: 1.2vh;
    width: 2.5vh;
  }
`;

const InputBox = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  border: 2px solid #c3c3c3;
  border-radius: 8px;
  color: #c3c3c3;
  font-weight: bold;
  font-size: 1rem;
  padding: 0.8rem 1rem;
  cursor: pointer;
  flex: 1;
  justify-content: space-between;

  @media (max-width: 1024px) {
    font-size: 12px;
    padding: 0.8vh 1vh;
    border: 1.9px solid #c3c3c3;
    border-radius: 7px;
  }

  @media (max-width: 768px) {
    font-size: 10px;
    padding: 0.9vh 0.9vh;
    border: 1.4px solid #c3c3c3;
    border-radius: 6.5px;
  }

  @media (max-width: 480px) {
    font-size: 6.6px;
    padding: 1.2vh 1.3vh;
    border: 1px solid #c3c3c3;
    border-radius: 4px;
  }

  @media (max-width: 376px) {
    font-size: 6px;
    padding: 0.7vh 1vh;
    border-radius: 3.4px;
  }
`;

const Icon = styled.img`
  width: 1rem;

  @media (max-width: 1024px) {
    width: 0.9vh;
  }

  @media (max-width: 480px) {
    width: 1.5vh;
  }

  @media (max-width: 480px) {
    width: 1.2vh;
  }
`;

const ErrorText = styled.p`
  color: red;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const CustomInput = forwardRef(({ value, onClick, text }, ref) => {
  return (
    <InputBox
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      ref={ref}
      style={{ color: value ? "black" : "#c3c3c3" }}
    >
      <span>{value || text}</span>
      <Icon src={Calendar} alt="Calendar Icon" />
    </InputBox>
  );
});

// DateTimeEdit 컴포넌트
const DateTimeEdit = ({
  field,
  initialDate,
  courseId,
  userId,
  subSection,
  onDateChange,
  lectureStartDate,
  lectureEndDate,
}) => {
  const [date, setDate] = useState(initialDate ? initialDate : null);

  const parseDate = (dateString, isEnd = false) => {
    const date = new Date(dateString);
    if (isEnd) {
      date.setHours(23, 59, 0, 0);
    } else {
      date.setHours(0, 0, 0, 0);
    }
    return date;
  };

  const formatToKST = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0",
    )}-${String(date.getDate()).padStart(2, "0")}T${String(
      date.getHours(),
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:00`;
  };

  const updateDateAPI = async (field, dateValue) => {
    if (!subSection) return;

    const userIdNum = Number(subSection.userId);
    let url = "";
    let data = {};

    // Date 변환 (toISOString)
    // const kstOffset = 9 * 60 * 60 * 1000;
    // const localTime = new Date(date.getTime() + kstOffset);
    const formattedDate = formatToKST(dateValue);

    if (subSection.contentType === "video" && field === "startDate") {
      const videoId = Number(subSection.videoId);
      url = `/videos/${courseId}/${videoId}/${userId}`;
      data = { startDate: formattedDate };
    } else if (subSection.contentType === "assignment" && field === "endDate") {
      const assignmentId = Number(subSection.assignmentId);
      url = `/assignments/${courseId}/${assignmentId}/${userId}`;
      data = { endDate: formattedDate };
    } else if (subSection.contentType === "material" && field === "startDate") {
      const materialId = Number(subSection.materialId);
      const formattedDatenoz = formattedDate.replace("Z", "");
      url = `/materials/${courseId}/${materialId}/${userId}?startDate=${formattedDatenoz}`;
    }

    try {
      const response = await api.patch(url, data);
    } catch (error) {
      console.error("날짜 업데이트 실패:", error);
    }
  };

  const handleDateChange = (newDate) => {
    if (!newDate) {
      alert("날짜를 선택해주세요!");
      return;
    }

    if (
      newDate < parseDate(lectureStartDate) ||
      newDate > parseDate(lectureEndDate, true)
    ) {
      alert("강의 기간 내에서만 선택할 수 있습니다.");
      return;
    }

    setDate(newDate);

    onDateChange(field, newDate);
    updateDateAPI(field, newDate);
  };

  return (
    <div className="datetime-edit">
      <DateTimeContainer>
        <DateRow>
          <DateTimeIcon src={DateTime} />
          <DatePicker
            selected={date}
            onChange={handleDateChange}
            showTimeSelect
            dateFormat="yyyy년 MM월 dd일 HH:mm"
            minDate={parseDate(lectureStartDate)}
            maxDate={parseDate(lectureEndDate, true)}
            locale={ko}
            customInput={
              <CustomInput
                text={field === "startDate" ? "업로드일" : "마감일"}
              />
            }
            timeIntervals={15}
            timeCaption="시간"
          />
        </DateRow>
      </DateTimeContainer>
    </div>
  );
};

export default DateTimeEdit;
