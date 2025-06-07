import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Section } from "../../../component/class/ClassLayout.jsx";
import profileIcon from "../../../img/icon/usericon.svg";
import api from "../../../api/api.js";
import styled from "styled-components";

const Main = styled.main`
  flex: 1;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  position: relative;
  width: 100%;
`;

const HeaderWrap = styled.div`
  margin: 1vh 0;
`;

const HeaderTitleRow = styled.div`
  display: flex;
  align-items: baseline;
  margin-left: 2.5vh;

  @media (max-width: 376px) {
    margin-left: 1.8vh;
  }
`;

const HeaderTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: var(--black-color);

  @media (max-width: 1024px) {
    font-size: 21px;
  }

  @media (max-width: 480px) {
    font-size: 15px;
  }

  @media (max-width: 376px) {
    font-size: 13px;
    font-weight: 680;
  }
`;

const HeaderTime = styled.p`
  color: var(--darkgrey-color);
  font-size: 15px;
  margin-left: 1.5vh;
  font-weight: 500;

  @media (max-width: 1024px) {
    font-size: 14.5px;
    margin-left: 1vh;
  }

  @media (max-width: 480px) {
    font-size: 10px;
    margin-left: 1.8vh;
  }

  @media (max-width: 376px) {
    font-size: 9px;
    margin-left: 1vh;
  }
`;

const SectionWrap = styled.div`
  padding: 2vh 3.5vh;

  @media (max-width: 1024px) {
    padding: 1.3vh 1.2vh;
  }

  @media (max-width: 480px) {
    padding: 3.5vh 3vh;
  }

  @media (max-width: 376px) {
    padding: 2.8vh 2vh;
  }
`;

const ScrollWrapper = styled.div`
  width: 100%;
  position: relative;
  overflow-x: hidden;
`;

const ScrollBar = styled.div`
  margin-top: 1rem;
  height: 8px;
  width: 100%;
  background: #f1f1f1;
  border-radius: 10px;
  overflow: hidden;

  @media (max-width: 1024px) {
    height: 6.5px;
  }

  @media (max-width: 480px) {
    margin-top: 1.8vh;
    height: 4px;
  }
`;

const ScrollThumb = styled.div`
  height: 100%;
  background: #c4c4c4;
  border-radius: 10px;
  cursor: pointer;
  position: relative;
  transition: background-color 0.3s ease;
`;

const ProfileImg = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  vertical-align: middle;
  margin-right: 8px;

  @media (max-width: 768px) {
    width: 22.5px;
    height: 22.5px;
  }

  @media (max-width: 480px) {
    width: 3.5vh;
  }

  @media (max-width: 376px) {
    width: 2.1vh;
    margin-right: 0.6vh;
  }
`;

const Table = styled.table`
  width: 100%;
  min-width: 1600px;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 17.5px;

  @media (max-width: 1024px) {
    font-size: 14.5px;
  }
  @media (max-width: 768px) {
    font-size: 12px;
  }

  @media (max-width: 480px) {
    font-size: 8.5px;
  }

  @media (max-width: 376px) {
    font-size: 8.3px;
    font-weight: 500;
  }
`;

const Th = styled.th`
  padding: 2vh 2.3vh;
  white-space: nowrap;
  font-size: 18.5px;
  font-weight: 700;
  text-align: center;

  @media (max-width: 1024px) {
    padding: 0.45vh 1vh;
    font-size: 16px;
  }

  @media (max-width: 768px) {
    font-size: 13.3px;
    font-weight: 600;
  }

  @media (max-width: 480px) {
    font-size: 9px;
    padding: 0.2vh 5vh;
  }
  @media (max-width: 376px) {
    font-size: 8.5px;
    padding: 0.2vh 5vh;
  }
`;

const ThName = styled(Th)`
  min-width: 20vh;
  text-align: left;
  padding-left: 5vh;

  @media (max-width: 1024px) {
    min-width: 8.5vh;
  }

  @media (max-width: 480px) {
    min-width: 7vh;
  }

  @media (max-width: 376px) {
    min-width: 3vh;
    padding-left: 3.4vh;
  }
`;

const Td = styled.td`
  padding: 1vh 2vh;
  vertical-align: middle;
  white-space: nowrap;
  text-align: center;

  @media (max-width: 1024px) {
    padding: 0.3vh 1.3vh;
  }

  @media (max-width: 768px) {
    padding: 0.3vh 1.2vh;
  }

  @media (max-width: 480px) {
    padding: 1vh 0.3vh;
  }

  @media (max-width: 376px) {
    padding: 0.6vh 0.3vh;
  }
`;

const TdName = styled(Td)`
  text-align: left;
  padding-left: 2vh;
  font-weight: 600;

  @media (max-width: 376px) {
    padding-left: 0.8vh;
  }
`;

const Row = styled.tr`
  background-color: white;
  cursor: pointer;
`;

const RowAlt = styled(Row)`
  background-color: #ffffff;
`;

const RowActive = styled(Row)`
  background-color: #f6f7f9;
  transition: background-color 0.2s ease-in-out;
`;

