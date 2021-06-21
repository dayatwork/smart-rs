export const getDrugOrders = async (cookies, institution_id) => {
  let URL;
  if (institution_id) {
    const formattedId = institution_id.replace(/['"]+/g, '');
    URL = `${process.env.REACT_APP_PHARMACY}/receipt/listbystaff?institution_id=${formattedId}`;
  } else {
    URL = `${process.env.REACT_APP_PHARMACY}/receipt/listbystaff`;
  }
  const res = await fetch(URL, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${cookies?.token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Error Get Drug Orders');
  }

  return await res.json();
};

export const getPatientDrugOrders = async (cookies, patient_id) => {
  const formattedId = patient_id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_PHARMACY}/receipt/listbystaff?patient_id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Patient Drug Orders');
  }

  return await res.json();
};

export const getOrderDrugDetail = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_PHARMACY}/receipt/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Order Drug Detail');
  }

  return await res.json();
};

export const getOrderDrugQRCode = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_PHARMACY}/receipt/viewqr?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Order Drug QR Code');
  }

  return await res.json();
};

export const takeOrder = cookies => async data => {
  const res = await fetch(`${process.env.REACT_APP_PHARMACY}/receipt/take`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies?.token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Error Take Order');
  }

  return await res.json();
};
