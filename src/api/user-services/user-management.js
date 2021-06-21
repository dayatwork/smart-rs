export const getUsers = async cookies => {
  const res = await fetch(
    `${process.env.REACT_APP_USER_API}/user?sort_unix_created_at=asc`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Users');
  }

  return await res.json();
};

export const getUserProfile = async token => {
  const res = await fetch(`${process.env.REACT_APP_USER_API}/user/profile`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Error Get User Profile');
  }

  return await res.json();
};

export const getUsersByIdentity = async (cookies, identity) => {
  const formattedIdentity = identity.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_USER_API}/user/detail/identity?identity=${formattedIdentity}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );
  if (!res.ok) {
    // throw new Error("Error Get User By Identity");
    const error = new Error('Error Get Users');
    error.code = 404;
    throw error;
  }

  return await res.json();
};

export const updateUserInfo = async (cookies, { name, password }) => {
  const res = await fetch(`${process.env.REACT_APP_USER_API}/user/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies?.token}`,
    },
    body: JSON.stringify({ name, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return await res.json();
};

export const updateUserDetail = cookies => async data => {
  const res = await fetch(`${process.env.REACT_APP_USER_API}/detail/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies?.token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(res.json().message);
  }

  return res.json();
};

export const createUserVitalSign = async (cookies, data) => {
  const res = await fetch(
    `${process.env.REACT_APP_USER_API}/user/vital-sign/update`,
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
    throw new Error('Error Update Vital Sign');
  }

  return await res.json();
};

export const assignRole = async (cookies, data) => {
  const response = await fetch(
    `${process.env.REACT_APP_USER_API}/user/update/role`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookies?.token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error(response.json().message);
  }

  return response.json();
};
