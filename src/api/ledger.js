import axios from 'axios';

// 기본 URL 설정 (나중에 주소가 바뀌어도 여기만 수정하면 됩니다)
const API = axios.create({
  baseURL: 'http://localhost:3000',
});

// [기능 1] 모든 거래 내역 가져오기
export const getTransactions = () => API.get('/transactions');

// [기능 2] 예산 설정 데이터 가져오기 (요약 페이지에서 필요)
export const getBudgets = () => API.get('/budgets');

// [기능 3] 카테고리 정보 가져오기 (선택 사항)
export const getCategories = () => API.get('/categories');
