<template>
  <LayoutShell>
    <div class="transactions-page">
      <header class="page-header">
        <div class="title-group">
          <span class="eyebrow">거래내역</span>
          <h1>전체 거래 조회</h1>
        </div>

        <button type="button" class="reset-button" @click="resetFilters">
          필터 초기화
        </button>
      </header>

      <section class="panel filter-panel">
        <div class="filter-grid">
          <label class="filter-field">
            <span>유형</span>
            <select v-model="filters.type">
              <option value="">전체</option>
              <option value="INCOME">수입</option>
              <option value="EXPENSE">지출</option>
            </select>
          </label>

          <label class="filter-field">
            <span>카테고리</span>
            <select v-model="filters.category">
              <option value="">전체</option>
              <option
                v-for="category in categories"
                :key="category"
                :value="category"
              >
                {{ category }}
              </option>
            </select>
          </label>

          <label class="filter-field">
            <span>기간</span>
            <select v-model="datePreset" @change="applyDatePreset">
              <option value="all">전체</option>
              <option value="today">오늘</option>
              <option value="month">이번 달</option>
            </select>
          </label>

          <label class="filter-field">
            <span>시작일</span>
            <input type="date" v-model="filters.startDate" />
          </label>

          <label class="filter-field">
            <span>종료일</span>
            <input type="date" v-model="filters.endDate" />
          </label>

          <label class="filter-field">
            <span>정렬 기준</span>
            <select v-model="sortBy">
              <option value="date">날짜</option>
              <option value="amount">금액</option>
            </select>
          </label>

          <label class="filter-field">
            <span>정렬 방향</span>
            <select v-model="sortOrder">
              <option value="desc">내림차순</option>
              <option value="asc">오름차순</option>
            </select>
          </label>
        </div>
      </section>

      <section class="stats-grid">
        <article class="panel stat-card">
          <span class="stat-label">필터 수입</span>
          <strong class="stat-value income"
            >₩{{ formatCurrency(summary.totalIncome) }}</strong
          >
        </article>

        <article class="panel stat-card">
          <span class="stat-label">필터 지출</span>
          <strong class="stat-value expense"
            >₩{{ formatCurrency(summary.totalExpense) }}</strong
          >
        </article>

        <article class="panel stat-card">
          <span class="stat-label">거래 건수</span>
          <strong class="stat-value count">{{
            filteredTransactions.length
          }}</strong>
          <span class="stat-unit">건</span>
        </article>
      </section>

      <section class="panel category-panel">
        <div class="panel-heading">
          <h2>카테고리별 요약</h2>
          <span class="panel-caption">현재 필터 기준</span>
        </div>

        <div v-if="categoryStats.length" class="category-grid">
          <article
            v-for="stat in categoryStats"
            :key="`${stat.type}-${stat.name}`"
            class="category-row"
          >
            <div class="category-left">
              <span class="category-type">{{
                stat.type === 'INCOME' ? '수입' : '지출'
              }}</span>
              <strong>{{ stat.name }}</strong>
            </div>

            <div class="category-right">
              <span>{{ stat.count }}건</span>
              <strong
                :class="
                  stat.type === 'INCOME' ? 'ratio-income' : 'ratio-expense'
                "
              >
                {{ stat.percentage }}%
              </strong>
            </div>
          </article>
        </div>

        <div v-else class="empty-state">조건에 맞는 거래가 없습니다.</div>
      </section>

      <section class="panel list-panel">
        <div class="panel-heading">
          <h2>거래 목록</h2>
          <span class="panel-caption"
            >{{ filteredTransactions.length }}건 표시 중</span
          >
        </div>

        <div v-if="filteredTransactions.length" class="transaction-list">
          <TransactionListItem
            v-for="item in filteredTransactions"
            :key="item.id"
            :transaction="item"
            @delete="handleDeleteTransaction"
          />
        </div>

        <div v-else class="empty-state">표시할 거래가 없습니다.</div>
      </section>
    </div>
  </LayoutShell>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import LayoutShell from '@/components/LayoutShell.vue';
import TransactionListItem from '@/components/TransactionListItem.vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { formatCurrency } from '@/utils/format';
import { calculateSummary } from '@/utils/summary';

const store = useTransactionStore();
const datePreset = ref('all');
const sortBy = ref('date');
const sortOrder = ref('desc');
const deletingId = ref(null);
const filters = reactive({
  startDate: '',
  endDate: '',
  type: '',
  category: '',
});

onMounted(() => {
  store.fetchTransactions();
});

const categories = computed(() => {
  const names = store.transactions.map((transaction) => transaction.category);
  return [...new Set(names)].filter(Boolean).sort();
});

const toDateValue = (date) => {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
};

const applyDatePreset = () => {
  const today = new Date();

  if (datePreset.value === 'today') {
    const value = toDateValue(today);
    filters.startDate = value;
    filters.endDate = value;
    return;
  }

  if (datePreset.value === 'month') {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    filters.startDate = toDateValue(start);
    filters.endDate = toDateValue(end);
    return;
  }

  filters.startDate = '';
  filters.endDate = '';
};

const resetFilters = () => {
  filters.type = '';
  filters.category = '';
  filters.startDate = '';
  filters.endDate = '';
  datePreset.value = 'all';
  sortBy.value = 'date';
  sortOrder.value = 'desc';
};

