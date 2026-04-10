<script setup>
// Vue Composition API에서 필요한 기능 import
import { computed, onMounted, ref, reactive } from 'vue';
// 라우터 (페이지 이동, URL 정보)
import { useRoute, useRouter } from 'vue-router';
// 서버와 통신하는 서비스 (API 요청)
import { transactionService } from '@/services/transactionService';
// Pinia store (상태 관리)
import { useCategoryStore } from '@/stores/categoryStore';
import { useTransactionStore } from '@/stores/transactionStore';
// 날짜 포맷 유틸 (input[type=date]에 맞게 변환)
import { toDateInputValue } from '@/utils/format';
// 유효성 검사 함수
import { parsePositiveNumber, isValiDate } from '@/utils/validators';

// 현재 라우트 정보
const route = useRoute();

// 페이지 이동용 라우터
const router = useRouter();

// 거래 store (등록 기능)
const transactionStore = useTransactionStore();

// 카테고리 store (카테고리 목록 관리)
const categoryStore = useCategoryStore();

// 저장 중 상태 (버튼 비활성화 등)
const saving = ref(false);

// 사용자에게 보여줄 메시지 (에러 등)
const message = ref('');

// 수정 모드인지 여부 (URL에 id가 있으면 수정)
const isEdit = computed(() => Boolean(route.params.id));

// 폼 데이터 (reactive → 객체 전체 반응형)
const form = reactive({
  date: toDateInputValue(),
  type: 'expense',
  category: '',
  amount: '',
  memo: '',
});

// 선택된 거래유형(수입/지출)에 따라 카테고리 필터링
const filteredCategories = computed(() =>
  categoryStore.categories.filter((category) => category.type === form.type),
);

// 컴포넌트 마운트 시 카테고리 데이터 불러오기
onMounted(async () => {
  // 이미 데이터가 있으면 재요청 안함
  if (!categoryStore.categories.length) await categoryStore.fetchCategories();
  if (isEdit.value) {
    const cached = transactionStore.getTransactionById(route.params.id);
    const transaction =
      cached || (await transactionService.getTransaction(route.params.id));
    form.date = transaction.date;
    form.type = transaction.type;
    form.category = transaction.category;
    form.amount = String(transaction.amount);
    form.memo = transaction.memo || '';
  } else {
    form.category = filteredCategories.value[0]?.name || '';
  }
});

// 수입/지출 버튼 클릭 시 실행
function selectType(type) {
  form.type = type;
  // 선택한 타입에 맞는 첫 번째 카테고리 자동 선택
  form.category =
    categoryStore.categories.find((category) => category.type === type)?.name ||
    '';
}

// 입력값 검증 함수
function validateForm() {
  // 거래 타입 체크
  if (!form.type || !['income', 'expense'].includes(form.type))
    return '거래 유형을 선택해 주세요.';

  // 날짜 유효성 검사
  if (!isValiDate(form.date)) return '유효한 날짜를 입력해 주세요.';

  // 카테고리 선택 여부
  if (!form.category) return '카테고리를 선택해 주세요.';

  // 금액이 양수인지 검사
  if (parsePositiveNumber(form.amount) === null)
    return '0보다 큰 금액을 입력해 주세요.';

  // 문제 없으면 빈 문자열 반환
  return '';
}

// 제출 함수 (폼 저장)
async function submit() {
  // 검증 실행-> 메시지 설정
  message.value = validateForm();

  // 에러 있으면 중단
  if (message.value) return;

  // 저장 시작 (버튼 비활성화)
  saving.value = true;

  // 서버로 보낼 데이터 구성
  const payload = {
    date: form.date,
    type: form.type,
    category: form.category,
    amount: Number(form.amount),
    memo: form.memo.trim(),
  };

  try {
    if (isEdit.value)
      // 수정 모드 → 기존 데이터 업데이트
      await transactionStore.updateTransaction(route.params.id, payload);
    // 신규 등록 → 데이터 생성, 서버에 거래 생성 요청
    else await transactionStore.createTransaction(payload);
    // 성공 시 목록 페이지로 이동 -아직 미작성 페이지
    router.push('/transactions');
  } catch (error) {
    // 실패 시 메시지 표시
    message.value = '저장에 실패했습니다. json-server 실행 상태를 확인해주세요';
  } finally {
    // 저장 상태 종료
    saving.value = false;
  }
}
</script>
<template>
  <section class="page page--narrow">
    <section class="card">
      <div class="card__header">
        <h1>{{ isEdit ? '거래 수정' : '새 거래 등록' }}</h1>
      </div>
      <form class="transaction-form" @submit.prevent="submit">
        <div class="segmented">
          <button
            type="button"
            :class="{ active: form.type === 'income' }"
            @click="selectType('income')"
          >
            수입
          </button>
          <button
            type="button"
            :class="{ active: form.type === 'expense' }"
            @click="selectType('expense')"
          >
            지출
          </button>
        </div>
        <label>
          날짜
          <input type="date" v-model="form.date" required />
        </label>
        <label>
          카테고리
          <select v-model="form.category" required>
            <option value="" disabled>카테고리 선택</option>
            <option
              v-for="category in filteredCategories"
              :key="category.id"
              :value="category.name"
            >
              {{ category.name }}
            </option>
          </select>
        </label>
        <label>
          금액
          <input
            type="text"
            v-model="form.amount"
            inputmode="numeric"
            pattern="[0-9]*"
            placeholder="금액을 입력해 주세요"
            required
          />
        </label>
        <label>
          메모
          <textarea
            v-model="form.memo"
            rows="4"
            placeholder="메모를 입력하세요"
          ></textarea>
        </label>

        <p v-if="message" class="alert">{{ message }}</p>
        <div class="form-actions">
          <button
            class="button button--ghost"
            type="button"
            @click="router.back()"
          >
            취소
          </button>
          <button
            class="button button--primary"
            type="submit"
            :disabled="saving"
          >
            {{ saving ? '저장 중' : '저장' }}
          </button>
        </div>
      </form>
    </section>
  </section>
