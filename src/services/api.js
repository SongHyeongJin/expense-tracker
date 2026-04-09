import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // json-server 기본 포트
});

export const transactionService = {
  // 초기 데이터 조회를 위한 GET 호출
  getTransactions() {
    return api.get('/transactions');
  },
};
