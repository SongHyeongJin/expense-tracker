/**
 * 예산 요약 데이터 생성
 */
export function createBudgetSummary({ transactions = [], budgetAmount = 0 }) {
  const expenseTotal = calculateExpenseTotal(transactions);
  const remainingBudget = calculateRemainingBudget(budgetAmount, expenseTotal);
  const usageRate = calculateUsageRate(budgetAmount, expenseTotal);
  const status = getBudgetStatus(usageRate);

  return {
    expenseTotal,
    remainingBudget,
    usageRate,
    status,
  };
}

/**
 * 지출 총액 계산 (transactions는 이미 월 필터링된 상태라고 가정)
 */
export function calculateExpenseTotal(transactions) {
  if (!Array.isArray(transactions)) return 0;

  return transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
}

/**
 * 남은 예산 계산
 */
export function calculateRemainingBudget(budgetAmount, expenseTotal) {
  return Number(budgetAmount || 0) - Number(expenseTotal || 0);
}

/**
 * 예산 소진율 계산 (%)
 */
export function calculateUsageRate(budgetAmount, expenseTotal) {
  const budget = Number(budgetAmount || 0);
  const expense = Number(expenseTotal || 0);

  if (budget <= 0) return 0;

  return Math.floor((expense / budget) * 100);
}

/**
 * 소진율 기준 상태 반환
 */
export function getBudgetStatus(usageRate) {
  if (usageRate >= 100) return 'exceeded';
  if (usageRate >= 90) return 'warning';
  if (usageRate >= 80) return 'caution';
  return 'safe';
}
