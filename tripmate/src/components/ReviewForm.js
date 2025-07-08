import React, { useState } from 'react';
import styled from 'styled-components';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const FormContainer = styled.div`
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-top: 2rem;
`;

const FormTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #343a40;
`;

const InputGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #495057;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
  min-height: 100px;
  resize: vertical;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  margin-top: 1rem;

  &:hover {
    background-color: #0056b3;
  }
`;

function ReviewForm({ scheduleId, onReviewSubmitted }) {
  const { getAuthHeaders } = useAuth();
  const [reviewData, setReviewData] = useState({
    title: '',
    rating: 5, // 기본값 5
    content: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReviewData({ ...reviewData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const headers = getAuthHeaders();
      await api.post(`/reviews/${scheduleId}`, reviewData, { headers });
      alert('리뷰가 성공적으로 작성되었습니다!');
      setReviewData({ title: '', rating: 5, content: '' }); // 폼 초기화
      if (onReviewSubmitted) {
        onReviewSubmitted(); // 부모 컴포넌트에 알림
      }
    } catch (err) {
      console.error('리뷰 작성 실패:', err);
      setError('리뷰 작성 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormContainer>
      <FormTitle>리뷰 작성</FormTitle>
      <form onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="title">제목</Label>
          <Input
            type="text"
            id="title"
            name="title"
            value={reviewData.title}
            onChange={handleChange}
            required
            disabled={submitting}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="rating">평점</Label>
          <Select
            id="rating"
            name="rating"
            value={reviewData.rating}
            onChange={handleChange}
            required
            disabled={submitting}
          >
            {[5, 4, 3, 2, 1].map((num) => (
              <option key={num} value={num}>
                {num}점
              </option>
            ))}
          </Select>
        </InputGroup>

        <InputGroup>
          <Label htmlFor="content">내용</Label>
          <TextArea
            id="content"
            name="content"
            value={reviewData.content}
            onChange={handleChange}
            required
            disabled={submitting}
          />
        </InputGroup>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <Button type="submit" disabled={submitting}>
          {submitting ? '작성 중...' : '리뷰 제출'}
        </Button>
      </form>
    </FormContainer>
  );
}

export default ReviewForm;
