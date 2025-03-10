import { useState, useContext } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import PropTypes from "prop-types";
import Delete from "../../img/icon/bin.svg";
import Share from "../../img/icon/share.svg";
import { ModalOverlay, ModalContent } from "../../ui/modal/ModalStyles";
import api from "../../api/api";
import { UsersContext } from "../../contexts/usersContext";

const Container = styled.div`
  width: 100%;

  @media (max-width: 768px) {
    padding: 0 0.5rem;
  }
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: bold;
  color: var(--black-color);
  margin-top: 2rem;
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
            과제 보기
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
        <ModalOverlay>
          <ModalContent>
            <h2>강의실 삭제</h2>
            <span>강의실을 삭제할까요?</span>
            <div className="button-container">
              <button className="close-button" onClick={() => setShowDeleteModal(false)}>취소</button>
              <button className="delete-button" onClick={() => handleDeleteLecture(courseId)}>삭제</button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

AdminTopBar.propTypes = {
  activeTab: PropTypes.string.isRequired,
};

export default AdminTopBar;