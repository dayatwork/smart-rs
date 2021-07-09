export const createRadiologyResult = async (cookies, data) => {
  const res = await fetch(
    `${process.env.REACT_APP_RADIOLOGY}/radiology/result/create`,
    {
      method: 'POST',

      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
      body: data,
    }
  );

  if (!res.ok) {
    throw new Error('Error Create radiology result');
  }

  return await res.json();
};

export const getSoapRadiologyResultList = async (
  cookies,
  soap_id,
  patient_id
) => {
  const formattedId = soap_id.replace(/['"]+/g, '');
  const formattedPatientId = patient_id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_RADIOLOGY}/radiology/result/detail/soap?soap_id=${formattedId}&patient_id=${formattedPatientId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get SOAP Radiology Result List');
  }

  return await res.json();
};
