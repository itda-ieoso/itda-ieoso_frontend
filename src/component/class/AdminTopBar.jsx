import { useState, useEffect, useContext, useRef } from "react";
import { NavLink, useParams, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import PropTypes from "prop-types";
import Delete from "../../img/icon/bin.svg";
import Share from "../../img/icon/share.svg";
import {
  ModalOverlay,
  ModalContent,
  AlertModalContainer,
} from "../modal/ModalStyles.jsx";
import api from "../../api/api.js";
import { UsersContext } from "../../contexts/usersContext.jsx";
import { formatMyCoursesTitles } from "../../api/classApi.js";

const Container = styled.div`
  width: 100%;

  @media (max-width: 768px) {
    padding: 0 0.5rem;
  }

  @media all and (max-width: 479px) {
    padding: 0;
  }
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: bold;
  color: var(--black-color);
  margin-top: 2rem;
  margin-bottom: 1.8vh;
  margin-left: 2.5vh;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const NavbarContent = styled.div`
  background-color: var(--white-color);
  padding: 0.8rem 1rem;
  border-radius: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow-x: auto;
  min-width: min-content;
  gap: 2rem;
  flex-wrap: wrap;

  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    gap: 1rem;
  }

  @media all and (max-width: 479px) {
    gap: 0;
    padding: 0.4rem 0.1rem;
  }
`;

const TabContainer = styled.nav`
  display: flex;
  gap: 1rem;
  flex-shrink: 0;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }

  @media all and (max-width: 479px) {
    gap: 0.2rem;
    margin-bottom: 5px;
  }
`;

const TabLink = styled(NavLink)`
  width: 120px;
  text-align: center;
  padding: 5px 10px;
  text-decoration: none;
  color: #767676;
  font-weight: 500;
  font-size: 18px;
  position: relative;
  white-space: nowrap;

  &.active {
    color: var(--black-color);
    &::after {
      content: "";
      position: absolute;
      bottom: -0.8rem;
      left: 0;
      width: 100%;
      height: 0.2rem;
      background-color: var(--main-color);
      border-radius: 5px;

      @media (max-width: 479px) {
        bottom: -0.6rem;
      }
    }
  }

  @media (max-width: 768px) {
    width: 70px;
    font-size: 16px;
  }

  @media (max-width: 479px) {
    width: 45px;
    font-size: 14px;
  }
`;

const IconContainer = styled.nav`
  display: flex;
  gap: 20px;
  align-items: center;
  flex-shrink: 0;
  margin-left: auto;

  @media (max-width: 768px) {
    justify-content: center;
    margin-left: 0;
  }

  @media (max-width: 479px) {
    margin-right: 8px;
    gap: 10px;
  }
`;

const Icon = styled.img`
  height: 24px;
  cursor: pointer;

  @media (max-width: 768px) {
    height: 20px;
  }
`;

const ShareDropdownContainer = styled.div`
  position: absolute;
  top: 340px;
  right: 11vw;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  width: 250px;

  div {
    display: flex;
    justify-content: space-between;
    margin: 8px 0 12px;
    background-color: #ededed;
    border-radius: 10px;
  }

  text {
    height: 100%;
    font-weight: 700;
  }

  .shareinfo {
    margin-bottom: 12px;
  }

  span {
    padding: 6px 10px 6px;
  }

  .link-button {
    background-color: #f7f7f7;
    color: var(--black-color);
    border: none;
    border-radius: 0 15px 15px 0;
    padding: 7px 15px;
    cursor: pointer;
    transition: background-color 0.3s;

    /* &:active {
      background-color: #969696;
      transform: scale(0.98);
    }

    &:hover {
      background-color: #969696;
    } */
  }

  .invite-button {
    width: 100%;
    font-weight: 600;
    background-color: var(--pink-color);
    padding: 10px 0;
    margin-top: 5px;
    border-radius: 15px;
    border: none;
    cursor: pointer;

    /* &:active {
      background-color: var(--main-color);
      transform: scale(0.98);
    }

    &:hover {
      background-color: var(--main-color);
    } */
  }

  @media all and (max-width: 479px) {
    top: 350px;
    right: 40px;
  }
