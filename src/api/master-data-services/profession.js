export const getProfessions = async cookies => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/profession?sort_name=asc`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Professions');
  }

  return await res.json();
};

export const getProfessionById = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/profession/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Profession');
  }

  return await res.json();
};

export const createProfession = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/profession/create`,
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
    throw new Error('Error Create Profession');
  }

  return await res.json();
};

export const editProfession = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/profession/update`,
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
    throw new Error('Error Edit Profession');
  }

  return await res.json();
};
