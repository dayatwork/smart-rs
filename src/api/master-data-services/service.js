// ==============================
// =========Service Type=========
// ==============================
export const getServiceTypes = async cookies => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/service/type?sort_unix_created_at=asc`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Service Types');
  }

  return await res.json();
};

export const getServiceTypeById = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/service/type/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Service Type');
  }

  return await res.json();
};

export const createServiceType = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/service/type/create`,
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
    throw new Error('Error Create Service Type');
  }

  return await res.json();
};

export const editServiceType = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/service/type/update`,
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
    throw new Error('Error Edit Service Type');
  }

  return await res.json();
};

// ==============================
// ===========Service============
// ==============================
export const getServices = async cookies => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/service?sort_unix_created_at=asc`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Services');
  }

  return await res.json();
};

export const getServiceById = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/service/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Service');
  }

  return await res.json();
};

export const createService = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/service/create`,
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
    throw new Error('Error Create Service');
  }

  return await res.json();
};

export const editService = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/service/update`,
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
    throw new Error('Error Edit Service');
  }

  return await res.json();
};
