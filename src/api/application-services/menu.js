// query key => "master-menu"
export const getMenus = async cookies => {
  const res = await fetch(
    `${process.env.REACT_APP_APPLICATION_API}/menu?sort_name=asc&mode=table`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Menu');
  }

  return await res.json();
};

export const getMenusDropdown = async cookies => {
  const res = await fetch(
    `${process.env.REACT_APP_APPLICATION_API}/menu?sort_name=asc&filter_menus_name=Das&mode=dropdown`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Menu');
  }

  return await res.json();
};

export const getMenuById = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_APPLICATION_API}/menu/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Menu');
  }

  return await res.json();
};

export const createMenu = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_APPLICATION_API}/menu/create`,
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
    throw new Error('Error Create Menu');
  }

  return await res.json();
};

export const updateMenu = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_APPLICATION_API}/menu/update`,
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
    throw new Error('Error Update Menu');
  }

  return await res.json();
};

export const deleteMenu = (cookies, id) => async () => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_APPLICATION_API}/menu/delete?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Delete');
  }

  return await res.json();
};
