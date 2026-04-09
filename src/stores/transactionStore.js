// 거래(수입/지출) 상태를 관리하는 pinia Store
// 거래 목록을 저장하고 최신순으로 정렬된 데이터를 제공하며 새로운 거래기록 생성
import { defineStore } from 'pinia';
import { transactionService } from '@/services/transactionService';
import { computed, ref } from 'vue';

export const useTransactionStore = defineStore('transactionStore', () => {
  // 전체 거래 목록
  const transactions = ref([]);

  // 거래 목록을 최신순으로 정렬한 computed 값
  // - 날짜 기준 내림차순 (최신 날짜가 위)
  // - 날짜가 같으면 id 기준 내림차순 정렬
  // - 원본 배열을 변경하지 않기 위해 복사 후 sort 수행
  const sortedTransactions = computed(() =>
    [...transactions.value].sort((a, b) => {
      // 날짜 차이 계산 (b - a → 최신순 정렬)
      const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
      // 날짜가 다르면 날짜 기준으로 정렬
      if (dateDiff !== 0) return dateDiff;
      // 날짜가 같으면 id 기준으로 정렬 (문자열 비교, 내림차순)
      return String(b.id).localeCompare(String(a.id));
    }),
  );
  // 새로운 거래를 생성하는 함수
  async function createTransaction(payload) {
    // 서버에 거래 생성 요청
    const transaction = await transactionService.createTransaction(payload);
    // 생성된 거래를 상태에 추가
    transactions.value = [transaction, ...transactions.value];
    // 생성된 데이터 반환
    return transaction;
  }
  // 외부에서 사용할 상태와 함수 반환
  return {
    transactions, // 원본 거래 목록
    sortedTransactions, // 정렬된 거래 목록
    createTransaction, // 거래 생성 함수
  };
});
