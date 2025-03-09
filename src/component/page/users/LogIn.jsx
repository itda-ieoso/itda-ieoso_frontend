import { useState, useContext } from "react";
import TopBar from "../../ui/TopBar";
import logoImage from "../../img/logo/itda_logo_symbol.svg";
//import { Checkbox, FormControlLabel } from '@mui/material';
import {
    Container,
    LogoImage,
    LogoText,
    Form,
    Label,
    LoginInput,
    //CheckboxContainer,
    //CustomCheckboxSquare,
    LoginButton,
    SignUpLink,
} from "../../../style/Styles";
import { login, getUsersInfo } from "../../api/usersApi";
import { UsersContext } from "../../contexts/usersContext";

export default function LogIn() {
    const { setUser, setIsUser } = useContext(UsersContext);
    //const [isChecked, setIsChecked] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await login({ email, password });
            const token = response.headers?.authorization?.replace('Bearer ', '');

            if (!token) {
                throw new Error('Authorization 헤더가 존재하지 않습니다.');
            }

            localStorage.setItem('token', token);
            setIsUser(true);

            const userInfo = await getUsersInfo();
            setUser(userInfo.data);
            localStorage.setItem('user', JSON.stringify(userInfo.data));
            
            // 로그인 성공 시에만 리다이렉트
            window.location.href = '/class/list';
        } catch (error) {
            console.error('로그인 실패:', error);

            // 로그인 API에서 발생한 에러일 경우
            if (error.config && error.config.url.includes('/login')) {
                if (error.response?.status === 401) {
                    alert('이메일 또는 비밀번호가 잘못되었습니다.');
                } else {
                    alert(error.response?.data?.message || '로그인 중 오류가 발생했습니다.');
                }
            } else {
                // 다른 API 호출에서 발생한 에러일 경우
                alert('다른 API 호출 중 오류가 발생했습니다. 메인 페이지로 이동합니다.');
                window.location.href = '/';
            }
        }
    };

    return (
        <>
            <TopBar />
            <Container>
                <LogoImage src={logoImage} alt="logo" />
                <LogoText>로그인</LogoText>
                <div style={{ minWidth: '300px', width: '40%', margin: '0 auto' }}>
                    <Form onSubmit={handleLogin}>
                        <Label>이메일</Label>
                        <LoginInput
                            type="text"
                            placeholder="이메일을 입력해주세요."
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <Label>비밀번호</Label>
                        <LoginInput
                            type="password"
                            placeholder="비밀번호를 입력해주세요."
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {/* 
                        <CheckboxContainer>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        icon={CustomCheckboxSquare(false)}
                                        checkedIcon={CustomCheckboxSquare(true)}
                                        checked={isChecked}
                                        onChange={() => setIsChecked(!isChecked)}
                                    />
                                }
                                label="자동 로그인"
                                style={{ margin: 0 }}  // 여백 제거로 높이 일치
                            />
                        </CheckboxContainer>
                        */}
                        <LoginButton
                            style={{ fontSize: '1rem', marginTop: '25px' }}
                            type="submit"
                        >로그인</LoginButton>
                    <SignUpLink>
                        계정이 없으신가요? <a href="/signup">회원가입하기</a>
                    </SignUpLink>
                </Form>
                </div>
            </Container>
        </>
    );
}