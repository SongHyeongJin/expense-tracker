import { defineStore } from 'pinia';
import { getTransactions, getBudgets } from '@/api/ledger'; // 함수 이름 매칭 확인!

export const useLedgerStore = defineStore('ledger', {
  state: () => ({
    transactions: [],
    budgets: [],
    currentDate: new Date(),
    viewType: 'month',
  }),
  actions: {
    async loadData() {
      try {
        // axios는 데이터가 .data 안에 들어있으므로 { data }로 구조분해 할당합니다.
        const [transRes, budgetRes] = await Promise.all([
          getTransactions(),
          getBudgets(),
        ]);

        this.transactions = transRes.data;
        this.budgets = budgetRes.data;
      } catch (error) {
        console.error('데이터를 불러오는 중 오류가 발생했습니다:', error);
      }
    },
  },
});
