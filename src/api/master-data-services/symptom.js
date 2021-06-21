export const getSymptoms = async cookies => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/symptom?sort_name=asc`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Symptoms');
  }

  return await res.json();
};

export const getSymptomById = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/symptom/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Symptom');
  }

  return await res.json();
};

export const createSymptoms = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/symptom/create`,
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
    throw new Error('Error Create Symptom');
  }

  return await res.json();
};

export const editSymptom = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/symptom/update`,
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
    throw new Error('Error Edit Symptom');
  }

  return await res.json();
};
