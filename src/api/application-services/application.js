// query-key => master-application
export const getApplications = async cookies => {
  const res = await fetch(
    `${process.env.REACT_APP_APPLICATION_API}/application?sort_unix_created_at=asc`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Application');
  }

  return await res.json();
};

export const getApplicationById = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_APPLICATION_API}/application/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Application');
  }

  return await res.json();
};

export const createApplication = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_APPLICATION_API}/application/create`,
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
    throw new Error('Error Create Application');
  }

  return await res.json();
};

export const EditApplication = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_APPLICATION_API}/application/update`,
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
    throw new Error('Error Edit Application');
  }

  return await res.json();
};

export const deleteApplication = (cookies, id) => async () => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_APPLICATION_API}/application/delete?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Delete Application');
  }

  return await res.json();
};
