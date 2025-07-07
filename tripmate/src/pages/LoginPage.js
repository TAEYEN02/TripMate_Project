import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import {
  Wrapper,
  Form,
  Title,
  Input,
  Button,
  ButtonWrap,
  InputGroup,
  Label,
  ErrorMessage,
  FindAccountLink,
  FindAccountWrap,
  Separator,
} from "../components/common/StyledComponents";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginData, setLoginData] = useState({
    userId: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [failCount, setFailCount] = useState(0);
  const [lockUntil, setLockUntil] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (lockUntil && new Date() < lockUntil) {
      setErrorMsg('로그인 3회 실패');
      return;
    }

    if (!loginData.userId.trim() || !loginData.password.trim()) {
      setErrorMsg("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      const response = await apiLogin(loginData);
      login(response.accessToken, response.user);
      setErrorMsg("");
      setFailCount(0);
      setLockUntil(null);
      navigate("/");
    } catch (error) {
      const newFailCount = failCount + 1;
      setFailCount(newFailCount);
    }
  };

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (!lockUntil) return;

    const timer = setInterval(() => {
      if (new Date() > lockUntil) {
        setFailCount(0);
        setLockUntil(null);
        setErrorMsg("");
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lockUntil]);

  const isLocked = lockUntil && new Date() < lockUntil;

  return (
    <Wrapper>
      <Form onSubmit={handleLogin}>
        <Title>로그인</Title>

        <InputGroup>
          <Label htmlFor="userId">아이디</Label>
          <Input
            type="text"
            id="userId"
            name="userId"
            placeholder="아이디를 입력해주세요."
            value={loginData.userId}
            onChange={handleChange}
            disabled={isLocked}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="password">비밀번호</Label>
          <Input
            type="password"
            id="password"
            name="password"
            placeholder="비밀번호를 입력해주세요."
            value={loginData.password}
            onChange={handleChange}
            disabled={isLocked}
          />
        </InputGroup>

        {errorMsg && <ErrorMessage>{errorMsg}</ErrorMessage>}

        <ButtonWrap>
          <Button type="submit" disabled={isLocked}>
            로그인
          </Button>
          <Button
            type="button"
            onClick={() => navigate("/signup")}
            style={{ marginTop: "10px" }}
          >
            회원가입
          </Button>
        </ButtonWrap>

        <FindAccountWrap>
          <FindAccountLink href="/find_my/id">아이디 찾기</FindAccountLink>
          <Separator />
          <FindAccountLink href="/find_my/pw">비밀번호 찾기</FindAccountLink>
        </FindAccountWrap>
      </Form>
    </Wrapper>
  );
};

export default Login;
