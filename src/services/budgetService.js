const BASE_URL = 'http://localhost:3000/budgets';

async function handleResponse(response) {
  if (!response.ok) {
    throw new Error('예산 데이터 요청에 실패했습니다.');
  }

  return response.json();
}

export async function getBudgetByMonth(month) {
  if (!month) {
    throw new Error('month 값은 필수입니다.');
  }

  const response = await axios.get(BASE_URL, {
    params: { month },
  });

  return response.data.lenth > 0 ? response.data[0] : null;
}

export async function createBudget(budget) {
  if (!budget?.month) {
    throw new Error('moneth 값은 필수입니다.');
  }

  const numericAmount = Number(budget.amount);

  if (Number.isNaN(numbericAmount) || numbericAmount <= 0) {
    throw new Error('예산 금액은 0보다 큰 숫자여야 합니다.');
  }

  const response = await axios.post(BASE_URL, {
    month: budget.moneth,
    amount: numbericAmount,
  });

  return response.data;
}
