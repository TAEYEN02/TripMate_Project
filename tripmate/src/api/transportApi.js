import axios from 'axios';
import DateRangeModal from "../components/Modal/DateRangeModal";
import TimeSelectModal from "../components/Modal/TimeSelectModal";
import TransportSelectModal from "../components/Modal/TransportSelectModal";

export const searchTransport = async ({ departure, arrival, date }) => {
  const response = await axios.post('/api/transport/search', {
    departure,
    arrival,
    date,
  });
  return response.data;
};

const BASE_URL = 'http://localhost:10000/api/transport'; // Spring 서버 주소

/**
 * 서울에서 부산으로 가는 교통수단 정보 조회 (고정값)
 * @returns {Promise} 교통수단 정보 (기차 + 버스)
 */
export const getSeoulToBusanTransport = async () => {
  try {
    // GET 방식으로 요청 (고정값: 서울 → 부산, 오늘 날짜)
    const today = new Date().toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD 형식
    const response = await axios.get(
      `${BASE_URL}/search?departure=서울&arrival=부산&date=${today}`
    );

    return response.data;
  } catch (error) {
    console.error('교통수단 정보 조회 실패:', error);
    throw error;
  }
};

/**
 * 사용자 지정 경로로 교통수단 정보 조회
 * @param {Object} params - 조회 파라미터
 * @param {string} params.departure - 출발지
 * @param {string} params.arrival - 도착지
 * @param {string} params.date - 날짜 (YYYYMMDD 형식)
 * @returns {Promise} 교통수단 정보
 */
export const getTransportInfo = async (params) => {
  try {
    const response = await axios.post(`${BASE_URL}/search`, params);
    return response.data;
  } catch (error) {
    console.error('교통수단 정보 조회 실패:', error);
    throw error;
  }
};

/**
 * GET 방식으로 교통수단 정보 조회
 * @param {string} departure - 출발지
 * @param {string} arrival - 도착지
 * @param {string} date - 날짜 (YYYYMMDD 형식)
 * @returns {Promise} 교통수단 정보
 */
export const getTransportInfoByQuery = async (departure, arrival, date) => {
  try {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        departure,
        arrival,
        date
      }
    });

    return response.data;
  } catch (error) {
    console.error('교통수단 정보 조회 실패:', error);
    throw error;
  }
};