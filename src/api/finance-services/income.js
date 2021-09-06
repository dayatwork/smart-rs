export const getIncomeList = async (cookies, institution_id) => {
  const formattedId = institution_id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_FINANCE_API_V2}/income?filter_incomes_institution_id=${formattedId}&sort_date=desc`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Income List');
  }

  return await res.json();
};

export const createNewIncome = cookies => async data => {
  const res = await fetch(`${process.env.REACT_APP_FINANCE_API_V2}/income`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies?.token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Error Create New Income');
  }

  return await res.json();
};
