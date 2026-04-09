import axios from 'axios';

const BASE_URL = 'http://localhost:3000/budgets';

export async function getBudgetByMonth(month) {
  if (!month) {
    throw new Error('month 값은 필수입니다.');
  }

  const response = await axios.get(BASE_URL, {
    params: { month },
  });

  return response.data.length > 0 ? response.data[0] : null;
}

export async function createBudget(budget) {
  if (!budget?.month) {
    throw new Error('month 값은 필수입니다.');
  }

  const numericAmount = Number(budget.amount);

  if (Number.isNaN(numericAmount) || numericAmount <= 0) {
    throw new Error('예산 금액은 0보다 큰 숫자여야 합니다.');
  }

  const response = await axios.post(BASE_URL, {
    month: budget.month,
    amount: numericAmount,
  });

  return response.data;
}

export async function updateBudget(id, budget) {
  if (!id) {
    throw new Error('수정할 예산 ID가 필요합니다.');
  }

  const requestBody = {};

  if (budget.month !== undefined) {
    requestBody.month = budget.month;
  }

  if (budget.amount !== undefined) {
    const numericAmount = Number(budget.amount);

    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      throw new Error('예산 금액은 0보다 큰 숫자여야 합니다.');
    }

    requestBody.amount = numericAmount;
  }

  const response = await axios.patch(`${BASE_URL}/${id}`, requestBody);

  return response.data;
}

export async function saveMonthlyBudget({ month, amount }) {
  if (!month) {
    throw new Error('month 값은 필수입니다.');
  }

  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount) || numericAmount <= 0) {
    throw new Error('예산 금액은 0보다 큰 숫자여야 합니다.');
  }

  const existingBudget = await getBudgetByMonth(month);

  if (existingBudget) {
    return updateBudget(existingBudget.id, {
      amount: numericAmount,
    });
  }

  return createBudget({
    month,
    amount: numericAmount,
  });
}
