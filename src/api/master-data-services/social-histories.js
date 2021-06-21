export const getSocialHistories = async cookies => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/social-history?sort_unix_created_at=asc`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error get social histories');
  }

  return await res.json();
};

export const getSocialHistoryById = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/social-history/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error get social history');
  }

  return await res.json();
};

export const createSocialHistories = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/social-history/create`,
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
    throw new Error('Error create social history');
  }

  return await res.json();
};

export const editSocialHistory = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/social-history/update`,
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
    throw new Error('Error edit social history');
  }

  return await res.json();
};
