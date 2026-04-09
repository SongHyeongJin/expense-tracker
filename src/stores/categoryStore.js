// 카테고리를 불러오며 수입/지출에 따라 카테고리 구별

import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { categoryService } from '@/services/categoryService';

export const useCategoryStore = defineStore('categoryStore', () => {
  const categories = ref([]); // 전체 카테고리 목록
  const error = ref(''); // 에러 메시지

  //   수입 카테고리만 필터링
  const incomeCategories = computed(() =>
    categories.value.filter((category) => category.type === 'income'),
  );
  //   지출 카테고리만 필터링
  const expenseCategories = computed(() =>
    categories.value.filter((category) => category.type === 'expense'),
  );

  //   서버에서 카테고리 목록을 가져오는 함수
  async function fetchCategories() {
    // 에러 초기화
    error.value = '';
    try {
      // API 호출, 카테고리 데이터 받아서 상태에 저장
      categories.value = await categoryService.getCategories();
    } catch (err) {
      // 에러 발생 시 사용자에게 보여줄 메시지 설정
      error.value = 'json-server에서 카테고리 데이터를 불러오지 못했습니다.';
      throw err;
    }
  }
  // 외부에서 사용할 상태와 함수 반환
  return {
    categories, //전체 카테고리
    error, //에러 메시지
    incomeCategories, //수입 카테고리
    expenseCategories, //지출 카테고리
    fetchCategories, //카테고리 조회
  };
});
