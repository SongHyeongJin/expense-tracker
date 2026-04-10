// 거래(수입/지출) 상태를 관리하는 pinia Store
// 거래 목록을 저장하고 최신순으로 정렬된 데이터를 제공하며 새로운 거래기록 생성
import { defineStore } from 'pinia';
import { transactionService } from '@/services/transactionService';
import { computed, ref } from 'vue';

export const useTransactionStore = defineStore('transactionStore', () => {
  // 전체 거래 목록
  const transactions = ref([]);
  const loading = ref(false);
  const error = ref('');
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

  async function fetchTransactions() {
    loading.value = true;
    error.value = '';
    try {
      transactions.value = await transactionService.getTransactions();
    } catch (err) {
      error.value = 'json-server에서 거래 데이터를 불러오지 못했습니다.';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // 새로운 거래를 생성하는 함수
  async function createTransaction(payload) {
    // 서버에 거래 생성 요청
    const transaction = await transactionService.createTransaction(payload);
    // 생성된 거래를 상태에 추가
    transactions.value = [transaction, ...transactions.value];
    // 생성된 데이터 반환
    return transaction;
  }
  // 데이터를 수정하는 함수
  async function updateTransaction(id, payload) {
    // 서버에 데이터 수정
    const transaction = await transactionService.updateTransaction(id, payload);
    // 기존 목록에서 해당 id 찾기
    const index = transactions.value.findIndex(
      (item) => String(item.id) === String(id),
    );
    // 해당 항목을 수정된 데이터로 변경
    if (index >= 0) transactions.value[index] = transaction;
    return transaction;
  }
  // 데이터를 삭제하는 함수
  async function deleteTransaction(id) {
    // 서버에 삭제 요청
    await transactionService.deleteTransaction(id);
    // 상태에서도 해당 데이터 제거
    transactions.value = transactions.value.filter(
      (item) => String(item.id) !== String(id),
    );
  }
  // 특정 거래 조회 함수
  function getTransactionById(id) {
    return transactions.value.find((item) => String(item.id) === String(id));
  }

  // 외부에서 사용할 상태와 함수 반환
  return {
    transactions, // 원본 거래 목록
    sortedTransactions, // 정렬된 거래 목록
    loading, // 로딩 상태
    error, // 에러 상태
    fetchTransactions,
    createTransaction, // 거래 생성 함수
    updateTransaction, // 거래 수정 함수
    deleteTransaction, // 거래 삭제 함수
    getTransactionById, // 거래 단건 조회 함수
  };
});
