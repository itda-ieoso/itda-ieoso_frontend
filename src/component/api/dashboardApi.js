import api from "./api";

export const getDashboard = async (userId, date) => {
  try {
    const response = await api.get(`/lectures/dashboard/${userId}?date=${date}`);
    return response.data;
  } catch (error) {
    console.error("대시보드 데이터 호출 에러:", error);
    throw error;
  }
};
