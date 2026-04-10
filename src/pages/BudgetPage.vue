<template>
  <section class="budget-page">
    <h1 class="budget-page__title">예산 관리</h1>

    <div v-if="isLoading" class="budget-page__message">
      예산 정보를 불러오는 중입니다.
    </div>

    <div
      v-else-if="errorMessage"
      class="budget-page__message budget-page__message--error"
    >
      {{ errorMessage }}
    </div>

    <div v-else>
      <BudgetForm
        :month="selectedMonth"
        :amount="budgetAmount"
        @saved="fetchBudgetSummary"
        @month-change="handleMonthChange"
      />

      <div class="budget-page__meta">
        <p>조회 월: {{ selectedMonth }}</p>
        <p>
          설정 예산:
          {{ isBudgetSet ? formatCurrency(budgetAmount) : '미설정' }}
        </p>
      </div>

      <BudgetSummary
        :expense-total="summary.expenseTotal"
        :remaining-budget="summary.remainingBudget"
        :usage-rate="summary.usageRate"
        :is-budget-set="isBudgetSet"
        :status="summary.status"
      />
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import BudgetForm from '@/components/budget/BudgetForm.vue';
import BudgetSummary from '@/components/budget/BudgetSummary.vue';
import { getBudgetByMonth } from '@/services/budgetService';
import { transactionService } from '@/services/transactionService';
import { createBudgetSummary } from '@/utils/budget';

const selectedMonth = ref(getCurrentMonth());
const budgetAmount = ref(0);
const isBudgetSet = ref(false);
const transactions = ref([]);
const isLoading = ref(false);
const errorMessage = ref('');

const summary = computed(() => {
  return createBudgetSummary({
    transactions: transactions.value,
    budgetAmount: budgetAmount.value,
  });
});

onMounted(async () => {
  await fetchBudgetSummary();
});

watch(selectedMonth, async () => {
  await fetchBudgetSummary();
});

async function fetchBudgetSummary() {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const [budget, monthlyTransactions] = await Promise.all([
      getBudgetByMonth(selectedMonth.value),
      transactionService.getTransactionsByMonth(selectedMonth.value),
    ]);

    isBudgetSet.value = budget !== null;
    budgetAmount.value = budget?.amount ?? 0;
    transactions.value = monthlyTransactions;
  } catch (error) {
    console.error(error);
    errorMessage.value = '예산 정보를 불러오지 못했습니다.';
  } finally {
    isLoading.value = false;
  }
}

function handleMonthChange(month) {
  selectedMonth.value = month;
}

function getCurrentMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(amount);
}
</script>

<style scoped>
.budget-page {
  padding: 24px;
}

.budget-page__title {
  margin: 0 0 20px;
  font-size: 28px;
  font-weight: 700;
}

.budget-page__meta {
  margin-bottom: 20px;
  padding: 16px;
  border-radius: 12px;
  background-color: #f9fafb;
}

.budget-page__meta p {
  margin: 0 0 8px;
}

.budget-page__meta p:last-child {
  margin-bottom: 0;
}

.budget-page__message {
  padding: 16px;
  border-radius: 12px;
  background-color: #f3f4f6;
}

.budget-page__message--error {
  color: #b91c1c;
  background-color: #fee2e2;
}
</style>
