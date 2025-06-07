import { useContext, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
import Cloud from "../img/icon/cloud.svg";

const ClassAssignmentSubmit = ({ files, setFiles, maxFiles = 10 }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (files.length + acceptedFiles.length > maxFiles) {
        alert(`파일은 최대 ${maxFiles}개까지만 업로드 가능합니다.`);
        return;
      }
      setFiles((prevFiles) => [
        ...prevFiles,
        ...acceptedFiles.map((file) => ({
          id: Date.now() + "_" + Math.random().toString(36).substr(2, 9),
          object: file,
          name: file.name,
        })),
      ]);
    },
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "application/pdf": [".pdf"],
    },
  });

  return (
    <UploadContainer
      {...getRootProps()}
      style={{
        borderStyle: isDragActive ? "dashed" : "solid",
        borderColor: isDragActive ? "gray.500" : "gray.500",
        backgroundColor: isDragActive ? "purple.300" : "gray.600",
        color: isDragActive ? "gray.800" : "white",
      }}
    >
      <input {...getInputProps()} style={{ display: "none" }} />
      <FileContainer>
        <Icon
          className="cloud-icon material-icons"
          src={Cloud}
          alt="delete icon"
        />
        <FileSmallText>PDF, PNG, JPG or JPEG</FileSmallText>
        <FileLargeText>파일을 선택하거나 드래그해주세요.</FileLargeText>
      </FileContainer>
    </UploadContainer>
  );
};

const UploadContainer = styled.div`
  margin-top: 10px;
  height: 18vh;
  margin: 10px;
  background-color: #f6f7f9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Icon = styled.img`
  width: 46px;
  height: 21px;
  cursor: pointer;
`;

const FileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const FileSmallText = styled.div`
  margin-top: 5px;
  color: #aaaaaa;
  font-size: 12px;
  font-weight: 700;
`;

const FileLargeText = styled.div`
  color: #000000;
  font-size: 14px;
  font-weight: 700;
`;

export default ClassAssignmentSubmit;
