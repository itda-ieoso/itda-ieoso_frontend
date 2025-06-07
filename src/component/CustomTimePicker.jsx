import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Clock from "../img/classroom/clock.png";
import { debounce } from "lodash";

const BUTTON_HEIGHT = 40;
const MERIDIEM_ITEMS = ["오전", "오후"];
const HOUR_ITEMS = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, "0"),
);
const MINUTE_ITEMS = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0"),
);

const CustomTimePicker = ({
  value = new Date(),
  onChange,
  width = 289,
  disabled = false,
  placeholder = "시간을 설정해주세요.",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const scrollViewsRef = useRef([null, null, null]);
  const containerRef = useRef(null);
  const [selectedTime, setSelectedTime] = useState(
    value || new Date(2000, 0, 1, 0, 0, 0),
  );
  const [currentMeridiem, setCurrentMeridiem] = useState(
    value ? (value.getHours() >= 12 ? "오후" : "오전") : "오전",
  );
  const wheelTimeoutRef = useRef(null);
  const lastWheelTime = useRef(0);

  const formatTimeString = (date) => {
    if (!date) return placeholder;
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const meridiem = hours >= 12 ? "오후" : "오전";
    const hour12 =
      hours % 12 === 0 ? "12" : String(hours % 12).padStart(2, "0");
    return `${meridiem} ${hour12}:${minutes}`;
  };

  useEffect(() => {
    if (disabled) setIsOpen(false);
  }, [disabled]);

  const [inputTime, setInputTime] = useState(
    value ? formatTimeString(value) : placeholder,
  );

  useEffect(() => {
    if (!value) {
      const defaultTime = new Date(2000, 0, 1, 0, 0, 0);
      setSelectedTime(defaultTime);
      setCurrentMeridiem("오전");
      setInputTime(formatTimeString(defaultTime));
      return;
    }

    setSelectedTime(value);
    setCurrentMeridiem(value.getHours() >= 12 ? "오후" : "오전");
    setInputTime(formatTimeString(value));
  }, [value, placeholder]);

  useEffect(() => {
    setInputTime(formatTimeString(selectedTime));
  }, [selectedTime]);

  useEffect(() => {
    if (!isOpen) return;

    const initializeScrollPositions = () => {
      timeColumns.forEach(({ key }, index) => {
        if (!scrollViewsRef.current[index]) return;

        const hours = selectedTime.getHours();
        const minutes = selectedTime.getMinutes();
        const hour = String(hours % 12 || 12).padStart(2, "0");

        let scrollPosition = 0;
        if (key === "meridiem") {
          scrollPosition =
            MERIDIEM_ITEMS.indexOf(currentMeridiem) * BUTTON_HEIGHT;
        } else if (key === "hour") {
          scrollPosition =
            HOUR_ITEMS.findIndex((h) => h === hour) * BUTTON_HEIGHT;
        } else {
          scrollPosition = minutes * BUTTON_HEIGHT;
        }

        scrollViewsRef.current[index].scrollTo({
          top: scrollPosition,
          behavior: "instant",
        });
      });
    };

    requestAnimationFrame(initializeScrollPositions);
  }, [isOpen, selectedTime, currentMeridiem]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        event.target.closest(".time-picker-container") ||
        event.target.closest(".time-button")
      ) {
        return;
      }

      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        if (selectedTime) {
          onChange(selectedTime);
        }
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, selectedTime, onChange]);

  const moveOneStep = (index, direction) => {
    const scrollView = scrollViewsRef.current[index];
    if (!scrollView) return;

    const currentPosition = scrollView.scrollTop;
    const maxScroll = scrollView.scrollHeight - scrollView.clientHeight;
    const targetPosition = currentPosition + direction * BUTTON_HEIGHT;

    // 범위를 벗어나지 않도록 체크
    if (targetPosition < 0 || targetPosition > maxScroll) return;

    scrollView.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });

    const key = timeColumns[index].key;
    handleScrollEnd(key, index);
  };

  const handleTimeButtonClick = (columnIndex, item) => {
    const scrollView = scrollViewsRef.current[columnIndex];
    if (!scrollView) return;

    const key = timeColumns[columnIndex].key;
    const itemIndex = timeColumns[columnIndex].items.indexOf(item);
    const targetPosition = itemIndex * BUTTON_HEIGHT;

    scrollView.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });

    const newDate = new Date(selectedTime);

    if (key === "meridiem") {
      const currentHours = newDate.getHours();
      if (item === "오후" && currentHours < 12) {
        newDate.setHours(currentHours === 0 ? 12 : currentHours + 12);
      } else if (item === "오전" && currentHours >= 12) {
        newDate.setHours(currentHours === 12 ? 0 : currentHours - 12);
      }
      setCurrentMeridiem(item);
    } else if (key === "hour") {
      const newHour = parseInt(item);
      const isPM = currentMeridiem === "오후";

      if (isPM) {
        newDate.setHours(newHour === 12 ? 12 : newHour + 12);
      } else {
        newDate.setHours(newHour === 12 ? 0 : newHour);
      }
    } else if (key === "minute") {
      const newMinute = parseInt(item);
      newDate.setMinutes(newMinute);
    }

    setSelectedTime(newDate);
    onChange(newDate);
  };

  const handleWheelEvent = (e, index) => {
    //e.preventDefault();

    const now = Date.now();
    if (now - lastWheelTime.current < 200) {
      // 너무 빠른 연속 스크롤 방지
      return;
    }
    lastWheelTime.current = now;

    const direction = e.deltaY > 0 ? 1 : -1;
    moveOneStep(index, direction);
  };

  const handleScrollEnd = debounce((key, index) => {
    if (!scrollViewsRef.current[index]) return;

    const scrollView = scrollViewsRef.current[index];
    const scrollTop = scrollView.scrollTop;
    const itemIndex = Math.round(scrollTop / BUTTON_HEIGHT);

    const newDate = new Date(selectedTime);

    if (key === "meridiem") {
      const selectedMeridiem = MERIDIEM_ITEMS[itemIndex];
      const currentHours = newDate.getHours();

      setCurrentMeridiem(selectedMeridiem);

      if (selectedMeridiem === "오후" && currentHours < 12) {
        newDate.setHours(currentHours === 0 ? 12 : currentHours + 12);
      } else if (selectedMeridiem === "오전" && currentHours >= 12) {
        newDate.setHours(currentHours === 12 ? 0 : currentHours - 12);
      }
    } else if (key === "hour") {
      const newHour = parseInt(HOUR_ITEMS[itemIndex]);
      const isPM = currentMeridiem === "오후";

      if (isPM) {
        newDate.setHours(newHour === 12 ? 12 : newHour + 12);
      } else {
        newDate.setHours(newHour === 12 ? 0 : newHour);
      }
    } else if (key === "minute") {
      const newMinute = parseInt(MINUTE_ITEMS[itemIndex]);
      newDate.setMinutes(newMinute);
    }

    setSelectedTime(newDate);
    onChange(newDate);
  }, 100);

  const timeColumns = [
    { key: "meridiem", items: MERIDIEM_ITEMS },
    { key: "hour", items: HOUR_ITEMS },
    { key: "minute", items: MINUTE_ITEMS },
  ];

  return (
    <Container width={width} ref={containerRef}>
      <InputDisplay onClick={() => !disabled && setIsOpen(!isOpen)}>
        <TimeText>{selectedTime ? inputTime : placeholder}</TimeText>
        <ClockIcon>
          <img src={Clock} style={{ width: 18 }} alt="캘린더" />
        </ClockIcon>
      </InputDisplay>

      {isOpen && (
        <DropdownContainer>
          <TimePickerContainer className="time-picker-container">
            {timeColumns.map(({ key, items }, columnIndex) => (
              <Column key={key}>
                <ScrollView
                  ref={(el) => {
                    if (el) {
                      scrollViewsRef.current[columnIndex] = el;
                    }
                  }}
                  onScroll={(e) => {
                    if (wheelTimeoutRef.current) {
                      clearTimeout(wheelTimeoutRef.current);
                    }
                    wheelTimeoutRef.current = setTimeout(() => {
                      handleScrollEnd(key, columnIndex);
                    }, 150);
                  }}
                  onWheel={(e) => handleWheelEvent(e, columnIndex)}
                >
                  <Padding />
                  {items.map((item) => (
                    <TimeButton
                      key={item}
                      className="time-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTimeButtonClick(columnIndex, item);
                      }}
                    >
                      {item}
                    </TimeButton>
                  ))}
                  <Padding />
                </ScrollView>
              </Column>
            ))}
            <Selection />
          </TimePickerContainer>
        </DropdownContainer>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 200px;
`;

const InputDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border: 2px solid #c3c3c3;
  border-radius: 10px;
  background: white;
  cursor: pointer;
`;

const TimeText = styled.span`
  font-size: 13px;
  color: #333;
`;

const Padding = styled.div`
  height: ${BUTTON_HEIGHT}px;
`;

const DropdownContainer = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 50;
`;

const TimePickerContainer = styled.div`
  display: flex;
  height: ${BUTTON_HEIGHT * 3}px;
  border: 2px solid #c3c3c3;
  border-radius: 10px;
  position: relative;
  background: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const Column = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
`;

const ScrollView = styled.div`
  height: 100%;
  overflow-y: scroll;
  scroll-snap-type: y proximity;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;

  & > * {
    scroll-snap-align: center;
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;

const TimeButton = styled.div`
  height: ${BUTTON_HEIGHT}px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  color: #333;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`;

const Selection = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: ${BUTTON_HEIGHT}px;
  transform: translateY(-50%);
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  background: rgba(0, 0, 0, 0.02);
  pointer-events: none;
`;

const ClockIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default CustomTimePicker;
