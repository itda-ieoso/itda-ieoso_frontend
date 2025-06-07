import { useState, useEffect, useContext } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import styled from "styled-components";
import {
  ModalOverlay,
  ModalContent,
} from "../../component/modal/ModalStyles.jsx";
import { Section } from "../../component/class/ClassLayout.jsx";
import EditNoticeButton from "../../component/class/EditNoticeButton.jsx";
import api from "../../api/api.js";
import { UsersContext } from "../../contexts/usersContext.jsx";
import PropTypes from "prop-types";

const Title = styled.h1`
  font-size: 22px;
  font-weight: 700;
  margin-left: 1rem;
  margin-top: 0rem;
  margin-bottom: 0px;
`;

const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const NoticeContainer = styled.div`
  flex: 1;
  border-radius: 8px;
  width: 100%;

  @media all and (max-width: 479px) {
    justify-content: center;
    padding: 0vh;
  }
`;

const NoneNotice = styled.div`
  text-align: center;
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--darkgrey-color);
  padding: 3rem 0;

  @media all and (max-width: 479px) {
    font-size: 1rem;
  }
`;

const NoticeList = styled.div`
  display: flex;
  flex-direction: column;
  color: var(--black-color);
  min-width: 175px;
`;

const NoticeItemLeft = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0rem;
  width: 80%;
`;

const NoticeItem = styled.div`
  padding: 1rem 1rem 1.2rem 1.4rem;
  border-bottom: 1.5px solid #cdcdcd;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  transition: background-color 0.3s;
  cursor: pointer;

  &:hover {
    background-color: var(--lightgrey-color);
  }
`;

const NoticeTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 500;
  color: var(--black-color);
  margin-bottom: 0.8rem;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const NoticeMeta = styled.div`
  font-size: 0.9rem;
  color: #474747;
  display: flex;
  gap: 0.3rem;
  margin-bottom: 1.2rem;
  font-weight: semi-bold;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;

    span:nth-child(2) {
      display: none;
    }
  }

  @media all and (max-width: 479px) {
    font-size: 0.8rem;
  }
`;

const NoticeViews = styled.div`
  text-align: center;
  color: var(--main-color);
  font-size: 1.1rem;
  font-weight: 500;

  div {
    font-size: 0.875rem;
    color: #474747;
    margin-top: 0.25rem;

    @media all and (max-width: 479px) {
      font-size: 0.7rem;
    }
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }

  @media all and (max-width: 479px) {
    font-size: 1rem;
  }
`;

const NoticeContent = styled.div`
  padding: 1.5rem;
  background-color: #f4f4f4;
  transition: max-height 0.3s ease-out;
  overflow: hidden;
  margin-top: 1rem;
  border-radius: 8px;
  transition: max-height 0.3s ease-out;
  overflow: hidden;
  position: relative;
  white-space: pre-wrap;
  word-break: break-word;

  .button-container {
    position: absolute;
    top: 15px;
    right: 17px;
  }

  .button {
    background-color: transparent;
    color: #767676;
    border: none;
    font-weight: 500;
    cursor: pointer;

    @media (max-width: 480px) {
      font-size: 0.8rem;
    }
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }

  @media all and (max-width: 479px) {
    font-size: 0.8rem;
    white-space: pre-wrap;
    word-break: break-all;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
  margin: 2rem;

  @media all and (max-width: 479px) {
    margin: 1rem;
  }
`;

const PageButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 8px;
  background-color: ${(props) =>
    props.active ? "var(--pink-color)" : "transparent"};
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  &:hover {
    background-color: var(--lightgrey-color);
  }
`;

const Icon = styled.span`
  font-size: 1.5rem;
  color: var(--black-color);
`;

//삭제 확인 모달
const NoticeDeleteModal = ({ isOpen, onClose, onDelete }) => {
  NoticeDeleteModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>공지사항 삭제</h2>
        <span>
          공지사항을 삭제할까요? <br /> 한 번 삭제한 글은 복구할 수 없습니다.
        </span>
        <div className="button-container">
          <button className="close-button" onClick={onClose}>
            취소
          </button>
          <button className="delete-button" onClick={onDelete}>
            삭제하기
          </button>
        </div>
      </ModalContent>
    </ModalOverlay>
  );
};

