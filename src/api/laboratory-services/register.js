export const getLaboratoryRegistrationList = async (
  cookies,
  institution_id
) => {
  const formattedId = institution_id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_LAB_API}/registration?institution_id=${formattedId}&sort_unix_created_at=asc`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Laboratory Registration List');
  }

  return await res.json();
};

export const createLaboratoryRegistration = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_LAB_API}/registration/create`,
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
    throw new Error('Error Create Laboratory Registration');
  }

  return await res.json();
};

export const generateQRCodeLaboratoryRegistration = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_LAB_API}/registration/generate-qr-code`,
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
    throw new Error('Error Generate QR Code Laboratory Registration');
  }

  return await res.json();
};

export const scanQRCodeLaboratoryRegistration = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_LAB_API}/registration/scan-qr-code`,
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
    throw new Error('Error Scan QR Code Laboratory Registration');
  }

  return await res.json();
};

export const getLaboratoryRegistrationDetail = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_LAB_API}/registration/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Laboratory Registration Detail');
  }

  return await res.json();
};
