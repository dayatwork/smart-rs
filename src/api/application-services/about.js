export const getAboutUsList = async cookies => {
  const res = await fetch(`${process.env.REACT_APP_APPLICATION_API}/about`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${cookies?.token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Error Get About Us List');
  }

  return await res.json();
};

export const getAboutUsDetail = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_APPLICATION_API}/about/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get About Us Detail');
  }

  return await res.json();
};

export const createAboutUs = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_APPLICATION_API}/about/create`,
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
    throw new Error('Error Create About Us');
  }

  return await res.json();
};

export const updateAboutUs = (cookies, id) => async data => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_APPLICATION_API}/about/update?id=${formattedId}`,
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
    throw new Error('Error Update About Us');
  }

  return await res.json();
};

export const deleteAboutUs = (cookies, id) => async () => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_APPLICATION_API}/about/delete?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Delete About Us');
  }

  return await res.json();
};
