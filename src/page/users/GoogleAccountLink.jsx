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

export default function GoogleAccountLink() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useContext(UsersContext);
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const processAccountLinking = async () => {
      try {
        const currentToken = localStorage.getItem("token");

        if (!currentToken) {
          throw new Error("로그인 상태가 아닙니다. 먼저 로그인해주세요.");
        }

        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get("code");

        if (code && currentToken) {
          try {
            const response = await api.get(
              `/oauth/return/uri/temp?code=${code}`,
            );

            if (!response.data) {
              throw new Error("응답 데이터가 없습니다");
            }
            const newToken =
              response.headers?.authorization ||
              response.headers?.Authorization ||
              response.data?.jwtToken;

            if (newToken && newToken !== currentToken) {
              // refreshToken 역할을 하는 newToken으로 accessToken 재발급 요청
              const refreshRes = await api.post(
                "/oauth/reissuetoken",
                {
                  refreshToken: newToken,
                },
                {
                  withCredentials: true,
                },
              );

              const accessToken = refreshRes.data?.jwtToken;
              if (!accessToken) {
                throw new Error("AccessToken 재발급 실패");
              }

              console.log("accessToken 새로 발급됨:", accessToken);

              // accessToken 저장 및 설정
              localStorage.setItem("token", accessToken);
              api.defaults.headers.common["Authorization"] =
                `Bearer ${accessToken}`;

              // refreshToken 저장
              localStorage.setItem("refreshToken", newToken);

              // 토큰 만료 시간 설정 (1시간)
              const expirationTime = new Date().getTime() + 3600000;
              localStorage.setItem("tokenExpiration", expirationTime);

              // 세션 만료 시간 설정 (2주)
              setSessionExpiration();

              // 토큰 갱신 타이머 시작
              startTokenRefreshTimer();
            } else {
              console.log("JWT 토큰이 갱신되지 않았습니다.");
            }

            // 사용자 정보 업데이트
            const userInfo = await getUsersInfo();
            setUser(userInfo.data);
            localStorage.setItem("user", JSON.stringify(userInfo.data));

            setStatus("success");

            // 성공 시 강의실 목록으로 리디렉션
            setTimeout(() => {
              window.location.href = "/class/list";
            }, 2000);

            return;
          } catch (error) {
            console.error("API 호출 중 오류 발생:", error);
            setStatus("error");
            setErrorMessage(
              "구글 계정 연동 중 오류가 발생했습니다: " +
                (error.response?.data?.message || error.message),
            );
            setTimeout(() => navigate("/class/list"), 3000);
            return;
          }
        }

        console.error("URL에서 code 파라미터를 찾을 수 없습니다");
        setStatus("error");
        setErrorMessage("인증 정보를 찾을 수 없습니다.");
        setTimeout(() => navigate("/class/list"), 3000);
      } catch (error) {
        console.error("계정 연동 처리 중 오류 발생:", error);
        setStatus("error");
        setErrorMessage(
          "계정 연동 처리 중 오류가 발생했습니다: " + error.message,
        );
        setTimeout(() => navigate("/class/list"), 3000);
      }
    };

    processAccountLinking();
  }, [location, navigate, setUser]);

  return (
    <LoadingContainer>
      {status === "loading" && (
        <>
          <LoadingSpinner />
          <LoadingText>구글 계정 연동 중입니다...</LoadingText>
        </>
      )}

      {status === "success" && (
        <>
          <LoadingSpinner />
          <LoadingText>
            구글 계정 연동 성공! 강의실 페이지로 이동합니다...
          </LoadingText>
        </>
      )}

      {status === "error" && (
        <>
          <ErrorText>{errorMessage}</ErrorText>
          <LoadingText>잠시 후 강의실 페이지로 이동합니다...</LoadingText>
        </>
      )}
    </LoadingContainer>
  );
}
