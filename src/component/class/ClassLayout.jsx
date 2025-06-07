import styled from "styled-components";

export const PageLayout = styled.div`
  padding: 2rem 9vw;

  @media all and (max-width: 1024px) {
    padding: 2rem 7vw;
  }

  @media all and (max-width: 768px) {
    padding: 2rem 6vw;
  }
`;

export const Section = styled.div`
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
`;