const Badge = styled.div`
  background: #fdfdfd;
  border: 1.5px solid #e6e6e6;
  border-radius: 14px;
  padding: 1vh 1.4vh;
  display: inline-block;
  margin: 0.3vh 0;
  max-width: 20vh;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 1024px) {
    border-radius: 10px;
    padding: 0.55vh 1vh;
    max-width: 10vh;
    margin: 0.15vh 0;
  }
  @media (max-width: 768px) {
    border-radius: 8px;
    padding: 0.45vh 0.9vh;
    font-size: 11px;
  }

  @media (max-width: 480px) {
    max-width: 16vh;
    padding: 0.8vh 1.3vh;
    border: 1.3px solid #e6e6e6;
    border-radius: 6px;
    font-size: 8px;
  }

  @media (max-width: 376px) {
    max-width: 9.5vh;
    padding: 0.6vh 1vh;
    border-radius: 5px;
  }
`;

const BadgeGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ClassStudents = () => {
  const { courseId } = useParams();
  const [currentTime, setCurrentTime] = useState("");
  const [rowData, setRowData] = useState([]);
  const navigate = useNavigate();

  const tableRef = useRef(null);
  const scrollbarThumbRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [activeRow, setActiveRow] = useState(null);

  useEffect(() => {
    const now = new Date();
    const formatted = `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}`;
    setCurrentTime(
      `${formatted} ${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`,
    );
  }, []);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await api.get(
          `/statistics/courses/${courseId}/assignments/submissions`,
        );
        if (res.data.success) {
          const data = res.data.data;
          const grouped = {};
          const titleMap = {};

          data.forEach((assignment) => {
            titleMap[assignment.assignmentId] =
              assignment.assignmentTitle || "과제 제목을 입력하세요.";
            assignment.studentResults.forEach((result) => {
              if (!grouped[result.userId]) {
                grouped[result.userId] = {
                  userId: result.userId,
                  name: result.studentName,
                };
              }
              grouped[result.userId][assignment.assignmentId] = {
                files: result.files || [],
                textContent: result.textContent || null,
              };
            });
          });

          const processed = Object.values(grouped).map((student) => ({
            ...student,
            assignments: Object.keys(titleMap).map((id) => ({
              title: titleMap[id],
              value: student[id] || { files: [], textContent: null },
            })),
          }));

          setRowData(processed);
        }
      } catch (err) {
        console.error("불러오기 실패:", err);
      }
    };

    fetchAssignments();
  }, [courseId]);

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

  const handleMouseUp = () => {
    isDragging.current = false;
    document.body.style.userSelect = "auto";
  };

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.clientX;
    scrollLeft.current = tableRef.current.scrollLeft;
    document.body.style.userSelect = "none";
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

  useEffect(() => {
    const tableEl = tableRef.current;

    tableEl.addEventListener("scroll", handleScroll);
    handleScroll();

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      tableEl.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <Main>
      <HeaderWrap>
        <HeaderTitleRow>
          <HeaderTitle>전체 과제 보기</HeaderTitle>
          <HeaderTime>{currentTime} 기준</HeaderTime>
        </HeaderTitleRow>
        <SectionWrap as={Section}>
          <ScrollWrapper>
            <TableWrapper ref={tableRef}>
              <Table>
                <thead>
                  <tr>
                    <ThName>이름</ThName>
                    {rowData[0]?.assignments.map((a, i) => (
                      <Th key={i}>{a.title}</Th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rowData.map((student, i) => {
                    const isActive = activeRow === i || hoveredRow === i;
                    const RowComponent = isActive
                      ? RowActive
                      : i % 2 === 1
                        ? RowAlt
                        : Row;
                    return (
                      <RowComponent
                        key={i}
                        onMouseEnter={() => setHoveredRow(i)}
                        onMouseLeave={() => setHoveredRow(null)}
                        onClick={() => {
                          setActiveRow(i);
                          navigate(
                            `/class/${courseId}/admin/students/${student.userId}`,
                          );
                        }}
                      >
                        <TdName>
                          <ProfileImg src={profileIcon} alt="프로필" />
                          {student.name}
                        </TdName>
                        {student.assignments.map((a, j) => (
                          <Td key={j}>
                            <BadgeGroup>
                              {a.value.files.length > 0 &&
                                a.value.files.map((file, k) => (
                                  <Badge
                                    key={k}
                                    style={{ color: "var(--main-color)" }}
                                  >
                                    {file.fileName}
                                  </Badge>
                                ))}
                              {a.value.textContent && (
                                <Badge style={{ color: "black" }}>
                                  {a.value.textContent}
                                </Badge>
                              )}
                            </BadgeGroup>
                          </Td>
                        ))}
                      </RowComponent>
                    );
                  })}
                </tbody>
              </Table>
            </TableWrapper>
            <ScrollBar>
              <ScrollThumb
                ref={scrollbarThumbRef}
                onMouseDown={handleMouseDown}
              />
            </ScrollBar>
          </ScrollWrapper>
        </SectionWrap>
      </HeaderWrap>
    </Main>
  );
};

export default ClassStudents;
