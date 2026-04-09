<template>
  <div class="card" :class="type">
    <h4>{{ label }}</h4>
    <p>{{ formatCurrency(amount) }}</p>
  </div>
</template>

<script setup>
import { formatCurrency } from '@/utils/format';

defineProps({
  label: String,
  amount: Number,
  type: String, // 'income', 'expense', 'profit' 스타일 구분용
});
</script>

<style scoped>
.card {
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #eee;
  flex: 1;
}
.income p {
  color: #2ecc71;
  font-weight: bold;
}
.expense p {
  color: #e74c3c;
  font-weight: bold;
}
.profit p {
  color: #34495e;
  font-weight: bold;
}
</style>
