import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background-color: white;
  padding: 40px 80px;
  border-radius: 8px;
  text-align: center;
  width: 50%;
  max-width: 300px;
  font-size: 1rem;

  /* 모바일 세로 (해상도 ~ 479px)*/
  @media all and (max-width: 479px) {
    padding: 20px 40px;
    font-size: 15px;
  }

  .button-container {
    display: flex;
    margin-top: 2rem;
    gap: 2rem;
    justify-content: center;

    /* 모바일 세로 (해상도 ~ 479px)*/
    @media all and (max-width: 479px) {
      margin-top: 1.5rem;
      gap: 1.5rem;
    }
  }

  .close-button {
    background-color: #c3c3c3;
    color: var(--white-color);
    border: none;
    border-radius: 15px;
    padding: 10px 32px;
    font-size: 1rem;
    cursor: pointer;
    width: 125px;

    /* 모바일 세로 (해상도 ~ 479px)*/
    @media all and (max-width: 479px) {
      padding: 5px 16px;
      width: 110px;
      font-size: 13px;
    }
  }

  .delete-button {
    background-color: var(--main-color);
    color: white;
    border: none;
    border-radius: 15px;
    padding: 15px 32px;
    font-size: 1rem;
    cursor: pointer;
    width: 125px;

    /* 모바일 세로 (해상도 ~ 479px)*/
    @media all and (max-width: 479px) {
      padding: 15px 16px;
      width: 110px;
      font-size: 13px;
    }
  }
`;

export const AlertModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  padding: 40px 80px;
  border-radius: 8px;
  text-align: center;
  width: 50%;
  max-width: 400px;
  font-size: 1rem;
  position: relative;
  white-space: pre-wrap;
  line-height: 1.5;

  /* 모바일 세로 (해상도 ~ 479px)*/
  @media all and (max-width: 479px) {
    width: 150px;
    padding: 30px 60px;
  }

  @media all and (max-width: 375px) {
    padding: 20px 40px;
  }

  .none-bold-text {
    font-size: 18px;
    margin-bottom: 20px;

    /* 모바일 세로 (해상도 ~ 479px)*/
    @media all and (max-width: 479px) {
      font-size: 12px;
      white-space: normal;
    }
  }

  .text {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 20px;

    /* 모바일 세로 (해상도 ~ 479px)*/
    @media all and (max-width: 479px) {
      width: 100%;
      font-size: 13px;
    }

    @media all and (max-width: 375px) {
      font-size: 12px;
    }
  }

  .title {
    font-size: 30px;
    font-weight: 400;
    margin-bottom: 10px;
  }

  .close-button {
    background: none;
    border: none;
    color: red;
    font-size: 16px;
    cursor: pointer;
    position: absolute;
    right: 30px;
    bottom: 20px;

    /* 모바일 세로 (해상도 ~ 479px)*/
    @media all and (max-width: 479px) {
      font-size: 14px;
    }

    @media all and (max-width: 375px) {
      font-size: 12px;
    }
  }
`;
