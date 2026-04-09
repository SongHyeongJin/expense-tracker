export function createBudgetSummary({
  transactions = [],
  budgetAmout = 0,
  month,
}) {
  const expenseTotal = calculateExpenseTotal(transactions, month);
  const remainingBudget = calculateRemainingBudget(budgetAmout, expenseTotal);
  const status = getBudgetStatus(usageRate);
  const statusMessage = getBudgetStatusMessage(status);

  return {
    expenseTotal,
    remainingBudget,
    usageRate,
    status,
    statusMessage,
  };
}
