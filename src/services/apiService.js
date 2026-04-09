// json-server 기본 주소 설정
import axios from 'axios';

// axios 인스턴스를 생성해서 export (다른 파일에서 재사용 가능)
export const apiClient = axios.create({
  // 모든 요청에 공통으로 붙는 기본 URL 설정
  // 환경변수(VITE_API_BASE_URL)가 있으면 그 값을 사용
  // 없으면 기본값으로 'http://localhost:3000' 사용
  // 환경변수 없을 시 apiClient.get('/members')면 http://localhost:3000/members에 요청 보냄
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
});

export const transactionService = {
  // 초기 데이터 조회를 위한 GET 호출
  getTransactions() {
    return apiClient.get('/transactions');
  },
};
