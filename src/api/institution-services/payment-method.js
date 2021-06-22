export const getPaymentMethods = async (cookies, institution_id) => {
  const formattedId = institution_id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_INSTITUTION_API}/payment-method?sort_unix_created_at=asc&institution_id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Institution Payment Method');
  }

  return await res.json();
};

export const getPaymentMethodById = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_INSTITUTION_API}/payment-method/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Institution Payment Method by id');
  }

  return await res.json();
};

export const createPaymentMethod = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_INSTITUTION_API}/payment-method/create`,
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
    throw new Error('Error Create Institution Payment Method');
  }

  return await res.json();
};

export const updatePaymentMethod = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_INSTITUTION_API}/payment-method/update`,
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
    throw new Error('Error Update Institution Payment Method');
  }

  return await res.json();
};
