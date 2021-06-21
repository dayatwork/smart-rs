export const getSoapObjectiveTemplates = async cookies => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/soap-objective-template?sort_name=asc`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get SOAP Objective Templates');
  }

  return await res.json();
};

export const getSoapObjectiveTemplateById = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/soap-objective-template/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Soap Objective Template');
  }

  return await res.json();
};

export const createSoapObjectiveTemplate = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/soap-objective-template/create`,
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
    throw new Error('Error Create Soap Objective Template');
  }

  return await res.json();
};

export const editSoapObjectiveTemplate = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/soap-objective-template/update`,
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
    throw new Error('Error Edit SOAP Objective Template');
  }

  return await res.json();
};
