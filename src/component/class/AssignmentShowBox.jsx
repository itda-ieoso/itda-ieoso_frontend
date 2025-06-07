import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import api from "../../api/api.js";
import { UsersContext } from "../../contexts/usersContext.jsx";

const AssignmentShowBox = ({
  content,
  files,
  setCanEdit,
  submissionId,
  submissionType,
  setIsDeleteModalOpen,
}) => {
  const { assignmentId } = useParams();
  const { user } = useContext(UsersContext);

  useEffect(() => {
    setCanEdit(false);
  }, [assignmentId]);

  const handleDelete = async () => {
    const deleteResponse = await api.put(
      `/assignments/${assignmentId}/submissions/delete/${submissionId}/${user.userId}`,
    );
    if (deleteResponse.data.success) {
      setIsDeleteModalOpen(true);
    }
  };

  const changeMode = async () => {
    setCanEdit(true);
  };

  const OnClickImage = async (e, fileId) => {
    e.preventDefault();

    const fileToDownload = files.find((file) => file.id === fileId);
    if (!fileToDownload) {
      console.log("파일을 찾을 수 없습니다.");
      return;
    }

    try {
      const response = await api.get("/files/download", {
        params: {
          fileUrl: fileToDownload.fileUrl,
        },
      });

      const presignedUrl = response.data.data;
      const fileResponse = await fetch(presignedUrl);
      const arrayBuffer = await fileResponse.arrayBuffer();

      const fileExtension = fileToDownload.name.split(".").pop().toLowerCase();
      let mimeType = "application/octet-stream";

      if (fileExtension === "pdf") {
        mimeType = "application/pdf";
      } else if (["jpg", "jpeg", "png"].includes(fileExtension)) {
        mimeType = `image/${fileExtension}`;
      }

      const blob = new Blob([arrayBuffer], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileToDownload.name;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("파일을 제출한 이후 다운로드를 시도해주세요.");
      console.log(error);
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
          <FormTitle>내용</FormTitle>
          <EditorContainer>{content}</EditorContainer>
        </Box>
      )}

      {(submissionType === "FILE" || submissionType === "BOTH") && (
        <Box style={{ marginTop: "20px" }}>
          <FormTitle>파일</FormTitle>
          {files &&
            files.map((file) => (
              <ImageItemContainer>
                <ImageItem key={file.fileUrl} title={file.fileName}>
                  <ImageTitle
                    title={file.fileName}
                    onClick={(e) => OnClickImage(e, file.id)}
                  >
                    {file.name}
                  </ImageTitle>
                  <ImageDate>{file.size}</ImageDate>
                </ImageItem>
              </ImageItemContainer>
            ))}
        </Box>
      )}
      <SubmitButton onClick={handleDelete}>삭제하기</SubmitButton>
      <SubmitButton onClick={changeMode}>수정하기</SubmitButton>
    </Wrapper>
  );
};

const Box = styled.div`
  gap: 10px;
  margin-bottom: 20px;
`;

const FormTitle = styled.div`
  font-size: 17px;
  font-weight: 700;
  padding: 0px 10px;
  margin-top: 5px;
`;

const Wrapper = styled.div`
  border-radius: 20px;
  background-color: #ffffff;
  height: ${(props) =>
    props.isText
      ? "35vh"
      : props.isBoth
        ? `calc(40vh + ${props.fileCount * 50}px)`
        : `calc(15vh + ${props.fileCount * 50}px)`};
  padding: 10px;
`;

const EditorContainer = styled.div`
  border-radius: 8px;
  font-size: 14px;
  overflow: auto;
  margin-top: 10px;
  height: 18vh;
  margin: 10px;
  background-color: #f6f7f9;
  padding: 10px;
  white-space: pre-wrap;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ImageItemContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 10px;
  margin: 10px;
  padding: 0px 10px;
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

const ImageTitle = styled.div`
  color: #ff4747;
  font-size: 14px;
  text-decoration: underline;
  margin-right: 3px;
  cursor: pointer;
  max-width: 80%;
  white-space: wrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ImageDate = styled.div`
  color: #c3c3c3;
  font-size: 12px;
  margin-right: 5px;
`;

const SubmitButton = styled.button`
  float: right;
  padding: 8px 20px;
  background-color: #ff4747;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-right: 10px;
`;

export default AssignmentShowBox;
