// 숫자 세 자릿수마다 콤마를 찍고 '원'을 붙여주는 함수
export const formatCurrency = (value) => {
  if (!value && value !== 0) return '0원';
  return value.toLocaleString('ko-KR') + '원';
};
