// /v1/functional-staff?institution_id=b77d00a1-6e84-4155-a1ff-5973f72bf29b&sort_unix_created_at=asc

export const getInstitutionRoles = async (cookies, institution_id) => {
  const formattedId = institution_id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_HUMAN_CAPITAL_API}/role?institution_id=${formattedId}&sort_unix_created_at=asc`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Institution Roles');
  }

  return await res.json();
};

// functional-staff/create
export const createInstitutionRole = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_HUMAN_CAPITAL_API}/role/create`,
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
    throw new Error('Error Create Institution Role');
  }

  return await res.json();
};
