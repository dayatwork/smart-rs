export const getPatientTypes = async cookies => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/patient-type?sort_unix_created_at=asc`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Patient Types');
  }

  return await res.json();
};

export const getPatientTypeById = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/patient-type/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Patient Types Details');
  }

  return await res.json();
};

export const createPatientType = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/patient-type/create`,
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
    throw new Error('Error Create Patient Type');
  }

  return await res.json();
};

export const editPatientType = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/patient-type/update`,
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
    throw new Error('Error Edit Patient Type');
  }

  return await res.json();
};
