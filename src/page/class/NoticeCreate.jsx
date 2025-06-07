import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Container from "../../component/Container.jsx";
//import ClassSidebar from "../../ui/class/ClassSidebar";
import {
  ModalOverlay,
  ModalContent,
} from "../../component/modal/ModalStyles.jsx";
import api from "../../api/api.js";
import { UsersContext } from "../../contexts/usersContext.jsx";
import PropTypes from "prop-types";

const NoticeTitle = styled.h3`
  font-size: 22px;
  font-weight: 700;
  color: var(--black-color);
  margin-bottom: 1rem;
  margin-left: 1rem;
  margin-top: 1rem;
`;

const StyledInput = styled.input`
  width: 100%;
  border: 2px solid var(--neutralgrey-color);
  border-radius: 10px;
  padding: 12px 15px;
  font-size: 14px;
  margin-bottom: 2.8vh;
  margin-top: 0.7rem;
  font-family: Pretendard, sans-serif;
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  border: 2px solid var(--neutralgrey-color);
  border-radius: 10px;
  padding: 12px 15px;
  font-size: 14px;
  margin-bottom: 1rem;
  margin-top: 0.7rem;
  resize: none;

  &:focus {
    outline: none;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-left: auto;
  gap: 1.5rem;

  @media (max-width: 480px) {
    padding: 1px;
    gap: 0.5rem;
  }
`;

const StyledButton = styled.button`
  background-color: var(--main-color);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 30px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  display: block;
  margin-right: -2.1rem;
  margin-bottom: 1rem;

  @media (max-width: 480px) {
    font-size: 14px;
    font-weight: 500;
    padding: 10px 18px;
  }
`;

const CancelButton = styled.button`
  background-color: var(--neutralgrey-color);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 30px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 1rem;

  @media (max-width: 480px) {
    font-size: 14px;
    font-weight: 500;
    padding: 10px 18px;
  }
`;

const CountContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const Text = styled.div`
  font-size: 13px;
  color: var(--main-color);
`;

const NoticeCreateModal = ({ isOpen, onClose, isEditMode }) => {
  NoticeCreateModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    isEditMode: PropTypes.bool.isRequired,
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>{isEditMode ? "공지사항 수정" : "공지사항 등록"}</h2>
        <span>
          {isEditMode ? "공지사항이 수정되었어요." : "공지사항이 게시되었어요."}
        </span>
        <div className="button-container">
          <button className="close-button" onClick={onClose}>
            확인
          </button>
        </div>
      </ModalContent>
    </ModalOverlay>
  );
};

const NoticeCreateForm = () => {
  const { courseId, noticeId } = useParams();
  const { user } = useContext(UsersContext);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  let [inputCount, setInputCount] = useState(title.length);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (noticeId && user && user.userId) {
      // 수정 모드: 공지사항 데이터를 불러와서 폼에 채워 넣음
      setIsEditMode(true);
      const fetchNoticeData = async () => {
        try {
          const response = await api.get(
            `/announcements/${courseId}/${user.userId}/${noticeId}`,
          );
          if (response.data.success) {
            setTitle(response.data.data.announcementTitle);
            setContent(response.data.data.announcementContent);
          } else {
            console.warn(response.data.message);
          }
        } catch (error) {
          console.error("공지사항 데이터 가져오기 오류:", error);
        }
      };

      fetchNoticeData();
    } else {
      // 생성 모드: 빈 폼을 보여줌
      setTitle("");
      setContent("");
      setIsEditMode(false);
    }
  }, [courseId, noticeId, user]);

  useEffect(() => {
    setInputCount(title.length);
  }, [title]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!courseId || !user.userId) {
      alert("courseId 또는 userId를 가져오지 못했습니다.");
      return;
    }

    try {
      let response;
      if (noticeId) {
        // 수정 모드: PATCH 요청
        response = await api.patch(
          `/announcements/${courseId}/${user.userId}/${noticeId}`,
          {
            title,
            content,
          },
        );
      } else {
        // 생성 모드: POST 요청
        response = await api.post(`/announcements/${courseId}/${user.userId}`, {
          title,
          content,
        });
      }

      if (response.data.success) {
        setIsCreateModalOpen(true); // 모달 열기
      } else {
        alert(
          `공지 ${noticeId ? "수정" : "작성"} 실패: ${response.data.message}`,
        );
      }
    } catch (error) {
      console.error(`공지 ${noticeId ? "수정" : "작성"} 오류:`, error);
      alert(
        `공지사항을 ${noticeId ? "수정" : "작성"}하는 중 오류가 발생했습니다.`,
      );
    }
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    navigate(`/class/${courseId}/overview/notice`);
  };

  const handleCancel = () => {
    navigate(`/class/${courseId}/overview/notice`);
  };

  const onInputHandler = (e) => {
    setInputCount(e.target.value.length);
  };

  return (
    <div>
      <div style={{ display: "flex", marginTop: "1rem" }}>
        {/*<ClassSidebar style={{ marginRight: "2rem" }} />*/}
        <main
          style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
          <NoticeTitle>
            {noticeId ? "공지 사항 수정" : "공지 사항 작성"}
          </NoticeTitle>
          <Container style={{ padding: "2rem", paddingRight: "4.3rem" }}>
            <form onSubmit={handleSubmit}>
              <label
                htmlFor="title"
                style={{ fontSize: "18px", fontWeight: "600" }}
              >
                제목
              </label>
              <CountContainer>
                <Text>{inputCount}</Text>
                <Text>/100 자</Text>
              </CountContainer>
              <StyledInput
                id="title"
                type="text"
                value={title}
                maxLength="100"
                onChange={(e) => {
                  setTitle(e.target.value);
                  onInputHandler(e);
                }}
                required
              />
              <label
                htmlFor="content"
                style={{ fontSize: "18px", fontWeight: "600" }}
              >
                내용
              </label>
              <StyledTextarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="15"
                required
              />
              <ButtonContainer>
                {noticeId && (
                  <CancelButton type="button" onClick={handleCancel}>
                    취소하기
                  </CancelButton>
                )}
                <StyledButton type="submit">
                  {noticeId ? "수정하기" : "게시하기"}
                </StyledButton>
              </ButtonContainer>
            </form>
          </Container>
        </main>
      </div>
      <NoticeCreateModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        isEditMode={isEditMode}
      />
    </div>
  );
};

export default NoticeCreateForm;
