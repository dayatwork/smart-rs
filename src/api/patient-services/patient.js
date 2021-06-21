export const registerPatient = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_PATIENT_API}/patient/create`,
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
    throw new Error('Error register patient');
  }

  return await res.json();
};
