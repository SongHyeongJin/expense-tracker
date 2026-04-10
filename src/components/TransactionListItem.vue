<template>
  <div
    class="list-item d-flex justify-content-between align-items-center p-3 mb-2 shadow-sm rounded bg-white"
  >
    <div class="d-flex align-items-center">
      <div class="date-box text-center me-3 p-2 rounded border bg-light">
        <div class="date-text fw-bold text-dark">
          {{ formatYYMMDD(transaction.date) }}
        </div>
        <div class="day-text text-primary small">
          {{ getDayOfWeek(transaction.date) }}
        </div>
      </div>

      <div>
        <div class="fw-bold text-dark">
          {{ transaction.memo || transaction.category }}
        </div>
        <small class="text-muted">{{ transaction.category }}</small>
      </div>
    </div>

    <div class="text-end">
      <div
        :class="isIncome ? 'text-primary' : 'text-danger'"
        class="fw-bold fs-5"
      >
        {{ isIncome ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}원
      </div>

      <span
        class="badge px-2 py-1"
        :class="
          isIncome
            ? 'bg-primary-subtle text-primary'
            : 'bg-danger-subtle text-danger'
        "
        style="font-size: 0.7rem"
      >
        {{ isIncome ? '수입' : '지출' }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { formatCurrency } from '@/utils/format';

const props = defineProps({
  transaction: Object,
});

// 수입 여부를 판별하는 계산된 속성 (데이터 대소문자 방어)
const isIncome = computed(() => {
  return props.transaction.type?.toUpperCase() === 'INCOME';
});

const formatYYMMDD = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
};

const getDayOfWeek = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('ko-KR', { weekday: 'short' });
};
</script>

<style scoped>
.list-item {
  border-left: 5px solid #6f42c1;
  background-color: white;
}
.date-box {
  min-width: 85px;
}
.bg-primary-subtle {
  background-color: #e7f1ff !important;
}
.bg-danger-subtle {
  background-color: #f8d7da !important;
}
</style>
