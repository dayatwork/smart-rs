export const getUserOrderList = async cookies => {
  const res = await fetch(
    `${process.env.REACT_APP_PAYMENT_API}/order/user?sort_unix_created_at=asc`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get User Order List');
  }

  return await res.json();
};

export const getUserOrderDetail = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_PAYMENT_API}/order/user/detail?id=${formattedId}&sort_unix_created_at=asc`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get User Order Detail');
  }

  return await res.json();
};
