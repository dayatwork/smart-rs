export const getRadiologyCategories = async cookies => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/radiology/category?sort_name=asc`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Radiology Categories');
  }

  return await res.json();
};

export const getRadiologyCategoryById = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/radiology/category/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Radiology Category');
  }

  return await res.json();
};

export const createRadiologyCategory = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/radiology/category/create`,
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
    throw new Error('Error Create Radiology Category');
  }

  return await res.json();
};

export const editRadiologyCategory = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/radiology/category/update`,
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
    throw new Error('Error Edit Radiology Category');
  }

  return await res.json();
};

// ==============================
// =========Sub Category=========
// ==============================
export const getRadiologySubCategories = async (cookies, category_id) => {
  const formattedId = category_id ? category_id.replace(/['"]+/g, '') : null;
  const URL = formattedId
    ? `${process.env.REACT_APP_MASTER_API}/radiology/subcategory?sort_unix_created_at=asc&radiology_category_id=${formattedId}&mode=dropdown`
    : `${process.env.REACT_APP_MASTER_API}/radiology/subcategory?sort_unix_created_at=asc&mode=dropdown`;

  const res = await fetch(URL, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${cookies?.token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Error Get Radiology Sub Categories');
  }

  return await res.json();
};

export const getRadiologySubCategoryById = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/radiology/subcategory/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Radiology Sub Category');
  }

  return await res.json();
};

export const createRadiologySubCategory = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/radiology/subcategory/create`,
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
    throw new Error('Error Create Radiology Sub Category');
  }

  return await res.json();
};

export const editRadiologySubCategory = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_MASTER_API}/radiology/subcategory/update`,
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
    throw new Error('Error Edit Radiology Sub Category');
  }

  return await res.json();
};
