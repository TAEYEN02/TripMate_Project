import React from "react";
import styled from "styled-components";

// 전체 폼 래퍼
const FormWrapper = styled.div`
  padding: 1rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// 입력 필드 컨테이너
const Field = styled.div`
  display: flex;
  flex-direction: column;
`;

// 레이블
const Label = styled.label`
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
  color: #2d3748;
`;

// 인풋
const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
  font-size: 1rem;
  width: 100%;
  &:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.3);
  }
`;

// 버튼
const SubmitButton = styled.button`
  background-color: #4299e1;
  color: white;
  padding: 0.5rem 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #3182ce;
  }
`;

const TransportForm = ({ form, setForm, onSubmit }) => {
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <FormWrapper>
      <Field>
        <Label>출발지</Label>
        <Input
          type="text"
          name="departure"
          value={form.departure}
          onChange={handleChange}
          placeholder="서울"
        />
      </Field>

      <Field>
        <Label>도착지</Label>
        <Input
          type="text"
          name="arrival"
          value={form.arrival}
          onChange={handleChange}
          placeholder="부산"
        />
      </Field>

      <Field>
        <Label>날짜</Label>
        <Input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
        />
      </Field>

      <SubmitButton onClick={onSubmit}>교통편 추천받기</SubmitButton>
    </FormWrapper>
  );
};

export default TransportForm;
