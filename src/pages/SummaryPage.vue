<template>
  <div class="summary-container">
    <header class="page-header">
      <h2>📊 기간별 재정 요약</h2>
      <div class="period-controls">
        <button
          :class="{ active: store.viewType === 'year' }"
          @click="store.viewType = 'year'"
        >
          연별
        </button>
        <button
          :class="{ active: store.viewType === 'month' }"
          @click="store.viewType = 'month'"
        >
          월별
        </button>
        <button
          :class="{ active: store.viewType === 'week' }"
          @click="store.viewType = 'week'"
        >
          주별
        </button>
      </div>
      <p class="current-date-display">
        기준 기간: <strong>{{ displayPeriod }}</strong>
      </p>
    </header>

    <section class="summary-section">
      <div class="card-grid">
        <SummaryCard
          label="총 수입"
          :amount="summary.totalIncome"
          type="income"
        />
        <SummaryCard
          label="총 지출"
          :amount="summary.totalExpense"
          type="expense"
        />
        <SummaryCard label="순이익" :amount="summary.netProfit" type="profit" />
      </div>
    </section>

    <section class="stats-section">
      <h3>📁 카테고리별 지출 현황</h3>
      <div v-if="filteredTransactions.length === 0" class="empty-state">
        <p>해당 기간의 거래 내역이 없습니다.</p>
      </div>
      <div v-else class="stats-content">
        <CategoryList
          :stats="categoryStats"
          :totalExpense="summary.totalExpense"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useLedgerStore } from '@/stores/ledgerStore';
import SummaryCard from '@/components/summary/SummaryCard.vue';
import CategoryList from '@/components/summary/CategoryList.vue';

const store = useLedgerStore();

onMounted(() => {
  store.loadData();
});

const displayPeriod = computed(() => {
  const y = store.currentDate.getFullYear();
  const m = store.currentDate.getMonth() + 1;
  if (store.viewType === 'year') return `${y}년 전체`;
  if (store.viewType === 'month') return `${y}년 ${m}월`;
  return `${y}년 ${m}월 현재 주차`;
});

const filteredTransactions = computed(() => {
  const year = store.currentDate.getFullYear();
  const month = String(store.currentDate.getMonth() + 1).padStart(2, '0');

  return store.transactions.filter((t) => {
    if (store.viewType === 'year') return t.date.startsWith(`${year}`);
    if (store.viewType === 'month')
      return t.date.startsWith(`${year}-${month}`);
    if (store.viewType === 'week') {
      const tDate = new Date(t.date);
      const tempDate = new Date(store.currentDate);
      const startOfWeek = new Date(
        tempDate.setDate(tempDate.getDate() - tempDate.getDay()),
      );
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return tDate >= startOfWeek && tDate <= endOfWeek;
    }
    return true;
  });
});

const summary = computed(() => {
  return filteredTransactions.value.reduce(
    (acc, curr) => {
      if (curr.type === 'income') acc.totalIncome += curr.amount;
      else acc.totalExpense += curr.amount;
      acc.netProfit = acc.totalIncome - acc.totalExpense;
      return acc;
    },
    { totalIncome: 0, totalExpense: 0, netProfit: 0 },
  );
});

const categoryStats = computed(() => {
  const stats = {};
  filteredTransactions.value
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      stats[t.category] = (stats[t.category] || 0) + t.amount;
    });
  return stats;
});
</script>

<style scoped>
/* 기존 스타일에서 예산 관련 부분만 빼고 유지 */
.summary-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
.page-header {
  text-align: center;
  margin-bottom: 30px;
}
.period-controls {
  margin: 15px 0;
  display: flex;
  justify-content: center;
  gap: 10px;
}
.period-controls button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 20px;
  cursor: pointer;
}
.period-controls button.active {
  background: #4a90e2;
  color: white;
  border-color: #4a90e2;
}
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}
.stats-section {
  background: #f9f9f9;
  padding: 25px;
  border-radius: 15px;
}
.empty-state {
  text-align: center;
  padding: 50px 0;
  color: #999;
}
</style>
