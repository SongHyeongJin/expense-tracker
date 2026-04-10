<template>
  <LayoutShell>
    <SummaryCard
      :income="summary.totalIncome"
      :expense="summary.totalExpense"
    />

    <div class="bg-white p-3 rounded shadow-sm mb-4 border">
      <div class="row g-2 mb-3">
        <div class="col-md-6 d-flex gap-2">
          <input
            type="date"
            v-model="filters.startDate"
            class="form-control form-control-sm"
          />
          <input
            type="date"
            v-model="filters.endDate"
            class="form-control form-control-sm"
          />
        </div>
        <div class="col-6 col-md-3">
          <select v-model="filters.type" class="form-select form-select-sm">
            <option value="">모든 타입</option>
            <option value="INCOME">수입</option>
            <option value="EXPENSE">지출</option>
          </select>
        </div>
        <div class="col-6 col-md-3">
          <select v-model="filters.category" class="form-select form-select-sm">
            <option value="">모든 카테고리</option>
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>
      </div>

      <div class="d-flex justify-content-between align-items-center">
        <button @click="resetFilters" class="btn btn-sm btn-outline-secondary">
          <i class="bi bi-arrow-counterclockwise"></i> 필터 초기화
        </button>
        <select
          v-model="sortBy"
          class="form-select form-select-sm w-auto border-0 fw-bold text-primary"
        >
          <option value="date_desc">최신순</option>
          <option value="date_asc">오래된순</option>
          <option value="amount_desc">금액순</option>
        </select>
      </div>
    </div>

    <div v-if="store.loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <div v-else class="transaction-list">
      <TransactionListItem
        v-for="item in filteredTransactions"
        :key="item.id"
        :transaction="item"
      />
      <div
        v-if="filteredTransactions.length === 0"
        class="text-center py-5 text-muted"
      >
        검색 결과가 없습니다.
      </div>
    </div>
  </LayoutShell>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { calculateSummary } from '@/utils/summary';

import LayoutShell from '@/components/LayoutShell.vue';
import SummaryCard from '@/components/SummaryCard.vue';
import TransactionListItem from '@/components/TransactionListItem.vue';

const store = useTransactionStore();
const sortBy = ref('date_desc');

// 1. 필터 상태 통합 관리
const filters = reactive({
  startDate: '',
  endDate: '',
  type: '',
  category: '',
});

onMounted(() => {
  store.fetchTransactions();
});

// 2. 동적 카테고리 추출
const categories = computed(() => {
  const cats = store.transactions.map((t) => t.category);
  return [...new Set(cats)].filter(Boolean).sort();
});

// 3. 필터 초기화 로직
const resetFilters = () => {
  filters.startDate = '';
  filters.endDate = '';
  filters.type = '';
  filters.category = '';
};

// 4. 누적 필터링 및 정렬
const filteredTransactions = computed(() => {
  return store.transactions
    .filter((item) => {
      const matchType =
        !filters.type || item.type.toUpperCase() === filters.type.toUpperCase();
      const matchCategory =
        !filters.category || item.category === filters.category;
      let matchDate = true;
      if (filters.startDate && filters.endDate) {
        matchDate =
          item.date >= filters.startDate && item.date <= filters.endDate;
      }
      return matchType && matchCategory && matchDate;
    })
    .sort((a, b) => {
      if (sortBy.value === 'date_desc')
        return new Date(b.date) - new Date(a.date);
      if (sortBy.value === 'date_asc')
        return new Date(a.date) - new Date(b.date);
      if (sortBy.value === 'amount_desc')
        return Number(b.amount) - Number(a.amount);
      return 0;
    });
});

// 5. 요약 정보 계산
const summary = computed(() => {
  return calculateSummary(filteredTransactions.value);
});
</script>
