export const getDrugPriceList = async (cookies, institution_id) => {
  const formattedId = institution_id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_FINANCE_API}/drug?institution_id=${formattedId}&sort_unix_created_at=asc`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Drug Price List');
  }

  return await res.json();
};

export const getDrugPriceDetail = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_FINANCE_API}/price/drug/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Drug Price Detail');
  }

  return await res.json();
};

export const createDrugPrice = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_FINANCE_API}/price/drug/create`,
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
    throw new Error('Error Create Drug Price');
  }

  return await res.json();
};

export const editDrugPrice = cookies => async data => {
  const res = await fetch(`${process.env.REACT_APP_FINANCE_API}/drug/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies?.token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Error Update Drug Price');
  }

  return await res.json();
};
