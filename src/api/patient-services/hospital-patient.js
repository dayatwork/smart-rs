export const getHospitalPatients = async (cookies, institution_id) => {
  const formattedInstitutionId = institution_id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_PATIENT_API}/patient/hospital?institution_id=${formattedInstitutionId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Hospital Patiens');
  }

  return await res.json();
};

export const getHospitalPatientById = async (
  cookies,
  { patient_id, institution_id }
) => {
  const formattedPatientId = patient_id.replace(/['"]+/g, '');
  const formattedInstitutionId = institution_id.replace(/['"]+/g, '');

  const res = await fetch(
    `${process.env.REACT_APP_PATIENT_API}/patient/hospital/detail?identity=${formattedPatientId}&institution_id=${formattedInstitutionId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Patient');
  }

  return await res.json();
};
