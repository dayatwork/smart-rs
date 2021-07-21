export const getPrivacyPolicyList = async cookies => {
  const res = await fetch(
    `${process.env.REACT_APP_APPLICATION_API}/privacy-policy`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Privacy Policy List');
  }

  return await res.json();
};

export const getPrivacyPolicyDetail = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_APPLICATION_API}/privacy-policy/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Privacy Policy Detail');
  }

  return await res.json();
};

export const createPrivacyPolicy = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_APPLICATION_API}/privacy-policy/create`,
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
    throw new Error('Error Create Privacy Policy');
  }

  return await res.json();
};

export const updatePrivacyPolicy = (cookies, id) => async data => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_APPLICATION_API}/privacy-policy/update?id=${formattedId}`,
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
    throw new Error('Error Update Privacy Policy');
  }

  return await res.json();
};

export const deletePrivacyPolicy = (cookies, id) => async () => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_APPLICATION_API}/privacy-policy/delete?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Delete Privacy Policy');
  }

  return await res.json();
};
