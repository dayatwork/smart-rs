export const getCashiers = async (cookies, institution_id) => {
  const formattedId = institution_id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_INSTITUTION_API}/cashier?institution_id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Cashiers');
  }

  return await res.json();
};

export const createCashier = cookies => async data => {
  const res = await fetch(`${process.env.REACT_APP_INSTITUTION_API}/cashier`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies?.token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Error Create Cashier');
  }

  return await res.json();
};
