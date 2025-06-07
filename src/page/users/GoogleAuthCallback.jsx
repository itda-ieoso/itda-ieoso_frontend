import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api/api.js";
import { getUsersInfo } from "../../api/usersApi.js";
import { UsersContext } from "../../contexts/usersContext.jsx";
import { useContext } from "react";
import styled from "styled-components";
import {
  setSessionExpiration,
  startTokenRefreshTimer,
} from "../../api/tokenManager.js";

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  background-color: white;
`;

const LoadingSpinner = styled.div`
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  font-size: 18px;
  color: #333;
  margin-top: 20px;
`;

const ErrorText = styled.p`
  font-size: 16px;
  color: #e74c3c;
  margin-top: 20px;
  text-align: center;
  max-width: 80%;
`;

export default function GoogleAuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setIsUser } = useContext(UsersContext);
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        console.log("OAuth 콜백 처리 시작");

        // URL에서 token 또는 code 파라미터 추출
        const urlParams = new URLSearchParams(location.search);
        const token = urlParams.get("token");
        const code = urlParams.get("code");

        // 토큰이 직접 제공된 경우
        if (token) {
          console.log("JWT 토큰이 URL에서 직접 제공됨");
          console.log("access token", token);
          await processToken(token);
          return;
        }

        // 코드만 제공된 경우
        if (code && !token) {
          console.log("인증 코드 추출 성공:", code);

          try {
            const response = await api.get(`/oauth/return/uri?code=${code}`);

            if (
              !response.data ||
              !response.data.jwtToken ||
              !response.data.refreshToken
            ) {
              throw new Error("JWT 또는 refresh 토큰이 응답에 없습니다.");
            }

            const jwtToken = response.data.jwtToken;
            const refreshToken = response.data.refreshToken;

            await processToken(jwtToken, refreshToken);
            return;
          } catch (error) {
            console.error("API 호출 중 오류 발생:", error);
            setStatus("error");
            setErrorMessage(
              "JWT 토큰을 가져오는 중 오류가 발생했습니다: " + error.message,
            );
            setTimeout(() => navigate("/login"), 5000);
            return;
          }
        }

        console.error("URL에서 token 또는 code 파라미터를 찾을 수 없습니다");
        setStatus("error");
        setErrorMessage("인증 정보를 찾을 수 없습니다. 다시 로그인해 주세요.");
        setTimeout(() => navigate("/login"), 3000);
      } catch (error) {
        console.error("OAuth 처리 중 오류 발생:", error);
        setStatus("error");
        setErrorMessage("로그인 처리 중 오류가 발생했습니다: " + error.message);
        setTimeout(() => navigate("/login"), 3000);
      }
    };

    const processToken = async (token, refreshToken) => {
      try {
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);

        const expirationTime = new Date().getTime() + 3600000; // 1시간
        localStorage.setItem("tokenExpiration", expirationTime);

        // 세션 만료 시간 설정 (2주)
        setSessionExpiration();

        // 토큰 갱신 타이머 시작
        startTokenRefreshTimer();

        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setIsUser(true);

        const userInfo = await getUsersInfo();
        setUser(userInfo.data);
        localStorage.setItem("user", JSON.stringify(userInfo.data));

        setStatus("success");

        setTimeout(() => {
          window.location.href = "/class/list";
        }, 1000);
      } catch (error) {
        throw new Error("사용자 정보 로드 실패: " + error.message);
      }
    };

    processOAuthCallback();
  }, [location, navigate, setIsUser, setUser]);

  return (
    <LoadingContainer>
      {status === "loading" && (
        <>
          <LoadingSpinner />
          <LoadingText>로그인 처리 중입니다...</LoadingText>
        </>
      )}

      {status === "success" && (
        <>
          <LoadingSpinner />
          <LoadingText>로그인 성공! 강의실 페이지로 이동합니다...</LoadingText>
        </>
      )}

      {status === "error" && (
        <>
          <ErrorText>{errorMessage}</ErrorText>
          <LoadingText>잠시 후 로그인 페이지로 이동합니다...</LoadingText>
        </>
      )}
    </LoadingContainer>
  );
}
