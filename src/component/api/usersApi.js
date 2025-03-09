import api from './api';

export const login = async (credentials) => {
    try {
        const response = await api.post('/login', credentials);
        return response;
    } catch (error) {
        console.error('로그인 API 호출 실패:', error);
        throw error;
    }
};

export const signup = async (credentials) => {
  const response = await api.post('/users/sign-up', credentials);
  return response.data;
};

export const checkEmail = async (email) => {
  const response = await api.get(`/users/check-email?email=${email}`);
  return response.data;
};

export const logout = async () => {
  try{
    const response = await api.post('/logout');
    return response;
  } catch (error) {
    console.error('로그아웃 중 오류 발생:', error);
    throw error;
  }
};

export const getUsersInfo = async () => {
  const response = await api.get('/users/user-info');
  return response.data;
};