export const getLaboratoryCategories = async cookies => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/laboratory/category?sort_unix_created_at=asc`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Laboratory Categories');
  }

  return await res.json();
};

export const getLaboratoryCategoryById = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/laboratory/category/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Laboratory Category');
  }

  return await res.json();
};

export const createLaboratoryCategory = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/laboratory/category/create`,
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
    throw new Error('Error Create Laboratory Category');
  }

  return await res.json();
};

export const editLaboratoryCategory = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/laboratory/category/update`,
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
    throw new Error('Error Edit Laboratory Category');
  }

  return await res.json();
};

// ==============================
// =========Sub Category=========
// ==============================
export const getLaboratorySubCategories = async (cookies, category_id) => {
  let URL = `${process.env.REACT_APP_MASTER_API}/laboratory/subcategory?sort_unix_created_at=asc`;

  if (category_id) {
    const formattedId = category_id.replace(/['"]+/g, '');
    URL = `${process.env.REACT_APP_MASTER_API}/laboratory/subcategory?laboratory_category_id=${formattedId}&sort_unix_created_at=asc`;
  }

  const res = await fetch(URL, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${cookies?.token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Error Get Laboratory Sub Categories');
  }

  return await res.json();
};

export const getLaboratorySubCategoryById = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/laboratory/subcategory/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Laboratory Sub Category');
  }

  return await res.json();
};

export const createLaboratorySubCategory = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/laboratory/subcategory/create`,
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
    throw new Error('Error Create Laboratory Sub Category');
  }

  return await res.json();
};

export const editLaboratorySubCategory = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/laboratory/subcategory/update`,
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
    throw new Error('Error Edit Laboratory Sub Category');
  }

  return await res.json();
};
