// query key => master-routes
export const getRoutes = async cookies => {
  // const formattedAppId = appId.replace(/['"]+/g, "");
  // const formattedMenuId = menuId.replace(/['"]+/g, "");

  const res = await fetch(
    // `${process.env.REACT_APP_APPLICATION_API}/route?app_id=${formattedAppId}&menu_id=${formattedMenuId}&sort_unix_created_at=asc`,
    `${process.env.REACT_APP_APPLICATION_API}/route?sort_name=asc`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Routes');
  }

  return await res.json();
};

export const getRoutesByMenu = async (cookies, menu) => {
  const id = JSON.parse(menu).id;
  const formattedMenuId = id.replace(/['"]+/g, '');

  const res = await fetch(
    `${process.env.REACT_APP_APPLICATION_API}/route?menu_id=${formattedMenuId}&sort_name=asc`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Routes');
  }

  return await res.json();
};

export const createRoute = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_APPLICATION_API}/route/create`,
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
    throw new Error('Error Create Route');
  }

  return await res.json();
};
