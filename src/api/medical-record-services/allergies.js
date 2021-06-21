export const getPatientAllergies = async (cookies, patient_id) => {
  const formattedId = patient_id?.replace(/['"]+/g, '');
  if (formattedId) {
    const response = await fetch(
      `${process.env.REACT_APP_ANAMNESIS_API}/patient/allergy?identity=${formattedId}`,
      {
        headers: {
          Authorization: `Bearer ${cookies?.token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(response.json().message);
    }

    return response.json();
  }
};

export const updatePatientAllergies = async (cookies, data) => {
  const response = await fetch(
    `${process.env.REACT_APP_ANAMNESIS_API}/patient/allergy/update`,
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
    throw new Error('Error update allergy');
  }

  return response.json();
};
