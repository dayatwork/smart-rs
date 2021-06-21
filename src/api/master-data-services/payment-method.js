export const getPaymentMethods = async cookies => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/payment-method?sort_unix_created_at=asc`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Payment Methods');
  }

  return await res.json();
};

export const getPaymentMethodById = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/payment-method/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Payment Method Details');
  }

  return await res.json();
};

export const createPaymentMethod = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/payment-method/create`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookies?.token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    throw new Error('Error Create Payment Method');
  }

  return await res.json();
};

export const editPaymentMethod = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/payment-method/update`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookies?.token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    throw new Error('Error Edit Payment Method');
  }

  return await res.json();
};
