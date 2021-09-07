// /statistic/total-patient?institution_id=
export const getTotalEmployees = async (cookies, institution_id) => {
  const formattedInstitutionId = institution_id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_HUMAN_CAPITAL_API}/statistic/total-employee?institution_id=${formattedInstitutionId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Total Employee');
  }

  return await res.json();
};
