// export const getDrugs = async (cookies, institution_id) => {
//   const formattedId = institution_id.replace(/['"]+/g, "");
//   const res = await fetch(
//     `${process.env.REACT_APP_INSTITUTION_API}/division?institution_id=${formattedId}&sort_unix_created_at=asc`,
//     {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${cookies?.token}`,
//       },
//     }
//   );

//   if (!res.ok) {
//     throw new Error("Error Get Divisions");
//   }

//   return await res.json();
// };

export const getDrugs = async (cookies, institution_id) => {
  const formattedId = institution_id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_PHARMACY}/drug?institution_id=${formattedId}&sort_unix_created_at=asc`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Drugs');
  }

  return await res.json();
};

export const createDrug = cookies => async data => {
  const res = await fetch(`${process.env.REACT_APP_PHARMACY}/drug/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies?.token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Error Create Drug');
  }

  return await res.json();
};

export const getDrugById = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_PHARMACY}/drug/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Drug Details');
  }

  return await res.json();
};

export const editDrug = cookies => async data => {
  const res = await fetch(`${process.env.REACT_APP_PHARMACY}/drug/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies?.token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Error Edit Drug');
  }

  return await res.json();
};
