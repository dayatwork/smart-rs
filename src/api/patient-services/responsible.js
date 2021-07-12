export const getResponsibleList = async cookies => {
  const res = await fetch(
    `${process.env.REACT_APP_PATIENT_API}/patient/responsible`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get responsible list');
  }

  return await res.json();
};
