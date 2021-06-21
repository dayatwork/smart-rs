export const getInfrastructureTypes = async (cookies, institution_id) => {
  const formattedId = institution_id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_INSTITUTION_API}/infrastructure/type?institution_id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Infrastructure Type');
  }

  return await res.json();
};

export const getInfrastructureTypeById = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_INSTITUTION_API}/infrastructure/type/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Infrastructure Type by id');
  }

  return await res.json();
};

export const createInfrastructureType = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_INSTITUTION_API}/infrastructure/type/create`,
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
    throw new Error('Error Create Infrastructure Type');
  }

  return await res.json();
};

export const updateInfrastructureType = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_INSTITUTION_API}/infrastructure/type/update`,
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
    throw new Error('Error Edit Infrastructure Type');
  }

  return await res.json();
};

export const getInfrastructures = async (cookies, institution_id) => {
  const formattedId = institution_id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_INSTITUTION_API}/infrastructure?institution_id=${formattedId}&sort_unix_created_at=asc`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Infrastructures');
  }

  return await res.json();
};

export const getInfrastructureById = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_INSTITUTION_API}/infrastructure/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Infrastructure by id');
  }

  return await res.json();
};

// v1/institution/create
export const createInfrastructure = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_INSTITUTION_API}/infrastructure/create`,
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
    throw new Error('Error Create Infrastructure');
  }

  return await res.json();
};

export const updateInfrastructure = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_INSTITUTION_API}/infrastructure/update`,
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
    throw new Error('Error Edit Infrastructure');
  }

  return await res.json();
};
