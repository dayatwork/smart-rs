export const createAdvertisement = async (cookies, data) => {
  const res = await fetch(
    `${process.env.REACT_APP_INSTITUTION_API}/advertisement/create`,
    {
      method: 'POST',
      headers: {
        // 'Content-Type': 'application/json',
        Authorization: `Bearer ${cookies?.token}`,
      },
      body: data,
    }
  );

  if (!res.ok) {
    throw new Error('Error Create Advertisement');
  }

  return await res.json();
};

export const getAdvertisements = async cookies => {
  const res = await fetch(
    `${process.env.REACT_APP_INSTITUTION_API}/advertisement`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Advertisements');
  }

  return await res.json();
};

export const updateAdvertisement = (cookies, id) => async data => {
  const formattedId = id.replace(/['"]+/g, '');

  const res = await fetch(
    `${process.env.REACT_APP_INSTITUTION_API}/advertisement/update?id=${formattedId}`,
    {
      method: 'POST',
      headers: {
        // 'Content-Type': 'application/json',
        Authorization: `Bearer ${cookies?.token}`,
      },
      body: data,
    }
  );

  if (!res.ok) {
    throw new Error('Error Update Advertisement');
  }

  return await res.json();
};

export const deleteAdvertisement = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');

  const res = await fetch(
    `${process.env.REACT_APP_INSTITUTION_API}/advertisement/delete?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Delete Advertisement');
  }

  return await res.json();
};

export const getAdvertisementDetail = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');

  const res = await fetch(
    `${process.env.REACT_APP_INSTITUTION_API}/advertisement/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Advertisement Detail');
  }

  return await res.json();
};
