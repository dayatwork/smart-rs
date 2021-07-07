// export const getLaboratoryBloodList = async (cookies, institution_id) => {
//   const formattedId = institution_id.replace(/['"]+/g, "");
//   const res = await fetch(
//     `${process.env.REACT_APP_LAB_API}/bloods?institution_id=${formattedId}&sort_unix_created_at=asc`,
//     {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${cookies?.token}`,
//       },
//     }
//   );

//   if (!res.ok) {
//     throw new Error("Error Get Laboratory Blood List");
//   }

//   return await res.json();
// };

export const getLaboratoryBloodList = async (
  cookies,
  institution_id,
  soapId
) => {
  const formattedId = institution_id.replace(/['"]+/g, '');
  const formattedSoapId = soapId && soapId.replace(/['"]+/g, '');
  let URL;

  if (formattedSoapId) {
    URL = `${process.env.REACT_APP_LAB_API}/blood?institution_id=${formattedId}&sort_unix_created_at=asc&soap_id=${formattedSoapId}`;
  } else {
    URL = `${process.env.REACT_APP_LAB_API}/blood?institution_id=${formattedId}&sort_unix_created_at=asc`;
  }

  const res = await fetch(URL, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${cookies?.token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Error Get Laboratory Blood List');
  }

  return await res.json();
};

export const createLaboratoryBlood = cookies => async data => {
  const res = await fetch(`${process.env.REACT_APP_LAB_API}/blood/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies?.token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Error Create Laboratory Blood');
  }

  return await res.json();
};

export const getLaboratoryBloodDetail = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_LAB_API}/blood/detail?id=${formattedId}&sort_unix_created_at=asc`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Laboratory Blood Detail');
  }

  return await res.json();
};

export const editLaboratoryBlood = cookies => async data => {
  const res = await fetch(`${process.env.REACT_APP_LAB_API}/blood/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies?.token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Error Update Laboratory Blood ');
  }

  return await res.json();
};

export const scanQRPatientBloodDetail = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_LAB_API}/blood/scan-qr-code`,
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
    throw new Error('Error Scan QR Patient Blood Detail');
  }

  return await res.json();
};
