import { useEffect } from "react";
import styled from "styled-components";
import userIcon from "../../img/icon/usericon.svg";
import { logout } from "../../api/usersApi";
import { useContext } from "react";
import { UsersContext } from "../../contexts/usersContext";
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export function UsersInfoContainer({ setShowUsersInfoContainer }) {

    const { user, setUser, setIsUser } = useContext(UsersContext);
    const navigate = useNavigate();

    // 드롭다운 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown-container')) {
                setShowUsersInfoContainer(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setShowUsersInfoContainer]);

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            const response = await logout();
            if (response.status === 200) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setIsUser(false);
                setUser(null);
                navigate('/');
            }
        } catch (error) {
            console.error('로그아웃 중 오류 발생:', error);
        }
    };

    return (
        <Dropdown className="dropdown-container">
            <UserInfo>
                <img src={userIcon} alt="user icon" className="user-info-profile" />
                <p className="user-info-name">{user.name}</p>
                <button className="user-info-logout-button" onClick={handleLogout}>로그아웃하기</button>
            </UserInfo>
        </Dropdown>
    );
}

// 스타일링 유지
const Dropdown = styled.div`
    position: absolute;
    top: 8vh;
    right: 0;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 2px 15px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
`;

const UserInfo = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 5px 10px;
    width: 100%;

    .user-info-profile {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
    }

    .user-info-name {
        font-size: 14px;
        font-weight: 500;
        margin-right: 10px;
        white-space: nowrap;
    }

    .user-info-logout-button {
        font-size: 12px;
        font-weight: 500;
        background-color: transparent;
        border: 1px solid #000;
        margin-right: 10px;
        padding: 5px 10px;
        border-radius: 60px;
        cursor: pointer;
        white-space: nowrap;
    }
`;

// PropTypes 설정
UsersInfoContainer.propTypes = {
    setShowUsersInfoContainer: PropTypes.func.isRequired,
};