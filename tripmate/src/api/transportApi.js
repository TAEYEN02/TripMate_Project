import axios from 'axios';

export const searchTransport = async ({ departure, arrival, date }) => {
  const response = await axios.post('/api/transport/search', {
    departure,
    arrival,
    date,
  });
  return response.data;
};