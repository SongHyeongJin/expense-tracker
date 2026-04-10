import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getTransactions, getBudgets } from '@/services/ledger'; // 함수 이름 매칭 확인!

export const useLedgerStore = defineStore('ledger', () => {
  const transactions = ref([]);
  const budgets = ref([]);
  const currentDate = ref(new Date());
  const viewType = ref('month');

  async function loadData() {
    try {
      // axios는 데이터가 .data 안에 들어있으므로 { data }로 구조분해 할당합니다.
      const [transRes, budgetRes] = await Promise.all([
        getTransactions(),
        getBudgets(),
      ]);

      transactions.value = transRes.data;
      budgets.value = budgetRes.data;
    } catch (error) {
      console.error('데이터를 불러오는 중 오류가 발생했습니다:', error);
    }
  }

  return {
    transactions,
    budgets,
    currentDate,
    viewType,
    loadData,
  };
});
