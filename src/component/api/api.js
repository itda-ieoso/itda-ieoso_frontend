import axios from 'axios';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터: 요청 전에 토큰 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 응답 후 에러 처리
api.interceptors.response.use(
  (response) => {
    // 응답 바디가 없을 경우 기본 메시지 추가
    if (!response.data) {
      response.data = { message: '응답 바디 없음' };
    }
    return response;  
  },
  (error) => {
    if (error.response) {
      // 401 에러 (인증 실패 시 로그인 페이지로 리다이렉트)
      if (error.response.status === 401) {
        // 로그인 시도에서 발생한 401 에러는 리다이렉트하지 않음
        if (!error.config.url.includes('/login')) {
          localStorage.removeItem('token'); // 토큰 삭제
          window.location.href = '/'; // 페이지 강제 이동
        }
      }

      // 기타 에러 처리
      console.error(`에러 발생: ${error.response.status}`, error.response.data || '서버 오류');
    } else {
      console.error("서버 응답 없음", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
