import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/auth";
import {
  Wrapper,
  Form,
  Title,
  Input,
  Button,
  ButtonWrap,
  FindAccountLink,
} from "../components/common/StyledComponents";

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
    if (!validateForm()) {
      return;
    }

    try {
      await signup(signUpData);
      alert("회원가입에 성공했습니다. 로그인 페이지로 이동합니다.");
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
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
        <Input
          type="text"
          name="userId"
          placeholder="아이디"
          onChange={handleChange}
          value={signUpData.userId}
        />
        <Input
          type="password"
          name="password"
          placeholder="비밀번호"
          onChange={handleChange}
          value={signUpData.password}
        />
        <Input
          type="text"
          name="username"
          placeholder="이름"
          onChange={handleChange}
          value={signUpData.username}
        />
        <Input
          type="email"
          name="email"
          placeholder="이메일"
          onChange={handleChange}
          value={signUpData.email}
        />
        {errorMsg && (
          <p style={{ color: "red", marginTop: "10px" }}>{errorMsg}</p>
        )}
        <ButtonWrap>
          <Button type="submit" style={{ marginTop: "10px" }}>
            회원가입
          </Button>
        </ButtonWrap>
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <FindAccountLink onClick={() => navigate("/login")}>
            로그인 화면으로 돌아가기
          </FindAccountLink>
        </div>
      </Form>
    </Wrapper>
  );
}

export default SignUp;
