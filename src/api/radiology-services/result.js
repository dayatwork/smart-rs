export const createRadiologyResult = async (cookies, data, patient_id) => {
  const res = await fetch(
    `${process.env.REACT_APP_RADIOLOGY}/radiology/result/create`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
        patient_id,
        // Accept: 'application/json, application/xml, text/plain, text/html, *.*',
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

export const getRadiologyResultDetail = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');

  const res = await fetch(
    `${process.env.REACT_APP_RADIOLOGY}/radiology/result/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Radiology Result Detail');
  }

  return await res.json();
};

export const getRadiologyResultList = async (cookies, institution_id) => {
  const formattedId = institution_id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_RADIOLOGY}/radiology/result?institution_id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Radiology Results List');
  }

  return await res.json();
};