`;

const AdminTopBar = ({ myCourses, activeTab, courseData }) => {
  const { courseId } = useParams();
  const { user } = useContext(UsersContext);
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  // 모달 관련 상태
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");
  const [courseName, setCourseName] = useState("");
  const [entryCode, setEntryCode] = useState("");
  const [, setClassOptions] = useState(null);
  const [currentCourse, setCurrentCourse] = useState(null);
  const dropdownRef = useRef(null);
  const iconRef = useRef(null);

  const isSummaryTab =
    path.includes("/admin/summary") || path.includes("/admin/students");

  const isSettingTab = path.includes("/admin/setting");

  useEffect(() => {
    if (!user?.userId || !myCourses) return;

    const formattedCourses = formatMyCoursesTitles(myCourses, user.userId);
    setClassOptions(formattedCourses);
    const current = formattedCourses.find(
      (course) => String(course.courseId) === String(courseId),
    );
    setCurrentCourse(current);
  }, [user?.userId, courseId, myCourses]);

  useEffect(() => {
    if (courseData) {
      setCourseName(courseData.courseTitle);
      setEntryCode(courseData.entryCode);
    }
  }, [courseData]);

  // 공유 버튼 클릭 시 드롭다운 표시
  const handleIconClick = () => {
    setShowDropdown((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        iconRef.current &&
        !iconRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDeleteLecture = async (courseId) => {
    console.log("Deleting course with ID:", courseId);
    try {
      await api.delete(`/courses/${courseId}?userId=${user.userId}`);
      navigate("/class/list");
    } catch (error) {
      console.error("강의실 삭제 중 오류 발생:", error);
    }
  };

  const handleShare = () => {
    const inviteText = `[${courseName}] 강의실에 초대합니다!\n\n🔗 강의실 링크: https://eduitda.com\n📌 강의실 코드: ${entryCode}\n\n1. itda 로그인\n2. +버튼 클릭 > 강의실 입장하기\n3. 강의실 코드 입력\n\n지금 바로 참여하고 함께 배워요! 😊`;
    navigator.clipboard
      .writeText(inviteText)
      .then(() => setShowInviteModal(true))
      .catch((err) => console.error("복사 실패:", err));
  };

  return (
    <Container>
      <Title>강의실 관리</Title>
      <NavbarContent>
        <TabContainer>
          {!currentCourse?.isCreator && currentCourse?.isAssignmentPublic && (
            <>
              <TabLink
                to={`/class/${courseId}/admin/summary`}
                className={isSummaryTab ? "active" : ""}
              >
                요약
              </TabLink>
              {/*
              <TabLink
                to={`/class/${courseId}/admin/students`}
                className={activeTab === "students" ? "active" : ""}
              >
                과제 보기
              </TabLink>
              */}
            </>
          )}

          {currentCourse?.isCreator && (
            <>
              <TabLink
                to={`/class/${courseId}/admin/summary`}
                className={isSummaryTab ? "active" : ""}
              >
                요약
              </TabLink>
              {/* <TabLink
                to={`/class/${courseId}/admin/students`}
                className={activeTab === "students" ? "active" : ""}
              >
                과제 보기
              </TabLink> */}
              <TabLink
                to={`/class/${courseId}/admin/setting`}
                className={isSettingTab ? "active" : ""}
              >
                설정
              </TabLink>
            </>
          )}
        </TabContainer>

        <IconContainer>
          {currentCourse?.isCreator && (
            <>
              <Icon
                className="material-icons"
                src={Delete}
                alt="delete icon"
                onClick={() => {
                  setShowDeleteModal(true);
                }}
              />
              <Icon
                className="material-icons"
                src={Share}
                alt="share icon"
                onClick={handleIconClick}
                ref={iconRef}
              />
              {showDropdown && (
                <ShareDropdownContainer ref={dropdownRef}>
                  <text>강의실 링크</text>
                  <div className="shareinfo">
                    <span>https://eduitda.com</span>
                    <button
                      className="link-button"
                      onClick={() => {
                        navigator.clipboard.writeText("https://eduitda.com");
                        setCopyMessage("URL이 복사되었습니다!");
                        setShowInviteModal(true);
                      }}
                    >
                      URL 복사
                    </button>
                  </div>
                  <text>강의실 코드</text>
                  <div className="shareinfo">
                    <span>{entryCode}</span>
                    <button
                      className="link-button"
                      onClick={() => {
                        navigator.clipboard.writeText(entryCode);
                        setCopyMessage("강의실 코드가 복사되었습니다!");
                        setShowInviteModal(true);
                      }}
                    >
                      코드 복사
                    </button>
                  </div>
                  <button
                    className="invite-button"
                    onClick={() => {
                      handleShare();
                      setCopyMessage("초대 메시지가 복사되었습니다!");
                    }}
                  >
                    강의실 초대하기
                  </button>
                </ShareDropdownContainer>
              )}
            </>
          )}
        </IconContainer>
      </NavbarContent>

      {showDeleteModal && (
        <ModalOverlay>
          <ModalContent>
            <h2>강의실 삭제</h2>
            <span>강의실을 삭제할까요?</span>
            <div className="button-container">
              <button
                className="close-button"
                onClick={() => setShowDeleteModal(false)}
              >
                취소
              </button>
              <button
                className="delete-button"
                onClick={() => handleDeleteLecture(courseId)}
              >
                삭제하기
              </button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      {showInviteModal && (
        <ModalOverlay>
          <AlertModalContainer>
            <div className="text">{copyMessage}</div>
            <div
              className="close-button"
              onClick={() => setShowInviteModal(false)}
            >
              확인
            </div>
          </AlertModalContainer>
        </ModalOverlay>
      )}
    </Container>
  );
};

AdminTopBar.propTypes = {
  activeTab: PropTypes.string.isRequired,
  myCourses: PropTypes.array,
  courseData: PropTypes.object,
};

export default AdminTopBar;
