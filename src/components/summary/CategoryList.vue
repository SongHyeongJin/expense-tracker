<template>
  <div class="category-list">
    <div
      v-for="(amount, category) in stats"
      :key="category"
      class="category-item"
    >
      <span class="name">{{ category }}</span>
      <div class="bar-container">
        <div class="bar" :style="{ width: getPercentage(amount) + '%' }"></div>
      </div>
      <span class="amount">{{ formatCurrency(amount) }}</span>
    </div>
  </div>
</template>

<script setup>
import { formatCurrency } from '@/utils/format';

const props = defineProps({
  stats: Object, // { "식비": 50000, "교통비": 20000 } 형태
  totalExpense: Number,
});

// 지출 대비 해당 카테고리 비중 계산
const getPercentage = (amount) => {
  if (props.totalExpense === 0) return 0;
  return ((amount / props.totalExpense) * 100).toFixed(1);
};
</script>

<style scoped>
.category-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  gap: 10px;
}
.name {
  width: 80px;
  font-size: 0.9rem;
}
.bar-container {
  flex: 1;
  height: 8px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
}
.bar {
  height: 100%;
  background: #ff7675;
  transition: width 0.3s ease;
}
.amount {
  width: 100px;
  text-align: right;
  font-weight: bold;
}
</style>
