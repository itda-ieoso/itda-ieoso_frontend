import styled from "styled-components";
import TopBar from "../ui/TopBar";
import { useNavigate } from "react-router-dom";

export default function Start() {
  const navigate = useNavigate();

  return (
    <>
      <TopBar />

      <Container>
        <h1>메인 페이지 예정</h1>
        <button onClick={() => navigate("/login")}>로그인</button>
      </Container>
    </>
  );
}

const Container = styled.div``;
