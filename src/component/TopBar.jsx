import { useState, useContext, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import LogoImage from "../img/logo/itda_logo.svg";
import userIcon from "../img/icon/usericon.svg";
import { UsersContext } from "../contexts/usersContext.jsx";
import { UsersInfoContainer } from "../page/users/UsersInfoContainer.jsx";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import Translate from "../img/landing/translate.svg";

export default function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isUser } = useContext(UsersContext);
  const [showUsersInfoContainer, setShowUsersInfoContainer] = useState(false);
  const { targetLang, setTargetLang } = useLanguage();
  const userIconRef = useRef(null);
  const containerRef = useRef(null);

  const handleUserIconClick = () => {
    setShowUsersInfoContainer((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
        userIconRef.current &&
        !userIconRef.current.contains(event.target)
      ) {
        setShowUsersInfoContainer(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Wrapper>
      <Logo
        src={LogoImage}
        alt="itda logo"
        onClick={isUser ? () => navigate("/class/list") : () => navigate("/")}
      />
      <Header>
        <div className="language-switcher">
          <TranslateIcon src={Translate} />
          <span
            className={targetLang === "ko" ? "lang-active" : "lang-inactive"}
            onClick={() => {
              if (targetLang !== "ko") setTargetLang("ko");
            }}
          >
            KR
          </span>
          <div className="divider">|</div>
          <span
            className={targetLang === "en" ? "lang-active" : "lang-inactive"}
            onClick={() => {
              if (targetLang !== "en") setTargetLang("en");
            }}
          >
            EN
          </span>
        </div>
        {location.pathname !== "/login" && (
          <div className="header-right">
            {isUser ? (
              <UserContainer ref={containerRef}>
                {location.pathname === "/dashboard" ? (
                  <button
                    className="navigate-button"
                    onClick={() => navigate("/class/list")}
                  >
                    <span className="dashboard-text">강의실 입장하기</span>
                    <span className="mobile-dashboard-text">강의실</span>
                  </button>
                ) : (
                  <>
                    <button
                      className="navigate-button"
                      onClick={() => navigate("/dashboard")}
                    >
                      <span className="dashboard-text">대시보드로 가기</span>
                      <span className="mobile-dashboard-text">대시보드</span>
                    </button>
                  </>
                )}
                <UserIcon
                  ref={userIconRef}
                  src={userIcon}
                  alt="user icon"
                  onClick={handleUserIconClick}
                />
                {showUsersInfoContainer && (
                  <UsersInfoContainer
                    setShowUsersInfoContainer={setShowUsersInfoContainer}
                  />
                )}
              </UserContainer>
            ) : (
              <>
                <button className="login" onClick={() => navigate("/login")}>
                  로그인
                </button>
                <UserContainer>
                  <UserIcon src={userIcon} alt="user icon" />
                </UserContainer>
              </>
            )}
          </div>
        )}
      </Header>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  min-height: 70px;
  height: 7vh;
  align-items: center;
  justify-content: space-between;
  padding: 1px 9vw;
  background-color: #ffffff;

  @media all and (max-width: 479px) {
    padding: 1px 5vw;
  }
`;

const Logo = styled.img`
  width: 126px;
  height: 33px;
  cursor: pointer;

  /* 모바일 세로 (해상도 ~ 479px)*/
  @media all and (max-width: 479px) {
    padding: 0;
    width: 75px;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .header-right {
    display: flex;
    align-items: center;
    gap: 10px;

    /* 모바일 세로 (해상도 ~ 479px)*/
    @media all and (max-width: 479px) {
      padding: 0px;
      gap: 1vh;
    }
  }

  .login {
    min-width: 80px;
    background-color: #ff4747;
    color: rgb(255, 255, 255);
    border: none;
    padding: 10px 20px;
    border-radius: 50px;
    cursor: pointer;

    /* 모바일 세로 (해상도 ~ 479px)*/
    @media all and (max-width: 479px) {
      min-width: 50px;
      font-size: 12px;
    }
  }

  .navigate-button {
    background-color: transparent;
    color: #000;
    border: 1px solid #000;
    margin-right: 10px;
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 60px;

    .dashboard-text {
      display: block;
    }

    .mobile-dashboard-text {
      display: none;
    }

    @media all and (max-width: 479px) {
      min-width: 50px;
      font-size: 12px;

      .dashboard-text {
        display: none;
      }

      .mobile-dashboard-text {
        display: block;
      }
    }
  }

  .language-switcher {
    display: flex;
    align-items: center;
    gap: 1vh;
    font-size: 17px;
    font-weight: 500;
    cursor: pointer;
    margin-right: 2vh;

    /* 모바일 세로 (해상도 ~ 479px)*/
    @media all and (max-width: 479px) {
      margin-right: 10px;
    }
  }

  .langs {
    display: flex;
    align-items: center;
  }

  .lang-active {
    color: black;
  }

  .lang-inactive {
    color: #cccccc;
  }

  .divider {
    color: #cccccc;
  }
`;

const UserContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  padding: 10px 0 10px 10px;
  border-radius: 8px;
`;

const UserIcon = styled.img`
  width: 40px;
  height: 40px;
  cursor: pointer;

  /* 모바일 세로 (해상도 ~ 479px)*/
  @media all and (max-width: 479px) {
    margin-right: 0px;
  }
`;

const TranslateIcon = styled.img`
  width: 2vh;
`;
