export const getRoles = async cookies => {
  const res = await fetch(
    `${process.env.REACT_APP_USER_API}/role?sort_unix_created_at=asc`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Roles');
  }

  return await res.json();
};

export const createRole = cookies => async data => {
  const res = await fetch(`${process.env.REACT_APP_USER_API}/role/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies?.token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Error Create Role');
  }

  return await res.json();
};

export const getRoleById = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_USER_API}/role/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Role by ID');
  }

  return await res.json();
};

// role/access?sort_unix_created_at=asc
export const getDefaultAccessControl = async cookies => {
  const res = await fetch(
    `${process.env.REACT_APP_USER_API}/role/access?sort_unix_created_at=asc`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Default Access Control');
  }

  return await res.json();
};

export const assignAccessControl = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_USER_API}/role/access/create`,
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
    throw new Error('Error Assign Default Access Control');
  }

  return await res.json();
};

export const getUserPermissions = async cookies => {
  const res = await fetch(
    `${process.env.REACT_APP_USER_API}/role/access/user`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get User Permissions');
  }

  return await res.json();
};
