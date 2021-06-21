export const getRadiologyCategories = async (cookies, institution_id) => {
  const formattedId = institution_id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_INSTITUTION_API}/radiology/category?institution_id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Institution Radiology Categories');
  }

  return await res.json();
};

export const getRadiologyCategoriesName = async (cookies, institution_id) => {
  const formattedId = institution_id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_INSTITUTION_API}/radiology/category/name?institution_id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Institution Radiology Categories Name');
  }

  return await res.json();
};
export const getRadiologySubCategoriesName = async (
  cookies,
  institution_id,
  category_id
) => {
  const formattedInstitutionId = institution_id.replace(/['"]+/g, '');
  const formattedCategoryId = category_id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_INSTITUTION_API}/radiology/subcategory/name?institution_id=${formattedInstitutionId}&category_id=${formattedCategoryId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Institution Radiology Sub Categories Name');
  }

  return await res.json();
};

export const getRadiologyCategoryById = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_INSTITUTION_API}/radiology/category/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Institution Radiology Category details');
  }

  return await res.json();
};

export const createRadiologyCategory = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_INSTITUTION_API}/radiology/category/create`,
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
    throw new Error('Error Create Institution Radiology Category');
  }

  return await res.json();
};

export const deleteRadiologyCategory = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_INSTITUTION_API}/radiology/category/delete?id=${formattedId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Delete Institution Radiology Category');
  }

  return await res.json();
};
