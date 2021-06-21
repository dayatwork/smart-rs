export const getPatientSocialHistories = async (cookies, patient_id) => {
  const formattedId = patient_id?.replace(/['"]+/g, '');
  if (formattedId) {
    const response = await fetch(
      `${process.env.REACT_APP_ANAMNESIS_API}/patient/social-history?identity=${formattedId}`,
      {
        headers: {
          Authorization: `Bearer ${cookies?.token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Error create social history');
    }

    return response.json();
  }
};

export const updatePatientSocialHistories = async (cookies, data) => {
  const response = await fetch(
    `${process.env.REACT_APP_ANAMNESIS_API}/patient/social-history/update`,
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
    throw new Error('Error update social history');
  }

  return response.json();
};
