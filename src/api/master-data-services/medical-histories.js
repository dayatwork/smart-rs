export const getMedicalHistories = async cookies => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/medical-history?sort_name=asc`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error get medical histories');
  }

  return await res.json();
};

export const getMedicalHistoryById = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/medical-history/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error get medical history');
  }

  return await res.json();
};

export const createMedicalHistories = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/medical-history/create`,
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
    throw new Error('Error create medical history');
  }

  return await res.json();
};

export const editMedicalHistory = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/medical-history/update`,
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
    throw new Error('Error edit medical history');
  }

  return await res.json();
};
