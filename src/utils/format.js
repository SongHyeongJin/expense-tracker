export const formatCurrency = (value) => {
  if (!value) return '0';
  return new Intl.NumberFormat('ko-KR').format(value);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};
