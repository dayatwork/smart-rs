export const getICD10 = async (
  cookies,
  // limit = 5,
  // page = 1,
  // query = `?sort_unix_created_at=asc&limit=5&page=1`
  query = `?sort_unix_created_at=asc`
) => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/icd/10${query}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get List ICD 10');
  }

  return await res.json();
};

export const getICD10ById = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/icd/10/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get ICD 10 by ID');
  }

  return await res.json();
};

export const createICD10 = cookies => async data => {
  const res = await fetch(`${process.env.REACT_APP_MASTER_API}/icd/10/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies?.token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Error Create ICD 10');
  }

  return await res.json();
};

export const editICD10 = cookies => async data => {
  const res = await fetch(`${process.env.REACT_APP_MASTER_API}/icd/10/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies?.token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Error Edit ICD 10');
  }

  return await res.json();
};

export const searchICD10 = async (cookies, { searchBy, inputText }) => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/icd/10?filter_icds_${searchBy}=${inputText}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Search ICD 10');
  }
  return await res.json();
};