const filteredTransactions = computed(() => {
  const result = store.transactions.filter((transaction) => {
    const transactionType =
      transaction.type?.toUpperCase?.() ?? transaction.type;
    const matchesType = !filters.type || transactionType === filters.type;
    const matchesCategory =
      !filters.category || transaction.category === filters.category;
    const matchesStart =
      !filters.startDate || transaction.date >= filters.startDate;
    const matchesEnd = !filters.endDate || transaction.date <= filters.endDate;

    return matchesType && matchesCategory && matchesStart && matchesEnd;
  });

  return result.sort((left, right) => {
    const baseComparison =
      sortBy.value === 'amount'
        ? Number(right.amount) - Number(left.amount)
        : new Date(right.date) - new Date(left.date);

    return sortOrder.value === 'desc' ? baseComparison : -baseComparison;
  });
});

const summary = computed(() => calculateSummary(filteredTransactions.value));

const categoryStats = computed(() => {
  if (!filteredTransactions.value.length) return [];

  const totalAmount =
    Number(summary.value.totalIncome || 0) +
    Number(summary.value.totalExpense || 0);

  const groups = filteredTransactions.value.reduce((accumulator, item) => {
    const key = `${item.type}-${item.category}`;

    if (!accumulator[key]) {
      accumulator[key] = {
        name: item.category,
        type: item.type?.toUpperCase?.() ?? item.type,
        count: 0,
        amount: 0,
      };
    }

    accumulator[key].count += 1;
    accumulator[key].amount += Number(item.amount);
    return accumulator;
  }, {});

  return Object.values(groups)
    .map((item) => ({
      ...item,
      percentage: totalAmount
        ? ((item.amount / totalAmount) * 100).toFixed(1)
        : '0.0',
    }))
    .sort((left, right) => right.amount - left.amount);
});

const handleDeleteTransaction = async (transaction) => {
  const name = transaction.memo || transaction.category || '이 거래';
  const confirmed = window.confirm(`"${name}" 항목을 삭제할까요?`);

  if (!confirmed) return;

  deletingId.value = transaction.id;

  try {
    await store.deleteTransaction(transaction.id);
  } catch (error) {
    window.alert('거래 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
  } finally {
    deletingId.value = null;
  }
};
</script>

<style scoped>
.transactions-page {
  max-width: 1320px;
  margin: 0 auto;
  padding: 28px 24px 40px;
}

.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.title-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.eyebrow {
  color: #6b7280;
  font-size: 1rem;
  font-weight: 700;
}

.title-group h1 {
  margin: 0;
  color: #111827;
  font-size: clamp(2.2rem, 3vw, 3.2rem);
  font-weight: 900;
  letter-spacing: -0.05em;
}

.panel {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}

.reset-button {
  padding: 14px 18px;
  border: 1px solid #d1d5db;
  border-radius: 16px;
  background: #ffffff;
  color: #374151;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.reset-button:hover {
  border-color: #9ca3af;
  box-shadow: 0 12px 20px rgba(15, 23, 42, 0.08);
  transform: translateY(-1px);
}

.filter-panel {
  padding: 22px;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 16px;
}

.filter-field {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.filter-field span {
  color: #374151;
  font-size: 1rem;
  font-weight: 800;
}

.filter-field select,
.filter-field input {
  width: 100%;
  min-height: 50px;
  padding: 0 16px;
  border: 1px solid #d7dde5;
  border-radius: 14px;
  background: #ffffff;
  color: #111827;
  font: inherit;
  box-sizing: border-box;
}

.filter-field select:focus,
.filter-field input:focus {
  outline: 3px solid rgba(247, 201, 72, 0.24);
  border-color: #f7c948;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  margin-top: 28px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 142px;
  padding: 24px;
}

.stat-label {
  color: #6b7280;
  font-size: 1rem;
  font-weight: 800;
}

.stat-value {
  color: #111827;
  font-size: clamp(2rem, 2vw, 2.8rem);
  font-weight: 900;
  letter-spacing: -0.05em;
}

.stat-value.income {
  color: #4aa27b;
}

.stat-value.expense {
  color: #d14334;
}

.stat-value.count {
  color: #3864e8;
}

.stat-unit {
  color: #6b7280;
  font-size: 1rem;
  font-weight: 800;
}

.category-panel,
.list-panel {
  margin-top: 28px;
  padding: 22px;
}

.panel-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.panel-heading h2 {
  margin: 0;
  color: #111827;
  font-size: 1.95rem;
  font-weight: 900;
  letter-spacing: -0.04em;
}

.panel-caption {
  color: #6b7280;
  font-size: 0.95rem;
  font-weight: 700;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.category-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 16px 18px;
  border-radius: 16px;
  background: #f9fafb;
}

.category-left,
.category-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.category-left strong,
.category-right strong {
  color: #111827;
  font-size: 1rem;
}

.category-type,
.category-right span {
  color: #6b7280;
  font-size: 0.95rem;
  font-weight: 700;
}

.ratio-income {
  color: #4aa27b;
}

.ratio-expense {
  color: #d14334;
}

.transaction-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.empty-state {
  padding: 48px 20px;
  border-radius: 18px;
  background: #f9fafb;
  color: #6b7280;
  text-align: center;
  font-size: 1rem;
  font-weight: 700;
}

@media (max-width: 1180px) {
  .filter-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .transactions-page {
    padding: 22px 16px 32px;
  }

  .page-header,
  .panel-heading {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-grid,
  .stats-grid,
  .category-grid {
    grid-template-columns: 1fr;
  }
}
</style>
