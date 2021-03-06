// /statistic/total-patient?institution_id=
export const getTotalPatients = async (cookies, institution_id) => {
  const formattedInstitutionId = institution_id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_PATIENT_API_V2}/statistic/total-patient?institution_id=${formattedInstitutionId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Total Patiens');
  }

  return await res.json();
};
