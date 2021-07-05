// v1/institution/type
export const getInstitutionTypes = async cookies => {
  const res = await fetch(
    `${process.env.REACT_APP_INSTITUTION_API}/institution/type`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Institution Type');
  }

  return await res.json();
};

// /institution/type/create
export const createInstitutionType = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_INSTITUTION_API}/institution/type/create`,
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
    throw new Error('Error Create Institution Type');
  }

  return await res.json();
};

// /v1/institution?sort_unix_created_at=asc
export const getInstitutions = async cookies => {
  const res = await fetch(
    `${process.env.REACT_APP_INSTITUTION_API}/institution?sort_unix_created_at=asc`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Institution');
  }

  return await res.json();
};

// v1/institution/create
export const createInstitution = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_INSTITUTION_API}/institution/create`,
    {
      method: 'POST',
      headers: {
        // 'Content-Type': 'application/json',
        Authorization: `Bearer ${cookies?.token}`,
      },
      // body: JSON.stringify(data),
      body: data,
    }
  );

  if (!res.ok) {
    throw new Error('Error Create Institution');
  }

  return await res.json();
};
