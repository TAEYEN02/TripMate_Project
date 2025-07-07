import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/auth";
import styled from "styled-components";

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
} from "../components/common/StyledComponents"

function SignUp() {
  const navigate = useNavigate();
  const [signUpData, setSignUpData] = useState({
    userId: "",
    username: "",
    password: "",
    email: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { userId, password, email } = signUpData;
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("유효한 이메일 주소를 입력해주세요.");
      return false;
    }
    const userIdRegex = /^[A-Za-z0-9]{1,10}$/;
    if (!userIdRegex.test(userId)) {
      setErrorMsg("아이디는 대소문자, 숫자 포함 최대 10자 이내여야 합니다.");
      return false;
    }
    if (password.length < 8) {
      setErrorMsg("비밀번호는 최소 8자 이상이어야 합니다.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await signup(signUpData);
      alert("회원가입에 성공했습니다. 로그인 페이지로 이동합니다.");
      navigate("/login");
    } catch (error) {
      if (error.response?.data?.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg("회원가입 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <Wrapper>
      <Form onSubmit={handleSubmit}>
        <Title>회원가입</Title>

        <InputGroup>
          <Label htmlFor="userId">아이디</Label>
          <Input
            id="userId"
            name="userId"
            placeholder="아이디"
            value={signUpData.userId}
            onChange={handleChange}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="password">비밀번호</Label>
          <Input
            type="password"
            id="password"
            name="password"
            placeholder="비밀번호"
            value={signUpData.password}
            onChange={handleChange}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="username">이름</Label>
          <Input
            id="username"
            name="username"
            placeholder="이름"
            value={signUpData.username}
            onChange={handleChange}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="email">이메일</Label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="이메일"
            value={signUpData.email}
            onChange={handleChange}
          />
        </InputGroup>

        {errorMsg && <ErrorMessage>{errorMsg}</ErrorMessage>}

        <ButtonWrap>
          <Button type="submit">회원가입</Button>
          <FindAccountLink onClick={() => navigate("/login")}>
            로그인 화면으로 돌아가기
          </FindAccountLink>
        </ButtonWrap>
      </Form>
    </Wrapper>
  );
}

export default SignUp;
