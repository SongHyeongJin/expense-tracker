<template>
  <LayoutShell>
    <SummaryCard
      :income="summary.totalIncome"
      :expense="summary.totalExpense"
    />

    <div class="d-flex justify-content-between align-items-center mb-3 px-1">
      <FilterSection @filter-change="handleFilterChange" />

      <select
        v-model="sortBy"
        class="form-select form-select-sm w-auto border-0 bg-transparent fw-bold text-secondary"
      >
        <option value="date_desc">최신순</option>
        <option value="date_asc">오래된순</option>
        <option value="amount_desc">금액 높은순</option>
        <option value="amount_asc">금액 낮은순</option>
      </select>
    </div>

    <div v-if="store.loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2 text-muted">데이터를 가져오는 중...</p>
    </div>

    <div v-else class="transaction-list">
      <TransactionListItem
        v-for="item in filteredTransactions"
        :key="item.id"
        :transaction="item"
      />

      <div
        v-if="filteredTransactions.length === 0"
        class="text-center py-5 bg-white rounded shadow-sm border"
      >
        <p class="text-muted mb-0">조회된 거래 내역이 없습니다.</p>
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
import FilterSection from '@/components/FilterSection.vue';
import TransactionListItem from '@/components/TransactionListItem.vue';

const store = useTransactionStore();

const sortBy = ref('date_desc');
const filters = reactive({
  startDate: '',
  endDate: '',
  type: '',
});

onMounted(async () => {
  await store.fetchTransactions();
});

const handleFilterChange = (newFilters) => {
  Object.assign(filters, newFilters);
};

const filteredTransactions = computed(() => {
  let result = [...store.transactions];

  if (filters.type) {
    result = result.filter(
      (item) => item.type.toUpperCase() === filters.type.toUpperCase(),
    );
  }

  if (filters.startDate && filters.endDate) {
    result = result.filter((item) => {
      return item.date >= filters.startDate && item.date <= filters.endDate;
    });
  }

  result.sort((a, b) => {
    const amtA = Number(String(a.amount).replace(/[^0-9.-]+/g, ''));
    const amtB = Number(String(b.amount).replace(/[^0-9.-]+/g, ''));

    switch (sortBy.value) {
      case 'date_desc':
        return new Date(b.date) - new Date(a.date);
      case 'date_asc':
        return new Date(a.date) - new Date(b.date);
      case 'amount_desc':
        return amtB - amtA;
      case 'amount_asc':
        return amtA - amtB;
      default:
        return 0;
    }
  });

  return result;
});

const summary = computed(() => {
  return calculateSummary(filteredTransactions.value);
});
</script>

<style scoped>
.transaction-list {
  padding-bottom: 100px;
}
.form-select:focus {
  box-shadow: none;
}
</style>
