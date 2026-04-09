<template>
  <div
    class="list-item d-flex justify-content-between align-items-center p-3 mb-2 shadow-sm rounded"
  >
    <div class="d-flex align-items-center">
      <div class="date-box text-center me-3 p-2 rounded shadow-sm">
        <div class="small text-muted">{{ getDay(transaction.date) }}</div>
        <div class="fw-bold">{{ getDate(transaction.date) }}</div>
      </div>
      <div>
        <div class="fw-bold">
          {{ transaction.memo || transaction.category }}
        </div>
        <small class="text-muted">{{ transaction.category }}</small>
      </div>
    </div>
    <div
      :class="transaction.type === 'INCOME' ? 'text-primary' : 'text-danger'"
      class="fw-bold"
    >
      {{ transaction.type === 'INCOME' ? '+' : '-'
      }}{{ formatCurrency(transaction.amount) }}원
    </div>
  </div>
</template>

<script setup>
import { formatCurrency } from '@/utils/format';

const props = defineProps({
  transaction: Object,
});

const getDay = (dateStr) =>
  new Date(dateStr).toLocaleDateString('ko-KR', { weekday: 'short' });
const getDate = (dateStr) => new Date(dateStr).getDate();
</script>

<style scoped></style>
