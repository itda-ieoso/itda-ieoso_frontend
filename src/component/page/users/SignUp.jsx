import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../ui/TopBar";
import logoImage from "../../img/logo/itda_logo_symbol.svg";
import {
  Container,
  LogoImage,
  LogoText,
  EmailCheckButton,
  SignUpContainer,
  Progress,
  Label,
  Step,
  SignUpInput,
  NextButton,
  InputContainer,
  ValidateMessage,
  WelcomeMessage,
  InputEmailContainer,
} from "../../../style/Styles";
import { signup, checkEmail } from "../../api/usersApi";
import TermsAgreement from "./Terms";
import { ModalOverlay, AlertModalContainer } from "../../ui/modal/ModalStyles";

export default function SignUp() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState({
    service: false,
    privacy: false,
    marketing: false,
  });
  const [emailCheckResult, setEmailCheckResult] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNext = () => {
    if (step === 1 && (!termsChecked.service || !termsChecked.privacy)) {
      setModalMessage("필수 약관에 동의해주세요.");
      setIsModalOpen(true);
      return;
    }
    if (step === 2 && !validatePassword(password)) {
      return;
    }
    if (step < 3) {
      setStep(step + 1);
    } else {
      navigate("/login");
    }
  };

  const handleCheckAll = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    setTermsChecked(() => ({
      service: newCheckedState,
      privacy: newCheckedState,
      marketing: newCheckedState,
    }));
  };

  const handleIndividualCheck = (term) => {
    const updatedTermsChecked = {
      ...termsChecked,
      [term]: !termsChecked[term],
    };
    setTermsChecked(updatedTermsChecked);
    const allChecked = Object.values(updatedTermsChecked).every(
      (value) => value,
    );
    setIsChecked(allChecked);
  };

  const handleCombinedClick = async (e) => {
    e.preventDefault();
    const signUpSuccess = await handleSignUp(e);
    if (signUpSuccess) {
      handleNext();
    }
  };

  //비밀번호 조건 검사
  const validatePassword = (password) => {
    const regex = /^.{8,}$/; // 8자 이상만 체크
    //const regex = /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; 소문자+글자 수
    //const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; 대문자도 필수일 때
    return regex.test(password);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSignUp = async () => {
    try {
      const requestBody = {
        email: email,
        password: password,
        name: name,
        service: termsChecked.service,
        privacy: termsChecked.privacy,
        marketing: termsChecked.marketing,
      };
      await signup(requestBody);
      return true;
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입에 실패하셨습니다.");
      return false;
    }
  };

  //이메일 중복 체크
  const handleEmailCheck = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailCheckResult("유효한 이메일 주소를 입력해주세요.");
      return;
    }
    try {
      const response = await checkEmail(email);

      if (response.data) {
        setEmailCheckResult("이미 사용 중인 이메일입니다.");
      } else {
        setEmailCheckResult("사용 가능한 이메일입니다.");
      }
    } catch (error) {
      console.error("이메일 중복 체크 실패:", error);
      setEmailCheckResult("이메일 중복 체크에 실패했습니다.");
    }
  };

  const isStep2Valid = () => {
    return (
      name.trim() !== "" &&
      validateEmail(email) &&
      emailCheckResult === "사용 가능한 이메일입니다." &&
      validatePassword(password) &&
      password === confirmPassword
    );
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <TopBar />
      <Container>
        <LogoImage src={logoImage} alt="logo" />
        <LogoText>회원가입</LogoText>
        <Progress>
          <Step active={step === 1} completed={step > 1} label="약관동의">
            1
          </Step>
          <Step active={step === 2} completed={step > 2} label="아이디 설정">
            2
          </Step>
          <Step active={step === 3} completed={step > 3} label="비밀번호 설정">
            3
          </Step>
        </Progress>
        <SignUpContainer>
          {step === 1 && (
            <>
              <p
                style={{ color: "var(--guide-gray-color)", fontSize: "0.9rem" }}
              >
                ※ itda 계정을 만들기 위해 약관에 동의해주세요.
              </p>
              <div
                style={{ minWidth: "200px", width: "100%", margin: "0 auto" }}
              >
                <TermsAgreement
                  isChecked={isChecked}
                  termsChecked={termsChecked}
                  handleCheckAll={handleCheckAll}
                  handleIndividualCheck={handleIndividualCheck}
                />
              </div>
              <NextButton onClick={handleNext}>다음</NextButton>
            </>
          )}
          {step === 2 && (
            <>
              <div
                style={{
                  minWidth: "300px",
                  maxWidth: "550px",
                  width: "100%",
                  margin: "0 auto",
                }}
              >
                <InputContainer>
                  <Label style={{ textAlign: "left", width: "100%" }}>
                    이름
                  </Label>
                  <SignUpInput
                    placeholder="이름을 입력해주세요."
                    onChange={(e) => setName(e.target.value)}
                  />
                </InputContainer>
                <InputContainer>
                  <Label>이메일</Label>
                  <InputEmailContainer>
                    <SignUpInput
                      placeholder="이메일을 입력해주세요."
                      style={{ width: "68%" }}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <EmailCheckButton onClick={handleEmailCheck}>
                      이메일 확인
                    </EmailCheckButton>
                  </InputEmailContainer>
                </InputContainer>
                <ValidateMessage
                  style={{
                    color: emailCheckResult.includes("사용 가능한")
                      ? "var(--guide-green-color)"
                      : "var(--guide-red-color)",
                    visibility: emailCheckResult ? "visible" : "hidden",
                  }}
                >
                  {emailCheckResult || ""}
                </ValidateMessage>
                <InputContainer>
                  <Label>비밀번호</Label>
                  <SignUpInput
                    type="password"
                    placeholder="비밀번호를 설정해주세요."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </InputContainer>
                <ValidateMessage
                  style={{
                    color:
                      password.length > 0 && !validatePassword(password)
                        ? "var(--guide-red-color)"
                        : "var(--guide-gray-color)",
                  }}
                >
                  {password.length === 0
                    ? "영문 대/소문자, 숫자, 특수문자를 조합하여 8자 이상 입력해주세요."
                    : !validatePassword(password)
                      ? "8자 이상으로 비밀번호를 작성해주세요."
                      : "영문 대/소문자, 숫자, 특수문자를 조합하여 8자 이상 입력해주세요."}
                </ValidateMessage>
                <InputContainer>
                  <Label>비밀번호 확인</Label>
                  <SignUpInput
                    type="password"
                    placeholder="설정하신 비밀번호를 입력해주세요."
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </InputContainer>
                <ValidateMessage style={{ color: "var(--guide-red-color)" }}>
                  {step === 2 &&
                  password !== confirmPassword &&
                  password.length > 0
                    ? "비밀번호가 일치하지 않습니다. 다시 확인해주세요."
                    : ""}
                </ValidateMessage>
              </div>
              <NextButton
                onClick={handleCombinedClick}
                disabled={!isStep2Valid()}
                style={{
                  backgroundColor: isStep2Valid() ? "#FF4747" : "#CDCDCD",
                  cursor: isStep2Valid() ? "pointer" : "not-allowed",
                }}
              >
                다음
              </NextButton>
            </>
          )}
          {step === 3 && (
            <div style={{ width: "100%", margin: "0 auto" }}>
              <WelcomeMessage>
                <h2>itda에 오신 것을 환영합니다!</h2>
                <p>첫 로그인하시겠어요?</p>
              </WelcomeMessage>
              <NextButton onClick={handleNext}>로그인하러 가기</NextButton>
            </div>
          )}
        </SignUpContainer>
      </Container>
      {isModalOpen && (
        <ModalOverlay>
          <AlertModalContainer>
            <div className="text">{modalMessage}</div>
            <div className="close-button" onClick={closeModal}>
              확인
            </div>
          </AlertModalContainer>
        </ModalOverlay>
      )}
    </>
  );
}
