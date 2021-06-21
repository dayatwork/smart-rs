export const getRadiologyList = async (cookies, institution_id) => {
  const formattedId = institution_id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_RADIOLOGY}/radiology?institution_id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get radiology list');
  }

  return await res.json();
};

export const getRadiologyDetail = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_RADIOLOGY}/radiology/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get radiology detail');
  }

  return await res.json();
};

export const createRadiology = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_RADIOLOGY}/radiology/create`,
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
    throw new Error('Error Create radiology');
  }

  return await res.json();
};

export const startRadiology = async (cookies, data) => {
  const res = await fetch(
    `${process.env.REACT_APP_RADIOLOGY}/radiology/start`,
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
    throw new Error('Error start radiology');
  }

  return await res.json();
};

export const updateStatusRadiology = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_RADIOLOGY}/radiology/update`,
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
    throw new Error('Error update radiology status');
  }

  return await res.json();
};
