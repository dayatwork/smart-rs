export const createRadiologyResult = async (cookies, data) => {
  const res = await fetch(
    `${process.env.REACT_APP_RADIOLOGY}/radiology/result/create`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
      body: data,
    }
  );

  if (!res.ok) {
    throw new Error('Error Create radiology result');
  }

  return await res.json();
};
