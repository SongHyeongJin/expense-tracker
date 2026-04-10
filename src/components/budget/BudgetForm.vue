<template>
  <section class="budget-form">
    <h2 class="budget-form__title">월별 예산 설정</h2>

    <div class="budget-form__group">
      <label class="budget-form__label" for="budget-month">조회 월</label>
      <input
        id="budget-month"
        class="budget-form__input"
        type="month"
        :value="month"
        disabled
      />
    </div>

    <div class="budget-form__group">
      <label class="budget-form__label" for="budget-amount">예산 금액</label>
      <input
        id="budget-amount"
        v-model="localAmount"
        class="budget-form__input"
        type="number"
        min="1"
        step="1"
        placeholder="예산 금액을 입력하세요"
      />
    </div>

    <p
      v-if="errorMessage"
      class="budget-form__message budget-form__message--error"
    >
      {{ errorMessage }}
    </p>

    <p
      v-if="successMessage"
      class="budget-form__message budget-form__message--success"
    >
      {{ successMessage }}
    </p>

    <button
      class="budget-form__button"
      type="button"
      :disabled="isSubmitting"
      @click="handleSubmit"
    >
      {{ isSubmitting ? '저장 중...' : '예산 저장' }}
    </button>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue';
import { saveMonthlyBudget } from '@/services/budgetService';

const props = defineProps({
  month: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['saved']);

const localAmount = ref('');
const isSubmitting = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

watch(
  () => props.amount,
  (newAmount) => {
    localAmount.value = newAmount > 0 ? String(newAmount) : '';
  },
  { immediate: true },
);

async function handleSubmit() {
  errorMessage.value = '';
  successMessage.value = '';

  const numericAmount = Number(localAmount.value);

  if (!localAmount.value) {
    errorMessage.value = '예산 금액을 입력해주세요.';
    return;
  }

  if (Number.isNaN(numericAmount) || numericAmount <= 0) {
    errorMessage.value = '예산 금액은 0보다 큰 숫자여야 합니다.';
    return;
  }

  isSubmitting.value = true;

  try {
    await saveMonthlyBudget({
      month: props.month,
      amount: numericAmount,
    });

    successMessage.value = '예산이 저장되었습니다.';
    emit('saved');
  } catch (error) {
    console.error(error);
    errorMessage.value = '예산 저장에 실패했습니다.';
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.budget-form {
  margin-bottom: 24px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background-color: #ffffff;
}

.budget-form__title {
  margin: 0 0 20px;
  font-size: 20px;
  font-weight: 700;
  color: #111827;
}

.budget-form__group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.budget-form__label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.budget-form__input {
  height: 44px;
  padding: 0 12px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  font-size: 14px;
}

.budget-form__message {
  margin: 0 0 12px;
  font-size: 14px;
}

.budget-form__message--error {
  color: #b91c1c;
}

.budget-form__message--success {
  color: #15803d;
}

.budget-form__button {
  min-width: 120px;
  height: 44px;
  padding: 0 16px;
  border: none;
  border-radius: 10px;
  background-color: #2563eb;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.budget-form__button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
