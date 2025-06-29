import React from "react";
import styled from "styled-components";

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Label = styled.label`
  font-weight: 600;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const SubmitButton = styled.button`
  background-color: #48bb78;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background-color: #38a169;
  }
`;

const TransportForm = ({ form, setForm, onSubmit }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <FormWrapper
      onSubmit={e => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div>
        <Label htmlFor="departure">출발지</Label>
        <Input
          type="text"
          id="departure"
          name="departure"
          value={form.departure}
          onChange={handleChange}
          placeholder="출발 도시 입력"
          required
        />
      </div>

      <div>
        <Label htmlFor="arrival">도착지</Label>
        <Input
          type="text"
          id="arrival"
          name="arrival"
          value={form.arrival}
          onChange={handleChange}
          placeholder="도착 도시 입력"
          required
        />
      </div>

      <div>
        <Label htmlFor="date">날짜</Label>
        <Input
          type="date"
          id="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="timeRange">시간대 선택 (선택사항)</Label>
        <Select
          id="timeRange"
          name="timeRange"
          value={form.timeRange || ""}
          onChange={handleChange}
        >
          <option value="">전체 시간</option>
          <option value="morning">오전 (05:00~11:59)</option>
          <option value="afternoon">오후 (12:00~17:59)</option>
          <option value="evening">저녁 (18:00~22:59)</option>
        </Select>
      </div>

      <SubmitButton type="submit">교통편 검색</SubmitButton>
    </FormWrapper>
  );
};

export default TransportForm;
