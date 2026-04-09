// 카테고리 목록 API 요청
import { apiClient } from './apiService';

// 카테고리 목록 조회 API 요청
// (apiClient의 baseURL + '/categories')
export const categoryService = {
  async getCategories() {
    const { data } = await apiClient.get('/categories');
    return data;
  },
};
