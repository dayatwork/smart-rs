// query-key => master-application
export const getFAQList = async cookies => {
  const res = await fetch(`${process.env.REACT_APP_APPLICATION_API}/faq`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${cookies?.token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Error Get FAQ List');
  }

  return await res.json();
};

export const getFAQDetail = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_APPLICATION_API}/faq/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get FAQ Detail');
  }

  return await res.json();
};

export const createFAQ = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_APPLICATION_API}/faq/create`,
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
    throw new Error('Error Create FAQ');
  }

  return await res.json();
};

export const updateFAQ = (cookies, id) => async data => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_APPLICATION_API}/faq/update?id=${formattedId}`,
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
    throw new Error('Error Update FAQ');
  }

  return await res.json();
};

export const deleteFAQ = (cookies, id) => async () => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_APPLICATION_API}/faq/delete?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Delete FAQ');
  }

  return await res.json();
};

// ===========================
// ====== FAQ Category =======
// ===========================

export const getFAQCategoryList = async cookies => {
  const res = await fetch(
    `${process.env.REACT_APP_APPLICATION_API}/faq/category`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get FAQ Category List');
  }

  return await res.json();
};

export const getFAQCategoryDetail = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_APPLICATION_API}/faq/category/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get FAQ Category Detail');
  }

  return await res.json();
};

export const createFAQCategory = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_APPLICATION_API}/faq/category/create`,
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
    throw new Error('Error Create FAQ Category');
  }

  return await res.json();
};

export const updateFAQCategory = (cookies, id) => async data => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_APPLICATION_API}/faq/category/update?id=${formattedId}`,
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
    throw new Error('Error Update FAQ Category');
  }

  return await res.json();
};

export const deleteFAQCategory = (cookies, id) => async () => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_APPLICATION_API}/faq/category/delete?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Delete FAQ Category');
  }

  return await res.json();
};
