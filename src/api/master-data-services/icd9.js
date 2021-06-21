export const getICD9 = async (
  cookies,
  // limit = 5,
  // page = 1,
  // query = `?sort_unix_created_at=asc&limit=5&page=1`
  query = `?sort_unix_created_at=asc`
) => {
  const res = await fetch(`${process.env.REACT_APP_MASTER_API}/icd/9${query}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${cookies?.token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Error Get List ICD 9');
  }

  return await res.json();
};

export const getICD9ById = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/icd/9/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get ICD 9 by ID');
  }

  return await res.json();
};

export const createICD9 = cookies => async data => {
  const res = await fetch(`${process.env.REACT_APP_MASTER_API}/icd/9/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies?.token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Error Create ICD 9');
  }

  return await res.json();
};

export const editICD9 = cookies => async data => {
  const res = await fetch(`${process.env.REACT_APP_MASTER_API}/icd/9/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies?.token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Error Edit ICD 9');
  }

  return await res.json();
};
