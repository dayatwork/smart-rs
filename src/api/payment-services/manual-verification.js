export const uploadOrderReceipt = async (cookies, data) => {
  const res = await fetch(
    `${process.env.REACT_APP_PAYMENT_API}/order/manual/receipt`,
    {
      method: 'POST',
      headers: {
        // 'Content-Type': 'application/json',
        Authorization: `Bearer ${cookies?.token}`,
      },
      // body: JSON.stringify(data),
      body: data,
    }
  );

  if (!res.ok) {
    throw new Error('Error Create Upload Receipt Document');
  }

  return await res.json();
};

export const updateUploadOrderReceipt = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_PAYMENT_API}/order/manual/receipt/update`,
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
    throw new Error('Error Create Upload Receipt Document');
  }

  return await res.json();
};

export const getPaymentSlipDetail = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_PAYMENT_API}/order/manual/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Order Receipt Detail');
  }

  return await res.json();
};

export const verifyPayment = async (cookies, data) => {
  console.log({ data });
  const res = await fetch(
    `${process.env.REACT_APP_PAYMENT_API}/order/manual/verify`,
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
    throw new Error('Error Verify Payment');
  }

  return await res.json();
};
