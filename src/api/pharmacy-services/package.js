export const getDrugPackages = async (cookies, institution_id) => {
  const formattedId = institution_id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_PHARMACY}/package?institution_id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Drug Packages');
  }

  return await res.json();
};

export const getDrugPackageDetail = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_PHARMACY}/package/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Drug Package Detail');
  }

  return await res.json();
};

export const createPackage = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_PHARMACY}/package/create-package`,
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
    throw new Error('Error Create Package');
  }

  return await res.json();
};

export const processPackage = cookies => async data => {
  const res = await fetch(`${process.env.REACT_APP_PHARMACY}/package/proceed`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies?.token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Error Proceed Package');
  }

  return await res.json();
};

export const completePackage = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_PHARMACY}/package/completed`,
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
    throw new Error('Error Complete Package');
  }

  return await res.json();
};
