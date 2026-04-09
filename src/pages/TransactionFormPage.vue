<script setup>
// Vue Composition API에서 필요한 기능 import
import { computed, onMounted, ref, reactive } from 'vue';
// 라우터 (페이지 이동, URL 정보)
import { useRoute, useRouter } from 'vue-router';
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
    // 서버에 거래 생성 요청
    await transactionStore.createTransaction(payload);
    // 성공 시 목록 페이지로 이동 -아직 미작성 페이지
    //router.push('/transactions');
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
  <section>
    <div>
      <h1>새 거래 등록</h1>
    </div>
    <form class="transaction-form" @submit.prevent="submit">
      <div>
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
    </form>
    <div class="form-actions">
      <button class="button button--ghost" type="button" @click="router.back()">
        취소
      </button>
      <button class="button button--primary" type="submit" :disabled="saving">
        {{ saving ? '저장 중' : '저장' }}
      </button>
    </div>
  </section>
</template>
