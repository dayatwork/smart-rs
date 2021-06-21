export const getServicePrice = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_FINANCE_API}/price/service?institution_id=${formattedId}&sort_unix_created_at=asc`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Service Price');
  }

  return await res.json();
};

export const createServicePrice = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_FINANCE_API}/price/service/create`,
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
    throw new Error('Error Create Service Price');
  }

  return await res.json();
};

export const getServicePriceDetails = async (
  cookies,
  institution_id,
  service_id
) => {
  const formattedInstitutionId = institution_id.replace(/['"]+/g, '');
  const formattedServiceId = service_id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_FINANCE_API}/price/service/detail?service_id=${formattedServiceId}&institution_id=${formattedInstitutionId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Service Price Detail');
  }

  return await res.json();
};
