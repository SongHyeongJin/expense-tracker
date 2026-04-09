import { defineStore } from 'pinia';
import api from '@/services/api';

export const useTransactionStore = defineStore('transactions', {
  state: () => ({
    transactions: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchTransactions() {
      this.loading = true;
      try {
        const response = await api.getTransactions();
        this.transactions = response.data;
      } catch (err) {
        this.error = '데이터를 불러오는데 실패했습니다.';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
  },
});
