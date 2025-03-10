import { useEffect, useState, forwardRef, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import TopBar from '../../ui/TopBar';
import Calendar from "../../img/classroom/calendar.png";
import DatePicker from "react-datepicker";
import CustomTimePicker from "../../ui/CustomTimePicker";
import "../../../style/react-datepicker.css";
import api from "../../api/api";
import { UsersContext } from '../../contexts/usersContext';

export default function Create() {
  const navigate = useNavigate();
  const timeSlots = ['월', '화', '수', '목', '금', '토', '일'];
  const [isAssignmentPending, setIsAssignmentPending] = useState(false);
  const [isLecturePending, setIsLecturePending] = useState(false);
  const { user } = useContext(UsersContext);
  const [form, setForm] = useState({
    coursename: '',
    instructor: '',
    startDate: null,
    durationWeeks: 1,
    lectureDays: [],
    lectureTime: '',
    assignmentDays: [],
    assignmentTime: '',
    difficulty: 'easy',
  });
  let [titleInputCount, setTitleInputCount] = useState(form.coursename.length);
  let [instructorInputCount, setInstructorInputCount] = useState(form.instructor.length);

  useEffect(() => {
    setTitleInputCount(form.coursename.length);
  }, [form.coursename]);

  useEffect(() => {
    setInstructorInputCount(form.instructor.length);
  }, [form.instructor]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleDaySelect = (type, day) => {
  const key = type === 'lecture' ? 'lectureDays' : 'assignmentDays';
  const dayNumber = timeSlots.indexOf(day) + 1;
  setForm(prev => ({
    ...prev,
    [key]: prev[key].includes(dayNumber)
      ? prev[key].filter(d => d !== dayNumber)
      : [...prev[key], dayNumber]
  }));
 };

 const handleLectureTimeChange = (timeString) => {
  const timeOnly = timeString.split(':').slice(0, 2).join(':');
  setForm(prev => ({
    ...prev,
    lectureTime: timeOnly
  }));
};

const handleAssignmentTimeChange = (timeString) => {
  const timeOnly = timeString.split(':').slice(0, 2).join(':');
  setForm(prev => ({
    ...prev,
    assignmentTime: timeOnly
  }));
};
  
  const handleDifficultySelect = (difficulty) => {
    setForm(prev => ({ ...prev, difficulty }));
  };

  const formatTimeToServer = (timeString) => {
    if (!timeString) return null;
    return `${timeString}:00`;
  };

  const handleSubmit = async () => {
    if (!form.coursename.trim()) {
      alert('강의명을 입력해주세요.');
      return;
    }

    if (!form.instructor.trim()) {
      alert('강의자명을 입력해주세요.');
      return;
    }

    if (!form.startDate) {
      alert('커리큘럼 시작일을 선택해주세요.');
      return;
    }

    if ((form.durationWeeks % 1)) {
      alert('커리큘럼 주차는 정수로 입력해주세요.');
      return;
    }

    if (form.durationWeeks < 1 || form.durationWeeks > 12) {
      alert('커리큘럼 주차는 1~12주차까지 입력 가능해요.');
      return;
    }

    if(!isLecturePending && form.lectureDays.length === 0) {
      alert('강의 요일을 선택하세요.');
      return;
    }

    if(!isLecturePending && !form.lectureTime) {
      alert('강의 시간을 선택하세요');
      return;
    }

    if(!isAssignmentPending && form.assignmentDays.length === 0) {
      alert('과제 요일을 선택하세요.');
      return;
    }

    if(!isAssignmentPending && !form.assignmentTime) {
      alert('과제 시간을 선택하세요');
      return;
    }

    try {
      if (!user) {
        console.log('사용자 정보가 없습니다');
        return;
      }
  
      const createResponse = await api.post(`/courses/${user.userId}`);
      if (!createResponse.data.success) {
        throw new Error('강의실 생성에 실패했습니다');
      }
  
      const courseData = createResponse.data.data;
      
      const settingData  = {
        title: form.coursename,
        instructorName: form.instructor,
        startDate: form.startDate?
          `${form.startDate.getFullYear()}-${String(form.startDate.getMonth() + 1).padStart(2, '0')}-${String(form.startDate.getDate()).padStart(2, '0')}` 
          : null,
        durationWeeks: Number(form.durationWeeks),
        lectureDay: form.lectureDays,
        lectureTime: isLecturePending ? '00:00:00' : formatTimeToServer(form.lectureTime),
        assignmentDueDay: form.assignmentDays,
        assignmentDueTime: isAssignmentPending ? '00:00:00' : formatTimeToServer(form.assignmentTime),
        difficultyLevel: form.difficulty.toUpperCase()
      };

      if ((!isLecturePending && !settingData.lectureTime) || 
          (!isAssignmentPending && !settingData.assignmentDueTime)) {
        throw new Error('시간 형식이 올바르지 않습니다');
      }
  
      const settingResponse = await api.put(`/courses/${courseData.courseId}/${user.userId}/setting`, 
        settingData
      );

      if (settingResponse.data.success) {
        console.log(settingResponse.data);
      } else {
        throw new Error('강의실 설정에 실패했습니다');
      }
      
      navigate(`/class/${courseData.courseId}/overview/info`, {
        state: { entrycode: courseData.entryCode }
      });
  
    } catch (error) {
      console.error('강의실 생성 실패:', error);
      alert(error.message || '강의실 생성 중 오류가 발생했습니다.');
    }
  };

  const onTitleInputHandler = (e) => {
    setTitleInputCount(e.target.value.length);
  };

  const onInstructorInputHandler = (e) => {
    setInstructorInputCount(e.target.value.length);
  };

  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <InputGroup onClick={onClick}> 
      <IconInput
        ref={ref}
        value={value}
        placeholder="커리큘럼 시작을 설정해주세요."
        readOnly
        style={{width: '329px'}}
      />
      <CalendarIcon>
        <img src={Calendar} style={{width: 18}} alt="캘린더" />
      </CalendarIcon>
    </InputGroup>
  ));

  return (
    <>
      <TopBar />
      <Container>
        <Section>
          <Title style={{marginTop: '6px'}}>STEP 1. 강의실을 만들어볼까요?</Title>
          
          <FormGroup>
            <FormItem>
              <Label>
                강의명
                <Required>*</Required>
                <Text>{titleInputCount}</Text>
                <Text>/30 자</Text>
              </Label>
              <FormInput
                type="text"
                name="coursename"
                maxlength='30'
                placeholder="30자 이내로 설정해주세요."
                value={form.coursename}
                onChange={(e) => {handleFormChange(e); onTitleInputHandler(e);}}
                style={{width: '329px'}}
                autoComplete='off'
              />
            </FormItem>

            <FormItem>
              <Label>
                강의자명
                <Required>*</Required>
                <Text>{instructorInputCount}</Text>
                <Text>/5 자</Text>
              </Label>
              <FormInput
                type="text"
                name="instructor"
                maxlength='5'
                placeholder="ex. 김잇다"
                value={form.instructor}
                onChange={(e) => {handleFormChange(e); onInstructorInputHandler(e);}}
                style={{width: '165px '}}
                autoComplete='off'
              />
            </FormItem>
          </FormGroup>
        </Section>

        <Section>
          <Title>STEP 2. 수강생이 얼마나 강의를 들어야 하나요?</Title>
          
          <FormGroup>
            <FormItem>
              <Label>
                커리큘럼 시작
                <Required>*</Required>
              </Label>
              <DatePicker
                selected={form.startDate}
                onChange={(date) => {
                  setForm(prev => ({
                    ...prev,
                    startDate: date
                  }));
                }}
                minDate={new Date()}
                customInput={<CustomInput />}
                dateFormat="yyyy-MM-dd"
                popperProps={{
                  placement: 'bottom-start',
                }}
              />
            </FormItem>

            <FormItem>
              <Label>
                커리큘럼 주차
                <Required>*</Required>
              </Label>
              <CuliculumGroup>
                <FormInput
                  type="number"
                  min="1"
                  max="12"
                  name="durationWeeks"
                  placeholder="숫자를 입력해주세요"
                  value={form.durationWeeks}
                  onChange={handleFormChange}
                  style={{width: '165px'}}
                  
                />
                <Label style={{marginTop: '0px', marginLeft: '5px'}}>주</Label>
              </CuliculumGroup>
              <HelpText>1~12주차까지 입력가능해요.</HelpText>
            </FormItem>

            <FormItem>
              <Label>강의 업로드 시간</Label>
              <HalfGroup>
                <TimeGroup>
                <DayButtonGroup>
                  {timeSlots.map((day) => (
                    <DayButton 
                      key={day}
                      active={!isLecturePending && form.lectureDays.includes(timeSlots.indexOf(day) + 1)}
                      onClick={() => !isLecturePending && handleDaySelect('lecture', day)}
                    >
                      {day}
                    </DayButton>
                  ))}
                  </DayButtonGroup>
                  { !isLecturePending && <HelpText>복수 선택이 가능해요!</HelpText>}
                </TimeGroup>
                
                <TimeGroup>
                    <TimePickerWrapper>
                      <CustomTimePicker
                        value={isLecturePending ? new Date(2000, 0, 1, 0, 0, 0) : 
                              (form.lectureTime ? new Date(`2000-01-01T${form.lectureTime}`) : null)}
                        onChange={(date) => {
                          if (date) {
                            const hours = String(date.getHours()).padStart(2, '0');
                            const minutes = String(date.getMinutes()).padStart(2, '0');
                            const timeString = `${hours}:${minutes}`;
                            handleLectureTimeChange(timeString);
                          }
                        }}
                        disabled={isLecturePending}
                        placeholder="강의 시간을 설정해주세요."
                      />
                      </TimePickerWrapper>
                      {form.lectureTime && !isLecturePending && 
                        <HelpText style={{color: 'var(--guide-green-color)'}}>강의 시간이 설정되었어요!</HelpText>
                      }
                </TimeGroup>

                <TimeGroup>
                  {/* <RadioButton 
                    active={!isLecturePending}
                    onClick={() => {
                      setIsLecturePending(!isLecturePending)
                      if (!isLecturePending) {
                        setForm(prev => ({ ...prev, lectureDays: [], lectureTime: '' }));
                      }
                    }}
                  >
                    정해지지 않았어요
                  </RadioButton> */}
                </TimeGroup>
              </HalfGroup>
            </FormItem>

            <FormItem>
              <Label>과제 마감 시간</Label>
              <HalfGroup>
                <TimeGroup>
                  <DayButtonGroup>
                  {timeSlots.map((day) => (
                    <DayButton 
                      key={day}
                      active={!isAssignmentPending && form.assignmentDays.includes(timeSlots.indexOf(day) + 1)}
                      onClick={() => !isAssignmentPending && handleDaySelect('assignment', day)}
                    >
                      {day}
                    </DayButton>
                  ))}
                  </DayButtonGroup>
                  {!isAssignmentPending && 
                  <HelpText>복수 선택이 가능해요!</HelpText>
                  }
                </TimeGroup>

                <TimeGroup>
                    <TimePickerWrapper>
                      <CustomTimePicker
                        value={isAssignmentPending ? new Date(2000, 0, 1, 0, 0, 0) : 
                              (form.assignmentTime ? new Date(`2000-01-01T${form.assignmentTime}`) : null)}
                        onChange={(date) => {
                          if (date) {
                            const hours = String(date.getHours()).padStart(2, '0');
                            const minutes = String(date.getMinutes()).padStart(2, '0');
                            const timeString = `${hours}:${minutes}`;
                            handleAssignmentTimeChange(timeString);
                          }
                        }}
                        disabled={isAssignmentPending}
                        placeholder="과제 시간을 설정해주세요."
                      />
                    </TimePickerWrapper>
                    {form.assignmentTime && !isAssignmentPending &&
                   <HelpText style={{color: 'var(--guide-green-color)'}}>과제 시간이 설정되었어요!</HelpText>
                   }
                </TimeGroup> 

                <TimeGroup>
                  {/* <RadioButton 
                    active={!isAssignmentPending}
                    onClick={() => {
                      setIsAssignmentPending(!isAssignmentPending)
                      if (!isAssignmentPending) {
                        setForm(prev => ({ ...prev, assignmentDays: [], assignmentTime: '' }));
                      }
                    }}
                  >
                    정해지지 않았어요
                  </RadioButton> */}
                </TimeGroup>
              </HalfGroup>
            </FormItem>
          </FormGroup>
        </Section>

        <Section style={{borderBottom: 'none'}}>
          <Title>STEP 3. 수강생에게 강좌를 어떻게 공개하실 건가요?</Title>
          <FormGroup>
            <FormItem>
            <RowContainer>
            <Label style={{marginRight: '50px'}}>수업 난이도<Required>*</Required></Label>
              <ButtonGroup>
                {['easy', 'medium', 'hard'].map((level) => (
                  <LevelButton
                    key={level}
                    active={form.difficulty === level}
                    onClick={() => handleDifficultySelect(level)}
                  >
                    {level === 'easy' ? '쉬움' : level === 'medium' ? '보통' : '어려움'}
                  </LevelButton>
                ))}
              </ButtonGroup>
            </RowContainer>
              {form.difficulty === 'easy' && <LevelText style={{color: 'var(--guide-gray-color)'}}>입문자를 위한 쉬운 개념 강의!</LevelText> }
              {form.difficulty === 'medium' && <LevelText style={{color: 'var(--guide-gray-color)'}}>개념을 응용하고 실전 활용 능력을 키우는 강의!</LevelText> }
              {form.difficulty === 'hard' && <LevelText style={{color: 'var(--guide-gray-color)'}}>실무에 적용할 수 있는 전문 강의!</LevelText> }
            </FormItem>
          </FormGroup>
        </Section>
        <CreateButton onClick={handleSubmit}>강의실 만들기</CreateButton>
      </Container>
    </>
  );
}

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const RadioButton = styled.button`
  padding: 8px 20px;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  background-color: ${props => props.active ? '#F6F6F6' : '#FF4747'};
  color: ${props => props.active ? '#909090' : '#FFFFFF'};

  @media (max-width: 900px) { 
    width: 289px;
  }
`;

