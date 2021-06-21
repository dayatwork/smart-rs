// query key => ['patient-vital-sign', cookies?.user?.id]
export const getPatientVitalSign = async (cookies, patient_id) => {
  const formattedId = patient_id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_ANAMNESIS_API}/vital-sign/detail?identity=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Patient Vital Sign');
  }

  return await res.json();
};

export const createPatientVitalSign = async (cookies, data) => {
  const res = await fetch(
    `${process.env.REACT_APP_ANAMNESIS_API}/vital-sign/create`,
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
    throw new Error('Error Create Patient Vital Sign');
  }

  return await res.json();
};
