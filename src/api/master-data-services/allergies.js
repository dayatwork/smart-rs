export const getAllergies = async cookies => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/allergy?sort_name=asc`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Allergies');
  }

  return await res.json();
};

export const getAllergiesByGroup = async cookies => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/allergy?sort_name=asc&mode=group`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Allergies');
  }

  return await res.json();
};

export const getAllergyById = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/allergy/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Allergy');
  }

  return await res.json();
};

export const createAllergies = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/allergy/create`,
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
    throw new Error('Error Create Allergy');
  }

  return await res.json();
};

export const editAllergy = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/allergy/update`,
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
    throw new Error('Error Edit Allergy');
  }

  return await res.json();
};
