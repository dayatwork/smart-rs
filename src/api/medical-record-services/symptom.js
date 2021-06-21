export const getPatientSymptoms = async (
  cookies,
  patient_id,
  subjective_id
) => {
  const formattedId = patient_id?.replace(/['"]+/g, '');
  const formattedSubId = subjective_id?.replace(/['"]+/g, '');
  if (formattedId) {
    const response = await fetch(
      `${process.env.REACT_APP_ANAMNESIS_API}/patient/symptom/detail?identity=${formattedId}&soap_subjective_id=${formattedSubId}`,
      {
        headers: {
          Authorization: `Bearer ${cookies?.token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Error get patient symptoms');
    }

    return response.json();
  }
};

export const createPatientSymptom = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_ANAMNESIS_API}/patient/symptom/create`,
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
    throw new Error('Error Create Patient Symptom');
  }

  return await res.json();
};

export const addPatientSymptom = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_ANAMNESIS_API}/patient/symptom/add-item`,
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
    throw new Error('Error Add Patient Symptom');
  }

  return await res.json();
};

export const deletePatientSymptom = async (cookies, data) => {
  const res = await fetch(
    `${process.env.REACT_APP_ANAMNESIS_API}/patient/symptom/delete`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookies?.token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    throw new Error('Error Add Patient Symptom');
  }

  return await res.json();
};
