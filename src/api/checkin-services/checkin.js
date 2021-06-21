export const createCheckIn = async (cookies, booking_id) => {
  const res = await fetch(
    `${process.env.REACT_APP_CHECKIN_API}/checkin-patient/create`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookies?.token}`,
      },
      body: JSON.stringify({ booking_id }),
    }
  );

  if (!res.ok) {
    throw new Error('Error Check In');
  }

  return await res.json();
};
