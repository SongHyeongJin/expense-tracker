<template>
  <div class="summary-section row g-3 mb-4">
    <div class="col-6">
      <div class="card shadow-sm border-0 bg-light p-3">
        <div class="text-muted small">이번 달 수입</div>
        <div class="h4 fw-bold text-primary mb-0">
          {{ formatCurrency(income) }}원
        </div>
      </div>
    </div>
    <div class="col-6">
      <div class="card shadow-sm border-0 bg-light p-3">
        <div class="text-muted small">이번 달 지출</div>
        <div class="h4 fw-bold text-danger mb-0">
          {{ formatCurrency(expense) }}원
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatCurrency } from '@/utils/format';
defineProps({
  income: Number,
  expense: Number,
});
</script>