</template>

<style scoped>
.page {
  padding: 24px 16px 96px;
}

.page--narrow {
  max-width: 860px;
  margin: 0 auto;
}

.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}

.card__header {
  margin-bottom: 20px;
}

.card__header h1 {
  margin: 0 0 6px;
  font-size: 1.5rem;
  line-height: 1.2;
}

.card__header p {
  margin: 0;
  color: #64748b;
  font-size: 0.95rem;
}

.transaction-form {
  display: grid;
  gap: 16px;
}

.transaction-form label {
  display: grid;
  gap: 8px;
  font-weight: 600;
  color: #334155;
}

.transaction-form input,
.transaction-form select,
.transaction-form textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #dbe2ea;
  border-radius: 12px;
  padding: 12px 14px;
  font: inherit;
  background: #fff;
}

.transaction-form input:focus,
.transaction-form select:focus,
.transaction-form textarea:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
}

.segmented {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  background: #f8fafc;
  padding: 6px;
  border-radius: 14px;
}

.segmented button {
  border: 0;
  background: transparent;
  padding: 12px;
  border-radius: 10px;
  font: inherit;
  font-weight: 700;
  color: #64748b;
  cursor: pointer;
}

.segmented button.active {
  background: #fff;
  color: #0f172a;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.08);
}

.alert {
  margin: 0;
  padding: 12px 14px;
  border-radius: 12px;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 0.95rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
}

.button {
  border: 0;
  border-radius: 12px;
  padding: 12px 16px;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.button--ghost {
  background: #eef2f7;
  color: #334155;
}

.button--primary {
  background: #2563eb;
  color: #fff;
}

.button:disabled {
  opacity: 0.6;
  cursor: default;
}

/* Mobile (< 768px) */
@media (max-width: 767px) {
  .page {
    padding: 16px 12px 88px;
  }

  .page--narrow {
    max-width: 100%;
  }

  .card {
    padding: 18px;
    border-radius: 16px;
  }

  .card__header {
    margin-bottom: 16px;
  }

  .card__header h1 {
    font-size: 1.25rem;
  }

  .transaction-form {
    gap: 14px;
  }

  .transaction-form label {
    gap: 6px;
    font-size: 0.95rem;
  }

  .transaction-form input,
  .transaction-form select,
  .transaction-form textarea {
    padding: 11px 12px;
    font-size: 0.95rem;
  }

  .segmented {
    gap: 6px;
    padding: 4px;
  }

  .segmented button {
    min-height: 46px;
    padding: 10px 8px;
    font-size: 0.9rem;
  }

  .form-actions {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .form-actions .button {
    width: 100%;
  }
}

/* Tablet (768px ~ 1024px) */
@media (min-width: 768px) and (max-width: 1024px) {
  .page {
    padding: 28px 20px 88px;
  }

  .page--narrow {
    max-width: 760px;
  }

  .card {
    padding: 24px;
    border-radius: 18px;
  }

  .card__header {
    margin-bottom: 18px;
  }

  .card__header h1 {
    font-size: 1.35rem;
  }

  .transaction-form {
    gap: 16px;
  }

  .transaction-form input,
  .transaction-form select,
  .transaction-form textarea {
    padding: 12px;
  }

  .segmented {
    gap: 8px;
    padding: 5px;
  }

  .segmented button {
    min-height: 48px;
    padding: 10px 12px;
    font-size: 0.95rem;
  }
}

/* Desktop (> 1024px) */
@media (min-width: 1025px) {
  .page {
    padding: 40px 24px 96px;
  }

  .page--narrow {
    max-width: 860px;
  }

  .card {
    padding: 32px;
  }
}
</style>
