export const getRegisteredStaff = async (cookies, institution_id) => {
  const formattedId = institution_id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_HUMAN_CAPITAL_API}/employee?institution_id=${formattedId}&sort_unix_created_at=asc`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Staff');
  }

  return await res.json();
};

export const addStaff = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_HUMAN_CAPITAL_API}/employee/create`,
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
    throw new Error('Error Add Staff');
  }

  return await res.json();
};

export const getEmployeeDetail = async (token, institution_id, id) => {
  const formattedInstitutionId = institution_id.replace(/['"]+/g, '');
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_HUMAN_CAPITAL_API}/employee/detail?id=${formattedId}&institution_id=${formattedInstitutionId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Employee Detail');
  }

  return await res.json();
};

export const checkRegisteredEmployee = async (cookies, data) => {
  const res = await fetch(
    `${process.env.REACT_APP_HUMAN_CAPITAL_API}/employee/check-registered`,
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
    throw new Error('Error check registered employee');
  }

  return await res.json();
};

export const assignStaff = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_HUMAN_CAPITAL_API}/employee/assign`,
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
    throw new Error('Error Assign Staff');
  }

  return await res.json();
};
