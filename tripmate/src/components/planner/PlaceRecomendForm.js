import { useState } from "react";
import styled from "styled-components";

const Card = styled.div`
  max-width: 400px;
  margin: 4px auto;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 3px;
  color: #333;
`;

const Input = styled.input`
  padding: 0.6rem 0.8rem;
  border: 1.8px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  &:focus {
    outline: none;
    border-color: #0077ff;
  }
`;

const Button = styled.button`
  padding: 0.75rem;
  background-color: #0077ff;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.25s ease;
  &:hover {
    background-color: #005fcc;
  }
`;

const ScheduleForm = ({ onSubmit }) => {
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!departure || !arrival) {
      alert("출발지, 도착지는 필수입니다.");
      return;
    }
    onSubmit({ departure, arrival });
  };

  return (
    <Card>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="departure">출발지:</Label>
          <Input
            id="departure"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            placeholder="서울"
            autoComplete="off"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="arrival">도착지:</Label>
          <Input
            id="arrival"
            value={arrival}
            onChange={(e) => setArrival(e.target.value)}
            placeholder="부산"
            autoComplete="off"
          />
        </FormGroup>
        <Button type="submit">추천</Button>
      </Form>
    </Card>
  );
};

export default ScheduleForm;
