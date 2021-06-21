export const getSchedules = async cookies => {
  // const formattedId = institution_id.replace(/['"]+/g, "");
  const res = await fetch(
    `${process.env.REACT_APP_HUMAN_CAPITAL_API}/schedule?sort_unix_created_at=asc`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Schedules');
  }

  return await res.json();
};

export const createSchedule = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_HUMAN_CAPITAL_API}/schedule/create`,
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
    throw new Error('Error Create Schedule');
  }

  return await res.json();
};

export const getEmployeeSchedules = async cookies => {
  // const formattedId = institution_id.replace(/['"]+/g, "");
  const res = await fetch(
    `${process.env.REACT_APP_HUMAN_CAPITAL_API}/schedule/employee?sort_unix_created_at=asc`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Employee Schedules');
  }

  return await res.json();
};

export const getEmployeeScheduleById = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');

  const res = await fetch(
    `${process.env.REACT_APP_HUMAN_CAPITAL_API}/schedule/employee/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Employee Schedule by ID');
  }

  return await res.json();
};

export const createEmployeeSchedule = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_HUMAN_CAPITAL_API}/schedule/employee/create`,
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
    throw new Error('Error Create Employee Schedule');
  }

  return await res.json();
};
