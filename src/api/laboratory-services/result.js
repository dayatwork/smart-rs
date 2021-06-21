export const getLaboratoryResultList = async (cookies, institution_id) => {
  const formattedId = institution_id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_LAB_API}/blood/result?institution_id=${formattedId}&sort_unix_created_at=asc`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Laboratory Result List');
  }

  return await res.json();
};

// export const getLaboratoryResultList = async (cookies) => {
//   const res = await fetch(`${process.env.REACT_APP_LAB_API}/blood/result`, {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${cookies?.token}`,
//     },
//   });

//   if (!res.ok) {
//     throw new Error("Error Get Laboratory Result List");
//   }

//   return await res.json();
// };

export const createLaboratoryResult = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_LAB_API}/blood/result/create`,
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
    throw new Error('Error Create Laboratory Result');
  }

  return await res.json();
};

export const getLaboratoryResultDetail = async (cookies, id) => {
  // const formattedId = id.replace(/['"]+/g, "");
  const res = await fetch(
    `${process.env.REACT_APP_LAB_API}/blood/result/detail?id=${id}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Laboratory Result Detail');
  }

  return await res.json();
};

export const editLaboratoryBloodStatus = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_LAB_API}/blood/result/update`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookies?.token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    throw new Error('Error Update Laboratory Result');
  }

  return await res.json();
};