const LevelButton = styled.button`
  border: none;
  border-radius: 10px;
  font-size: 15px;
  background-color: ${props => props.active ? '#FF4747' : '#EEEEEE '};
  color: ${props => props.active ? '#FFFFFF' : '#909090'};
  padding: 6px 18px;
  border: none;
  cursor: pointer;
  margin-bottom: 8px;

  @media (max-width: 900px) { 
     padding: 6px 12px;
  }
`;

const CreateButton = styled.button`
  border: none;
  cursor: pointer;
  width: 100%;
  padding: 10px 0;
  background-color: #FF4747;
  color: white;
  font-size: 17px;
  font-weight: 500;
  border-radius: 10px;
`;

const Container = styled.div`
  margin: 41px 61px;
  padding: 24px 30px;
  background-color: white;
  border-radius: 20px;

  @media (max-width: 600px) {
    margin: 31px;
  }
`;

const Section = styled.div`
  width: 100%;
  padding-bottom: 30px;
  border-bottom: 2px solid #C3C3C3;
`;

const Title = styled.div`
  font-size: 21px;
  font-weight: 700;
  margin-top: 30px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormItem = styled.div`
  margin-bottom: 15px;
  width: 100%;
`;

const Label = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 8px;
  color: #000000;
  font-size: 17px;
  font-weight: 500;
  margin-top: 20px;
  align-items: flex-end;
`;