const ClassNotice = () => {
  const { courseId } = useParams();
  const context = useOutletContext() || {};
  const { isCreator } = context;
  const { user } = useContext(UsersContext);
  const [userId, setUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [notices, setNotices] = useState([]);
  const ITEMS_PER_PAGE = 5;
  const [expandedNoticeId, setExpandedNoticeId] = useState(null);
  const [noticeDetails, setNoticeDetails] = useState({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState(null);

  useEffect(() => {
    const getUserIdFromLocalStorage = () => {
      const userData = localStorage.getItem("user");
      if (!userData) return null;

      try {
        const parsedUser = JSON.parse(userData);
        return parsedUser.userId;
      } catch (error) {
        console.error("로컬 스토리지 데이터 파싱 오류:", error);
        return null;
      }
    };

    const fetchedUserId = getUserIdFromLocalStorage();
    if (fetchedUserId) {
      setUserId(fetchedUserId);
    }
  }, []);

  useEffect(() => {
    if (!courseId || userId === null) return;

    const fetchNotices = async () => {
      try {
        const response = await api.get(
          `/announcements/${courseId}/${user.userId}`,
        );

        if (response.data.success) {
          const sortedNotices = response.data.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          );
          setNotices(sortedNotices);
        } else {
          console.warn(response.data.message);
        }
      } catch (error) {
        console.error("공지사항 가져오기 오류:", error);
      }
    };

    fetchNotices();
  }, [courseId, userId]);

  // 총 페이지 개수 계산
  const totalPages = Math.ceil(notices.length / ITEMS_PER_PAGE);

  // 현재 페이지의 공지 목록 가져오기
  const currentNotices = notices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // 공지 상세조회 API
  const handleNoticeDetail = async (noticeId) => {
    setExpandedNoticeId((prevId) => (prevId === noticeId ? null : noticeId));

    if (noticeDetails[noticeId]) {
      return; // 이미 로드된 공지라면 서버 요청 생략
    }

    try {
      const response = await api.get(
        `/announcements/${courseId}/${user.userId}/${noticeId}`,
      );
      if (response.data.success) {
        const announcementDetails = response.data.data;
        setNoticeDetails((prevDetails) => ({
          ...prevDetails,
          [noticeId]: announcementDetails.announcementContent,
        }));
      } else {
        console.warn(response.data.message);
      }
    } catch (error) {
      console.error("공지사항 상세 정보 가져오기 오류:", error);
    }
  };

  const handleDeleteButtonClick = (noticeId) => {
    setNoticeToDelete(noticeId);
    setIsDeleteModalOpen(true);
  };

  const handleNoticeDelete = async () => {
    try {
      const response = await api.delete(
        `/announcements/${courseId}/${user.userId}/${noticeToDelete}`,
      );
      if (response.data.success) {
        setNotices((prevNotices) =>
          prevNotices.filter(
            (notice) => notice.announcementId !== noticeToDelete,
          ),
        );
        setIsDeleteModalOpen(false);
      } else {
        console.warn(response.data.message);
      }
    } catch (error) {
      console.error("공지사항 삭제 오류:", error);
    }
  };

  const handleEditButtonClick = (noticeId) => {
    // 수정 페이지로 이동할 때 공지사항 ID를 URL에 포함
    window.location.href = `/class/${courseId}/overview/notice/edit/${noticeId}`;
  };

  return (
    <div style={{ display: "flex", marginTop: "2rem" }}>
      <NoticeContainer
        style={{
          flex: 1,
          borderRadius: "8px",
        }}
      >
        <ContentHeader>
          <Title>공지 사항</Title>
        </ContentHeader>

        <Section>
          <NoticeList>
            {/* 🔹 공지가 없을 때 표시할 메시지 */}
            {notices.length === 0 ? (
              <NoneNotice>아직 등록된 공지사항이 없습니다.</NoneNotice>
            ) : (
              currentNotices.map((notice) => (
                <div key={notice.announcementId}>
                  <NoticeItem
                    onClick={() => handleNoticeDetail(notice.announcementId)}
                  >
                    <NoticeItemLeft>
                      <NoticeTitle>{notice.announcementTitle}</NoticeTitle>
                      <NoticeMeta>
                        <span>{notice.instructorName}</span>
                        <span>|</span>
                        <span>
                          {new Date(notice.createdAt).toLocaleDateString()}
                        </span>
                      </NoticeMeta>
                    </NoticeItemLeft>
                    <NoticeViews>
                      {notice.viewCount}
                      <div>조회수</div>
                    </NoticeViews>
                  </NoticeItem>
                  {expandedNoticeId === notice.announcementId && (
                    <NoticeContent>
                      {isCreator && (
                        <div className="button-container">
                          <button
                            className="button"
                            onClick={() =>
                              handleEditButtonClick(notice.announcementId)
                            }
                          >
                            수정
                          </button>
                          <button
                            className="button"
                            onClick={() =>
                              handleDeleteButtonClick(notice.announcementId)
                            }
                          >
                            삭제
                          </button>
                        </div>
                      )}
                      <p>{noticeDetails[notice.announcementId]}</p>
                    </NoticeContent>
                  )}
                </div>
              ))
            )}
          </NoticeList>
          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <Pagination>
              {/* 이전 버튼 */}
              <PageButton
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <Icon className="material-symbols-outlined">
                  arrow_back_ios
                </Icon>
              </PageButton>

              {/* 현재 페이지 버튼 (1부터 totalPages까지 동적 생성) */}
              {Array.from({ length: totalPages }, (_, index) => (
                <PageButton
                  key={index + 1}
                  active={currentPage === index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </PageButton>
              ))}

              {/* 다음 버튼 */}
              <PageButton
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                <Icon className="material-symbols-outlined">
                  arrow_forward_ios
                </Icon>
              </PageButton>
            </Pagination>
          )}
        </Section>
      </NoticeContainer>
      {isCreator && (
        <EditNoticeButton
          to={`/class/${courseId}/overview/notice/create`}
          edit={true}
        />
      )}
      <NoticeDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleNoticeDelete}
      />
    </div>
  );
};

export default ClassNotice;
