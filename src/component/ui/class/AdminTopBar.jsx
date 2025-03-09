import { useState, useContext } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import PropTypes from "prop-types";
import Delete from "../../img/icon/bin.svg";
import Share from "../../img/icon/share.svg";
import api from "../../api/api";
import { UsersContext } from "../../contexts/usersContext";

const Container = styled.div`
  width: 100%;

  @media (max-width: 768px) {
    padding: 0 0.5rem;
  }
`;

const Title = styled.h1`
  font-size: 27.5px;
  font-weight: 900;
  color: var(--black-color);
  margin-bottom: 1.8vh;
  margin-left:2.5vh;


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

  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const TabContainer = styled.nav`
  display: flex;
  gap: 1rem;
  flex-shrink: 0;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const TabLink = styled(NavLink)`
  width: 120px;
  text-align: center;
  padding: 5px 10px;
  text-decoration: none;
  color: #5f6368;
  font-weight: 550;
  font-size: 18px;
  position: relative;
  white-space: nowrap;

  &.active {
    &::after {
      content: "";
      position: absolute;
      bottom: -0.8rem;
      left: 0;
      width: 100%;
      height: 0.2rem;
      background-color: var(--main-color);
      border-radius: 5px;
    }
  }

  @media (max-width: 768px) {
    width: 70px;
    font-size: 16px;
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
`;

const Icon = styled.img`
  width: 33px;
  height: 33px;
  cursor: pointer;

  &.delete-icon {
    height: 37px;
  }
`;

const DeleteModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
`;

const DeleteModal = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    min-width: 350px;
    width: 40%;
    height: 30%;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const CloseIcon = styled.span`
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 28px;
    cursor: pointer;
`;

const ModalTitle = styled.h2`
    margin: 0;
    font-size: 20px;
    font-weight: normal;
`;

const YesButton = styled.button`
    margin-top: 40px;
    width: 100px;
    height: 40px;
    border: none;
    border-radius: 24px;
    background-color: var(--main-color);
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    &:hover {
        opacity: 0.9;
    }
`;

const AdminTopBar = ({ activeTab }) => {
  const { courseId } = useParams();
  const { user } = useContext(UsersContext);
  const navigate = useNavigate();
  // 모달 관련 상태
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const handleDeleteLecture = async (courseId) => {
    console.log('Deleting course with ID:', courseId);
    try {
        await api.delete(`/courses/${courseId}?userId=${user.userId}`);
        navigate("/class/list");
    } catch (error) {
        console.error('강의실 삭제 중 오류 발생:', error);
    }
  };
  
  const handleShareAlert = async () => {
    alert('공유 기능은 아직 준비중입니다 :)');
  };

  return (
    <Container>
      <Title>강의실 관리</Title>
      <NavbarContent>
        <TabContainer>
          <TabLink
            to={`/class/${courseId}/admin/summary`}
            className={activeTab === "summary" ? "active" : ""}
          >
            요약
          </TabLink>
          <TabLink
            to={`/class/${courseId}/admin/students`}
            className={activeTab === "students" ? "active" : ""}
          >
            학생별 보기
          </TabLink>
          <TabLink
            to={`/class/${courseId}/admin/setting`}
            className={activeTab === "setting" ? "active" : ""}
          >
            설정
          </TabLink>
        </TabContainer>

        <IconContainer>
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
            onClick={handleShareAlert}
          />
        </IconContainer>
      </NavbarContent>
      {showDeleteModal && (
        <DeleteModalOverlay>
          <DeleteModal>
            <CloseIcon onClick={() => setShowDeleteModal(false)}>×</CloseIcon>
            <ModalTitle>강의실을 삭제하시겠습니까?</ModalTitle>
            <YesButton onClick={() => handleDeleteLecture(courseId)}>예</YesButton>
          </DeleteModal>
        </DeleteModalOverlay>
      )}
    </Container>
  );
};

AdminTopBar.propTypes = {
  activeTab: PropTypes.string.isRequired,
};

export default AdminTopBar;