const Required = styled.span`
  position: relative;
  color: #FF4747;
  font-weight: 800;
  top: -5px;
  left: 0px;
  margin-right: 5px;
`;

const FormInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  font-size: 13px;
  padding: 8px 12px;
  border: 2px solid #C3C3C3;
  border-radius: 10px;
`;

const IconInput = styled.input`
  box-sizing: border-box;
  font-size: 13px;
  padding: 8px 32px 8px 12px;
  border: 2px solid #C3C3C3;
  border-radius: 10px;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const HelpText = styled.div`
  height: 13px;
  min-height: 13px;
  color: #FF4747;
  font-size: 12px;
  font-weight: 400;
  margin-top: 4px;
  margin-left: 10px;
`;

const LevelText = styled.div`
  height: 13px;
  min-height: 13px;
  font-size: 12px;
  font-weight: 400;
  margin-top: 4px;
  margin-left: 150px;

  @media (max-width: 800px) { 
    margin-left: 0px;
  }
`

const RowContainer = styled.div`
  display: flex;
  align-items: baseline;
  
  @media (max-width: 800px) { 
      flex-direction: column;
      padding: 6px 10px;
    }
`;

const DayButtonGroup = styled.div`
  display: flex;
  gap: 5px;
  margin-right: 10px;
`;

const DayButton = styled.button`
  width: 2rem;
  height: 2rem; 
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: ${props => props.active ? '#FF4747' : '#D9D9D9'};
  color: ${props => props.active ? '#FFFFFF' : '#909090'};
`;

const CalendarIcon = styled.span`
  top: 50%;
  transform: translateY(-50%);
  transform: translateX(-250%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TimeGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const TimePickerWrapper = styled.div`
  margin-right: 20px;
  display: flex;
  align-items: center;
  position: relative;

  @media (max-width: 900px) { 
    margin-right: 0px;
  }
`

const CuliculumGroup = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
`;

const HalfGroup = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;

  @media (max-width: 900px) { 
    flex-direction: column;
    gap: 15px;
  }
`;

const Text = styled.div`
  font-size: 13px;
  color: var(--main-color);
`
