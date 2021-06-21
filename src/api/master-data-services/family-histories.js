export const getFamilyHistories = async cookies => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/family-history?sort_name=asc`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error get family histories');
  }

  return await res.json();
};

export const getFamilyHistoryById = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/family-history/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error get family history');
  }

  return await res.json();
};

export const createFamilyHistories = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/family-history/create`,
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
    throw new Error('Error create family history');
  }

  return await res.json();
};

export const editFamilyHistory = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/family-history/update`,
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
    throw new Error('Error edit family history');
  }

  return await res.json();
};
