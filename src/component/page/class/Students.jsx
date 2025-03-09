import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminTopBar from "../../ui/class/AdminTopBar";
import { Section } from "../../ui/class/ClassLayout";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { themeQuartz } from "ag-grid-community";
import assignmentIcon from "../../img/admin/student_assignment.svg";
import api from "../../api/api";

const ClassStudents = () => {
  const { courseId } = useParams();
  const [currentTime, setCurrentTime] = useState("");
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const navigate = useNavigate();

  const [hoveredRowIndex, setHoveredRowIndex] = useState(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = `${now.getFullYear()}.${
        now.getMonth() + 1
      }.${now.getDate()}`;
      setCurrentTime(
        `${formattedTime} ${now.getHours()}:${String(now.getMinutes()).padStart(
          2,
          "0"
        )}`
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await api.get(
          `/statistics/courses/${courseId}/assignments/submissions`
        );

        if (response.data.success) {
          processAssignmentData(response.data.data);
        } else {
          console.error("API 응답 오류:", response.data.message);
        }
      } catch (error) {
        console.error("과제 데이터를 불러오는 중 오류 발생:", error);
      }
    };

    fetchAssignments();
  }, [courseId]);

  const processAssignmentData = (assignments) => {
    const groupedData = {}; // 학생별 데이터 저장
    const assignmentMap = {}; // assignmentId -> assignmentTitle 매핑

    assignments.forEach((assignment) => {
      assignmentMap[assignment.assignmentId] = assignment.assignmentTitle;

      assignment.studentResults.forEach((result) => {
        // 학생(userId) 기준으로 그룹핑
        if (!groupedData[result.userId]) {
          groupedData[result.userId] = {
            name: result.studentName,
            userId: result.userId,
          };
        }

        // assignmentId만 사용하여 구분
        groupedData[result.userId][assignment.assignmentId] = {
          files: result.files || [],
          textContent: result.textContent || null,
        };
      });
    });

    setRowData(Object.values(groupedData));

    // 컬럼 정의 수정 (assignmentId를 field로 사용)
    const assignmentIds = assignments.map((a) => a.assignmentId);
    setColumnDefs([
      {
        headerName: "이름",
        field: "name",
        width: 120,
        cellRenderer: StudentNameRenderer,
        cellStyle: { whiteSpace: "normal" }, // 자동 줄바꿈 허용
        autoHeight: true,
        cellClassRules: {
          "hover-highlight": () => true, // 항상 적용
        },
      },
      ...assignmentIds.map((id) => ({
        headerName: assignmentMap[id], // UI에는 assignmentTitle 표시
        field: id.toString(), // assignmentId를 field로 사용
        cellRenderer: AssignmentIconRenderer,
        cellStyle: { whiteSpace: "normal" }, // 자동 줄바꿈 허용
        autoHeight: true,
      })),
    ]);
  };

  const getRowHeight = (params) => {
    let maxLines = 1; // 기본 한 줄

    Object.values(params.data).forEach((cellData) => {
      if (cellData && cellData.files) {
        maxLines = Math.max(
          maxLines,
          cellData.files.length + (cellData.textContent ? 1 : 0)
        );
      }
    });

    return 20 + maxLines * 10; // 기본 40px + (라인 수에 따라 높이 증가)
  };

  const StudentNameRenderer = ({ data }) => {
    return (
      <div
        style={{
          padding: "1.7vh 0vh",
          cursor: "pointer",
        }}
        onClick={() =>
          navigate(`/class/${courseId}/admin/students/${data.userId}`)
        }
      >
        <span style={{ color: "black" }}>{data.name}</span>
      </div>
    );
  };

  // 파일 제출 여부에 따라 렌더링
  const AssignmentIconRenderer = ({ value }) => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0vh",
          padding: "1.7vh 0vh",
        }}
      >
        {/* 파일 제출 */}
        {value.files.length > 0 &&
          value.files.map((file, index) => (
            <a
              key={index}
              download
              style={{
                color: "var(--main-color)",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "1vh",
              }}
              title={file.fileName}
            >
              <img
                src={assignmentIcon}
                alt="Assignment"
                width="30"
                height="30"
              />
              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "block",
                }}
              >
                {file.fileName}
              </span>
            </a>
          ))}

        {/* 텍스트 제출 */}
        {value.textContent && value.textContent !== "null" ? (
          <div
            style={{
              maxWidth: "100%",
            }}
          >
            <TruncatedText content={value.textContent} />
          </div>
        ) : null}
      </div>
    );
  };

  const TruncatedText = ({ content }) => {
    return (
      <div
        style={{
          display: "block",
          maxWidth: "100%",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        title={content} // 마우스 호버 시 전체 텍스트 표시
      >
        {content}
      </div>
    );
  };

  const myTheme = themeQuartz.withParams({
    spacing: 2,
    backgroundColor: "rgb(241, 247, 255)",
    headerBackgroundColor: "rgb(228, 237, 250)",
  });

  return (
    <main style={{ flex: 1, borderRadius: "8px" }}>
      <AdminTopBar />
      <div style={{ margin: "1vh 0vh" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            marginLeft: "2.5vh",
          }}
        >
          <h3
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "var(--black-color)",
            }}
          >
            학생별 제출 현황
          </h3>
          <p
            style={{
              color: "var(--darkgrey-color)",
              fontSize: "15px",
              marginLeft: "1.5vh",
              fontWeight: "500",
            }}
          >
            {currentTime} 기준
          </p>
        </div>
        <Section style={{ padding: "3vh 6vh" }}>
          <style>
            {`
              .ag-theme-alpine .ag-header-cell,
              .ag-theme-alpine .ag-cell {
                border-right: 1px solid #d1d1d1; 
              }

              .ag-theme-alpine .ag-row {
                border-bottom: 1px solid #d1d1d1;
              }

              .ag-theme-alpine .ag-header {
                border-bottom: 2px solid #d1d1d1; 
              }

              .ag-theme-alpine .ag-root {
                border: 1px solid #d1d1d1; 
              }

              .ag-header-cell-left {
                text-align: left;
                padding-left: 10px;
                
              }
              
          
            `}
          </style>
          <div
            className={`ag-theme-alpine ${myTheme}`}
            style={{
              "--ag-header-background-color": "var(--grey-color)",
              "--ag-header-foreground-color": "black",
              "--ag-row-hover-color": "var(--pink-color)",
              "--ag-font-size": "1.63vh",
              "--ag-border-radius": "13px",
              width: "100%",
              margin: "20px 0",
              borderRadius: "8px",
              overflowX: "auto",
            }}
          >
            <AgGridReact
              modules={[ClientSideRowModelModule]}
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={{
                sortable: true,
                resizable: true,
              }}
              domLayout="autoHeight"
              getRowHeight={getRowHeight}
              pagination={true}
              paginationPageSize={500}
              paginationPageSizeSelector={[200, 500, 1000]}
              suppressPaginationPanel={true}
              onRowClicked={(event) =>
                navigate(
                  `/class/${courseId}/admin/students/${event.data.userId}`
                )
              }
              getRowStyle={() => ({
                cursor: "pointer",
              })}
            />
          </div>
        </Section>
      </div>
    </main>
  );
};

export default ClassStudents;
