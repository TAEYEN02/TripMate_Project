import styled from "styled-components";

const Card = styled.div`
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  background-color: white;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  }
`;

const Title = styled.h4`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Text = styled.p`
  margin: 0.25rem 0;
  font-size: 0.95rem;
  color: #4a5568;
`;

const PlaceScheduleCard = ({ place }) => {
  return (
    <Card>
      <Title>{place.name}</Title>
      <Text>카테고리: {place.category}</Text>
      <Text>위치: {place.address}</Text>
      <Text>추천 시간대: {place.recommendedTime || "전체 시간"}</Text>
    </Card>
  );
};

export default PlaceScheduleCard;
