import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import api from "../../api/api.js";
import DragZone from "../DragZone.jsx";
import CloseIcon from "@mui/icons-material/Close";
import { UsersContext } from "../../contexts/usersContext.jsx";

const AssignmentSubmitBox = ({
  courseId,
  userId,
  content = "",
  setContent,
  files,
  setFiles,
  submissionId,
  submissionStatus,
  submissionType,
  setCanEdit,
  setIsSubmittedModalOpen,
  setIsReSubmittedModalOpen,
}) => {
  const { assignmentId } = useParams();
  const { user } = useContext(UsersContext);

  const [previousFiles, setPreviousFiles] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    setCanEdit(true);
  }, [assignmentId]);

  useEffect(() => {
    setCharCount((content || "").length);
  }, [content]);

  const handleSubmit = async () => {
    if (!user) return;

    if (!content && files.length === 0) {
      alert("제출할 것이 없습니다.");
      return;
    }

    try {
      let response;

      const newFiles = files.filter((file) => !file.fileUrl);
      const existingFileUrls = files
        .filter((file) => file.fileUrl)
        .map((file) => file.fileUrl);
      const deleteFileUrls = [...deletedFiles];

      const formData = new FormData();
      formData.append("textContent", content);

      if (newFiles.length > 0) {
        newFiles.forEach((file) => {
          formData.append("files", file.object);
        });
      }

      if (!submissionId) {
        alert("강의자는 과제를 제출할 수 없습니다.");
        return;
      }

      switch (submissionStatus) {
        case "NOT_SUBMITTED": {
          response = await api.put(
            `/assignments/${assignmentId}/submissions/${submissionId}/${user.userId}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            },
          );
          break;
        }

        case "LATE":
        case "SUBMITTED": {
          if (existingFileUrls.length > 0) {
            existingFileUrls.forEach((url) => {
              formData.append("existingFileUrls", url);
            });
          }

          if (deleteFileUrls.length > 0) {
            deleteFileUrls.forEach((url) => {
              formData.append("deleteFileUrls", url);
            });
          }

          response = await api.put(
            `/assignments/${assignmentId}/submissions/${submissionId}/${user.userId}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            },
          );
          break;
        }
      }
      if (response.data.success) {
        const statusResponse = await api.get(
          `/assignments/${assignmentId}/submissions/${submissionId}/${user.userId}`,
        );

        if (statusResponse.data.success) {
          submissionStatus === "NOT_SUBMITTED"
            ? setIsSubmittedModalOpen(true)
            : setIsReSubmittedModalOpen(true);
        }
      }
    } catch (error) {
      console.error("과제 제출 오류:", error);
    }
  };

  const DeleteImageHandle = (e, fileId) => {
    e.preventDefault();

    const fileToDelete = files.find((file) => file.id === fileId);

    if (!fileToDelete) {
      console.warn("삭제할 파일을 찾을 수 없습니다.");
      return;
    }

    if (fileToDelete.object?.preview) {
      URL.revokeObjectURL(fileToDelete.object.preview);
    }

    const updatedFiles = files.filter((file) => file.id !== fileId);
    setFiles(updatedFiles);

    if (fileToDelete.fileUrl) {
      setDeletedFiles((prev) => [...prev, fileToDelete.fileUrl]);
    }
  };

  const handleContentChange = (e) => {
    const newValue = e.target.value;
    if (newValue.length <= 5000) {
      setContent(newValue);
      setCharCount(newValue.length);
    }
  };

  return (
    <Wrapper
      isBoth={submissionType === "BOTH"}
      isText={submissionType === "TEXT"}
      fileCount={files?.length || 0}
    >
      {(submissionType === "TEXT" || submissionType === "BOTH") && (
        <Box>
          <Label>
            <FormTitle>내용</FormTitle>
            <LimitText>{charCount}</LimitText>
            <LimitText>/5000 자</LimitText>
          </Label>
          <EditorContainer>
            <TextArea
              placeholder="내용을 입력하세요"
              value={content || ""}
              onChange={handleContentChange}
              wrap="hard"
            />
          </EditorContainer>
        </Box>
      )}

      {(submissionType === "FILE" || submissionType === "BOTH") && (
        <Box style={{ marginTop: submissionType === "BOTH" ? "20px" : "0px" }}>
          <FormTitle>파일 업로드하기</FormTitle>
          <DragZone files={files} setFiles={setFiles} />

          {files &&
            files.map((file) => (
              <ImageItemContainer>
                <ImageItem key={file.fileUrl} title={file.fileName}>
                  <ImageText
                    title={file.fileName}
                    onClick={(e) => OnClickImage(e, file.id)}
                  >
                    {file.name}
                  </ImageText>
                  <CloseIcon
                    onClick={(e) => {
                      DeleteImageHandle(e, file.id);
                    }}
                    style={{
                      width: "15px",
                      cursor: "pointer",
                      marginLeft: "5px",
                    }}
                  />
                </ImageItem>
              </ImageItemContainer>
            ))}
        </Box>
      )}

      <SubmitButton onClick={handleSubmit}>제출하기</SubmitButton>
    </Wrapper>
  );
};

const Box = styled.div`
  gap: 10px;
`;

const FormTitle = styled.div`
  font-size: 17px;
  font-weight: 700;
  padding: 0px 10px;
  margin-top: 5px;
`;

const Label = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin: 7px 0;
`;

const LimitText = styled.div`
  font-size: 13px;
  color: var(--main-color);
`;

const Wrapper = styled.div`
  border-radius: 20px;
  background-color: #ffffff;
  height: ${(props) =>
    props.isText
      ? "32vh"
      : props.isBoth
        ? `calc(58vh + ${props.fileCount * 50}px)`
        : `calc(32vh + ${props.fileCount * 50}px)`};
  padding: 10px;
`;

const EditorContainer = styled.div`
  border: 2px solid #cdcdcd;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 10px;
  height: 18vh;
  margin: 10px;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 18vh;
  padding: 16px;
  border: none;
  resize: none;
  font-size: 13px;
  box-sizing: border-box;

  &::placeholder {
    color: #9e9e9e;
  }

  &:focus {
    outline: none;
  }
`;

const ImageItemContainer = styled.div`
  display: flex;
  flex-direaction: column;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 10px;
  margin: 10px;
  background-color: #f6f7f9;
  border-radius: 8px;
  height: 40px;
`;

const ImageItem = styled.div`
  display: flex;
  align-items: center;
  background-color: #f6f7f9;
  padding: 5px;
  justify-content: space-between;
  border-radius: 8px;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ImageText = styled.div`
  margin-right: 3px;
  max-width: 80%;
  white-space: wrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SubmitButton = styled.button`
  padding: 8px 20px;
  float: right;
  background-color: #ff4747;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-right: 10px;
`;

export default AssignmentSubmitBox;
