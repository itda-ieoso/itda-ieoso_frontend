import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from "../../ui/TopBar";
import logoImage from "../../img/logo/itda_logo_symbol.svg";
import {
    Container,
    LogoImage,
    LogoText,
    LoginButton,
    SignUpContainer,
    Progress,
    Label,
    Step,
    SignUpInput,
    NextButton,
    InputContainer,
    WelcomeMessage
} from "../../../style/Styles";
import { signup, checkEmail } from '../../api/usersApi';
import TermsAgreement from './Terms';


export default function SignUp() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState({
    service: false,
    privacy: false,
    marketing: false,
  });
  const [emailCheckResult, setEmailCheckResult] = useState('');

  const handleNext = () => {
    if (step === 1 && (!termsChecked.service || !termsChecked.privacy)) {
      alert('필수 약관에 동의해주세요.');
      return;
    }
    if (step === 2 && !validatePassword(password)) {
      return;
    }
    if (step < 3) {
      setStep(step + 1);
    } else {
      navigate('/login');
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
    const allChecked = Object.values(updatedTermsChecked).every(value => value);
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
    const regex = /^.{8,}$/;  // 8자 이상만 체크
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
      console.error('회원가입 실패:', error);
      alert('회원가입에 실패하셨습니다.');
      return false;
    }
  };

  //이메일 중복 체크
  const handleEmailCheck = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailCheckResult('유효한 이메일 주소를 입력해주세요.');
      return;
    }
    try {
      const response = await checkEmail(email);

      if (response.data) {
        setEmailCheckResult('이미 사용 중인 이메일입니다.');
      } else {
        setEmailCheckResult('사용 가능한 이메일입니다.');
      }
      
    } catch (error) {
      console.error('이메일 중복 체크 실패:', error);
      setEmailCheckResult('이메일 중복 체크에 실패했습니다.');
    }
  };

  const isStep2Valid = () => {
    return (
      name.trim() !== '' &&
      validateEmail(email) &&
      emailCheckResult === '사용 가능한 이메일입니다.' &&
      validatePassword(password) &&
      password === confirmPassword
    );
  };

  return (
    <>
      <TopBar />
      <Container>
        <LogoImage src={logoImage} alt="logo" />
        <LogoText>회원가입</LogoText>
        <Progress>
          <Step active={step === 1 ? "true" : "false"} completed={step > 1 ? "true" : "false"} label="약관동의">1</Step>
          <Step active={step === 2 ? "true" : "false"} completed={step > 2 ? "true" : "false"} label="아이디 설정">2</Step>
          <Step active={step === 3 ? "true" : "false"} completed={step > 3 ? "true" : "false"} label="비밀번호 설정">3</Step>
        </Progress>
        <SignUpContainer>
          {step === 1 && (
            <>
              <p style={{color: 'var(--guide-gray-color)'}}>※ itda 계정을 만들기 위해 약관에 동의해주세요.</p>
              <div style={{minWidth: '250px', width: '100%', margin: '0 auto' }}>
                <TermsAgreement
                  isChecked={isChecked}
                  termsChecked={termsChecked}
                  handleCheckAll={handleCheckAll}
                  handleIndividualCheck={handleIndividualCheck}
                />
              </div>
              <NextButton onClick={handleNext}>
                다음
              </NextButton>
            </>
          )}
          {step === 2 && (
            <>
              <div style={{ minWidth: '300px', maxWidth: '600px', width: '100%', margin: '0 auto' }}>
                <Label style={{ textAlign: 'left', width: '100%' }}>이름</Label>
                <InputContainer>
                  <SignUpInput placeholder="이름을 입력해주세요." style={{ width: '100%' }}
                    onChange={(e) => setName(e.target.value)}
                  />
                </InputContainer>
                <Label style={{ textAlign: 'left', width: '100%' }}>이메일</Label>
                <InputContainer>  
                  <SignUpInput placeholder="이메일을 입력해주세요." style={{ width: '65%' }}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <LoginButton style={{
                    width: '35%',
                    marginLeft: '1rem',
                  }} onClick={handleEmailCheck}>이메일 확인</LoginButton>
                </InputContainer>
                {emailCheckResult && (
                  <div style={{
                    fontSize: '0.8rem',
                    marginLeft: '0.4rem',
                    color: emailCheckResult.includes('사용 가능한') ? 'var(--guide-green-color)' : 'var(--guide-red-color)',
                    width: '100%',
                    margin: '-1rem 0 2rem 0'
                  }}>
                    {emailCheckResult}
                  </div>
                )}
                <Label style={{ textAlign: 'left',marginBottom: '1rem' }}>비밀번호</Label>
                <InputContainer >
                  <SignUpInput
                    type="password"
                    placeholder="비밀번호를 설정해주세요."
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </InputContainer>
                <div style={{
                  fontSize: '0.8rem',
                  marginLeft: '0.4rem',
                  color: password.length > 0 && !validatePassword(password) ? 'var(--guide-red-color)' : 'var(--guide-gray-color)',
                  width: '100%',
                  margin: '-1rem 0 2rem 0'
                }}>
                  {password.length === 0 
                    ? '영문 대/소문자, 숫자, 특수문자를 조합하여 8자 이상 입력해주세요.' 
                    : (!validatePassword(password) 
                        ? '8자 이상으로 비밀번호를 작성해주세요.' 
                        : '영문 대/소문자, 숫자, 특수문자를 조합하여 8자 이상 입력해주세요.')}
                </div>
                <Label style={{ textAlign: 'left', margin: '1rem 0' }}>비밀번호 확인</Label>
                <InputContainer>
                  <SignUpInput
                    type="password"
                    placeholder="설정하신 비밀번호를 입력해주세요."
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </InputContainer>
                {step === 2 && password !== confirmPassword && (
                  <div style={{
                    fontSize: '0.8rem',
                    marginLeft: '0.4rem',
                    color: 'var(--guide-red-color)',
                    width: '100%',
                    margin: '-1rem 0 2rem 0'
                  }}>
                    비밀번호가 일치하지 않습니다. 다시 확인해주세요.
                  </div>
                )}
              </div>
              <NextButton
                onClick={handleCombinedClick}
                disabled={!isStep2Valid()}
                style={{
                  backgroundColor: isStep2Valid() ? '#FF4747' : '#CDCDCD',
                  cursor: isStep2Valid() ? 'pointer' : 'not-allowed',
                }}
              >
                다음
              </NextButton>
            </>
          )}
          {step === 3 && (
            <div style={{ minWidth: '400px',width: '100%', margin: '0 auto' }}>
              <WelcomeMessage>
                <h2>itda에 오신 것을 환영합니다!</h2>
                <p>첫 로그인하시겠어요?</p>
              </WelcomeMessage>
              <NextButton onClick={handleNext}>
                로그인하러 가기
              </NextButton>
            </div>
          )}
        </SignUpContainer>
      </Container>
    </>
  );
}
