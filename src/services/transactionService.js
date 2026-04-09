// 기록 등록API
import { apiClient } from './apiService';
// 거래(기록) 데이터를 서버에 생성 요청
// (POST /transactions → 새로운 데이터 추가)
export const transactionService = {
  async createTransaction(transaction) {
    const { data } = await apiClient.post('/transactions', {
      ...transaction,
    });
    return data;
  },
};
