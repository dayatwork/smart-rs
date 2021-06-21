export const getEventNodes = async cookies => {
  const res = await fetch(
    `${process.env.REACT_APP_APPLICATION_API}/event-node?sort_name=asc&mode=table`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Event Nodes');
  }

  return await res.json();
};

export const createEventNode = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_APPLICATION_API}/event-node/create`,
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
    throw new Error('Error Create Event Node');
  }

  return await res.json();
};

export const editEventNode = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_APPLICATION_API}/event-node/update`,
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
    throw new Error('Error Edit Event Node');
  }

  return await res.json();
};
