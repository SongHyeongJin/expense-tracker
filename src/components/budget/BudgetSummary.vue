<template>
  <section class="budget-summary">
    <h2 class="budget-summary__title">예산 현황</h2>

    <div class="budget-summary__cards">
      <article class="budget-summary__card">
        <p class="budget-summary__label">현재 지출</p>
        <p class="budget-summary__value">
          {{ formatCurrency(expenseTotal) }}
        </p>
      </article>

      <article class="budget-summary__card">
        <p class="budget-summary__label">남은 예산</p>
        <p
          class="budget-summary__value"
          :class="{ 'budget-summary__value--muted': !isBudgetSet }"
        >
          {{ isBudgetSet ? formatCurrency(remainingBudget) : '미설정' }}
        </p>
      </article>

      <article class="budget-summary__card">
        <p class="budget-summary__label">소진율</p>
        <p
          class="budget-summary__value"
          :class="{ 'budget-summary__value--muted': !isBudgetSet }"
        >
          {{ isBudgetSet ? `${usageRate}%` : '-' }}
        </p>
      </article>
    </div>

    <div class="budget-summary__progress-wrapper">
      <div v-if="isBudgetSet" class="budget-summary__progress-bar">
        <div
          class="budget-summary__progress-fill"
          :class="progressStatusClass"
          :style="{ width: progressWidth }"
        />
      </div>
      <p
        class="budget-summary__status"
        :class="
          isBudgetSet ? progressStatusClass : 'budget-summary__status--empty'
        "
      >
        {{ statusText }}
      </p>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  expenseTotal: {
    type: Number,
    default: 0,
  },
  remainingBudget: {
    type: Number,
    default: 0,
  },
  usageRate: {
    type: Number,
    default: 0,
  },
  isBudgetSet: {
    type: Boolean,
    default: true,
  },
  status: {
    type: String,
    default: 'safe',
  },
});

const progressWidth = computed(() => {
  if (props.usageRate < 0) return '0%';
  if (props.usageRate > 100) return '100%';
  return `${props.usageRate}%`;
});

const progressStatusClass = computed(() => {
  return `is-${props.status}`;
});

const statusText = computed(() => {
  if (!props.isBudgetSet) {
    return props.expenseTotal > 0
      ? '이번 달 지출은 있지만 예산이 아직 설정되지 않았어요.'
      : '이번 달 예산이 아직 설정되지 않았어요.';
  }

  switch (props.status) {
    case 'caution':
      return '예산의 80% 이상을 사용했어요.';
    case 'warning':
      return '예산의 90% 이상을 사용했어요.';
    case 'exceeded':
      return '예산을 초과했어요.';
    case 'safe':
    default:
      return '예산이 안정적인 범위예요.';
  }
});

function formatCurrency(amount) {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(amount);
}
</script>

<style scoped>
.budget-summary {
  padding: 24px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background-color: #ffffff;
}

.budget-summary__title {
  margin: 0 0 20px;
  font-size: 20px;
  font-weight: 700;
  color: #111827;
}

.budget-summary__cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.budget-summary__card {
  padding: 16px;
  border-radius: 12px;
  background-color: #f9fafb;
}

.budget-summary__label {
  margin: 0 0 8px;
  font-size: 14px;
  color: #6b7280;
}

.budget-summary__value {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #111827;
}

.budget-summary__value--muted {
  color: #6b7280;
}

.budget-summary__progress-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.budget-summary__progress-bar {
  width: 100%;
  height: 12px;
  overflow: hidden;
  border-radius: 9999px;
  background-color: #e5e7eb;
}

.budget-summary__progress-fill {
  height: 100%;
  border-radius: 9999px;
  transition: width 0.3s ease;
}

.budget-summary__status {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.budget-summary__status--empty {
  color: #6b7280;
}

.is-safe {
  color: #16a34a;
  background-color: #16a34a;
}

.is-caution {
  color: #f59e0b;
  background-color: #f59e0b;
}

.is-warning {
  color: #ef4444;
  background-color: #ef4444;
}

.is-exceeded {
  color: #b91c1c;
  background-color: #b91c1c;
}

/* status text에는 배경색이 필요 없어서 별도 보정 */
.budget-summary__status.is-safe,
.budget-summary__status.is-caution,
.budget-summary__status.is-warning,
.budget-summary__status.is-exceeded {
  background-color: transparent;
}

@media (max-width: 768px) {
  .budget-summary__cards {
    grid-template-columns: 1fr;
  }
}
</style>
