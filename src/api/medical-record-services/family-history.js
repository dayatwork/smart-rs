export const getPatientFamilyHistories = async (cookies, patient_id) => {
  const formattedId = patient_id?.replace(/['"]+/g, '');
  if (formattedId) {
    const response = await fetch(
      `${process.env.REACT_APP_ANAMNESIS_API}/patient/family-history?identity=${formattedId}`,
      {
        headers: {
          Authorization: `Bearer ${cookies?.token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Error get family history');
    }

    return response.json();
  }
};

export const updatePatientFamilyHistories = async (cookies, data) => {
  const response = await fetch(
    `${process.env.REACT_APP_ANAMNESIS_API}/patient/family-history/update`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookies?.token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error('Error update family history');
  }

  return response.json();
};
