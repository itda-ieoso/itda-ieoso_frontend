import { useState, forwardRef, useEffect } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import DateTime from "../../img/class/edit/datetime.svg";
import Calendar from "../../img/class/edit/calendar.svg";
import api from "../../api/api";

const DateTimeContainer = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 1rem;
`;

const DateRow = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  width: 100%;
  margin-bottom: 1rem;
`;

const InputBox = styled.div`
  display: flex;
  align-items: center;
  width: 14rem;
  border: 2px solid #c3c3c3;
  border-radius: 8px;
  color: #c3c3c3;
  font-weight: bold;
  font-size: 1rem;
  padding: 0.8rem 1rem;
  cursor: pointer;
  flex: 1;
  justify-content: space-between;
`;

const Icon = styled.img`
  width: 1rem;
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

  const parseDate = (dateString) => {
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const formatToKST = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}T${String(
      date.getHours()
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

  // 날짜 변경 → API 전송 + 부모 상태 업데이트
  const handleDateChange = (newDate) => {
    if (!newDate) {
      alert("날짜를 선택해주세요!");
      return;
    }

    if (
      newDate < parseDate(lectureStartDate) ||
      newDate > parseDate(lectureEndDate)
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
          <img
            src={DateTime}
            style={{
              width: "2.5rem",
              marginLeft: "1rem",
              marginRight: "1rem",
              alignSelf: "center",
            }}
          />
          <DatePicker
            selected={date}
            onChange={handleDateChange}
            showTimeSelect
            dateFormat="yyyy년 MM월 dd일 HH:mm"
            minDate={parseDate(lectureStartDate)}
            maxDate={parseDate(lectureEndDate)}
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
