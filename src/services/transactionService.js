// 기록 등록API
import { apiClient } from './apiService';
// 거래(기록) 데이터를 서버에 생성 요청

export const transactionService = {
  // 전체 거래 목록 조회
  async getTransactions() {
    const { data } = await apiClient.get('/transactions', {
      params: { _sort: '-date, -id' },
    });
    return data;
  },
  // 특정 거래 1건 조회
  async getTransaction(id) {
    const { data } = await apiClient.get(`/transactions/${id}`);
    return data;
  },
  // (POST /transactions → 새로운 데이터 추가)
  async createTransaction(transaction) {
    const { data } = await apiClient.post('/transactions', {
      ...transaction,
    });
    return data;
  },

  // 거래 수정
  async updateTransaction(id, transaction) {
    const { data } = await apiClient.patch(`/transactions/${id}`, {
      ...transaction,
    });
    return data;
  },

  // 거래 삭제
  async deleteTransaction(id) {
    await apiClient.delete(`/transactions/${id}`);
  },
};
