/**
 * @param {Array} transactions - 거래 내역 배열
 * @returns {Object} { totalIncome, totalExpense }
 */
export const calculateSummary = (transactions) => {
  if (!transactions || transactions.length === 0) {
    return {
      totalIncome: 0,
      totalExpense: 0,
    };
  }

  return transactions.reduce(
    (acc, cur) => {
      let amount = 0;
      if (typeof cur.amount === 'string') {
        amount = Number(cur.amount.replace(/[^0-9.-]+/g, '')) || 0;
      } else {
        amount = Number(cur.amount) || 0;
      }

      const type = cur.type ? cur.type.toUpperCase() : '';

      if (type === 'INCOME') {
        acc.totalIncome += amount;
      } else if (type === 'EXPENSE') {
        acc.totalExpense += amount;
      }
      return acc;
    },
    { totalIncome: 0, totalExpense: 0 },
  );
};

export const filterByMonth = (transactions, year, month) => {
  return transactions.filter((item) => {
    const date = new Date(item.date);
    return date.getFullYear() === year && date.getMonth() + 1 === month;
  });
};
