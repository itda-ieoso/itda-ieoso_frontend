import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

export const UsersContext = createContext();

export const UsersProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isUser, setIsUser] = useState(false);

  // 페이지 새로고침 해도 토큰 있으면 로그인 상태 유지
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token) {
      setIsUser(true);
      setUser(JSON.parse(user));
    } else {
      setIsUser(false);
      setUser(null);
    }
  }, []);

  return (
    <UsersContext.Provider value={{ user, setUser, isUser, setIsUser }}>
      {children}
    </UsersContext.Provider>
  );
};

UsersProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
