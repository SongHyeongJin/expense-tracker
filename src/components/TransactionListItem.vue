<template>
  <article class="transaction-item">
    <div class="transaction-date">
      <strong>{{ formatShortDate(transaction.date) }}</strong>
      <span>{{ getDayOfWeek(transaction.date) }}</span>
    </div>

    <div class="transaction-body">
      <div class="transaction-main">
        <strong>{{ transaction.memo || transaction.category }}</strong>
        <span>{{ transaction.category }}</span>
      </div>

      <div class="transaction-meta">
        <span class="type-badge" :class="isIncome ? 'income' : 'expense'">
          {{ isIncome ? '수입' : '지출' }}
        </span>
        <strong :class="isIncome ? 'amount-income' : 'amount-expense'">
          {{ isIncome ? '+' : '-' }}₩{{ formatCurrency(transaction.amount) }}
        </strong>
        <div class="transaction-actions">
          <RouterLink
            :to="`/transactions/${transaction.id}/edit`"
            class="action-button edit"
          >
            수정
          </RouterLink>
          <button
            type="button"
            class="action-button delete"
            @click="emitDelete"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { formatCurrency } from '@/utils/format';

const props = defineProps({
  transaction: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['delete']);

const isIncome = computed(
  () => props.transaction.type?.toUpperCase() === 'INCOME',
);

const emitDelete = () => {
  emit('delete', props.transaction);
};

const formatShortDate = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}.${day}`;
};

const getDayOfWeek = (dateString) => {
  if (!dateString) return '';
  return new Intl.DateTimeFormat('ko-KR', { weekday: 'short' }).format(
    new Date(dateString),
  );
};
</script>

<style scoped>
.transaction-item {
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  gap: 18px;
  align-items: center;
  padding: 18px 20px;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  background: #ffffff;
}

.transaction-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-height: 74px;
  border-radius: 16px;
  background: #f8fafc;
  color: #475569;
}

.transaction-date strong {
  color: #111827;
  font-size: 1.05rem;
}

.transaction-date span {
  font-size: 0.86rem;
  font-weight: 700;
}

.transaction-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.transaction-main {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.transaction-main strong {
  color: #111827;
  font-size: 1.02rem;
}

.transaction-main span {
  color: #6b7280;
  font-size: 0.92rem;
}

.transaction-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.transaction-actions {
  display: flex;
  gap: 8px;
}

.action-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 56px;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  background: #ffffff;
  color: #374151;
  font-size: 0.84rem;
  font-weight: 800;
  text-decoration: none;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.action-button:hover {
  transform: translateY(-1px);
}

.action-button.edit:hover {
  border-color: #94a3b8;
  background: #f8fafc;
}

.action-button.delete {
  color: #d14334;
}

.action-button.delete:hover {
  border-color: #f3b5ae;
  background: #fff5f4;
}

.type-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 700;
}

.type-badge.income {
  background: #e7f8ef;
  color: #2f855a;
}

.type-badge.expense {
  background: #feebea;
  color: #d14334;
}

.amount-income,
.amount-expense {
  font-size: 1.1rem;
  letter-spacing: -0.03em;
}

.amount-income {
  color: #3f9b72;
}

.amount-expense {
  color: #d14334;
}

@media (max-width: 640px) {
  .transaction-item {
    grid-template-columns: 1fr;
  }

  .transaction-date {
    min-height: 58px;
  }

  .transaction-body {
    flex-direction: column;
    align-items: flex-start;
  }

  .transaction-meta {
    width: 100%;
    align-items: flex-start;
  }
}
</style>
