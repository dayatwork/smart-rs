export const getBookingList = async (cookies, institution_id) => {
  // console.log({ cookies });
  const formattedId = institution_id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_BOOKING_API}/booking-patient/list?institution_id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Booking List');
  }

  return await res.json();
};

export const getBookingDetail = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_BOOKING_API}/booking-patient/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Booking Detail');
  }

  return await res.json();
};

export const createBooking = async (cookies, data) => {
  const res = await fetch(
    `${process.env.REACT_APP_BOOKING_API}/booking-patient/create`,
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
    throw new Error('Error Create Booking');
  }

  return await res.json();
};

export const cancelBooking = async (cookies, booking_id) => {
  const res = await fetch(
    `${process.env.REACT_APP_BOOKING_API}/booking-patient/cancel`,
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
    throw new Error('Error Cancel Booking');
  }

  return await res.json();
};

export const createOnsiteBooking = async (cookies, data) => {
  const res = await fetch(
    `${process.env.REACT_APP_BOOKING_API}/booking-patient/onsite`,
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
    throw new Error('Error Create Onsite Booking');
  }

  const json = await res.json();

  return json;
};
// booking-patient/updatestatus
// export const updateBookingStatus = async (cookies, data) => {
//   const res = await fetch(
//     `${process.env.REACT_APP_BOOKING_API}/booking-patient/updatestatus`,
//     {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${cookies?.token}`,
//       },
//       body: JSON.stringify(data),
//     }
//   );

//   if (!res.ok) {
//     throw new Error('Error Update Booking Status');
//   }

//   const json = await res.json();

//   return json;
// };

export const updateBookingStatus = async (cookies, data) => {
  const res = await fetch(
    `${process.env.REACT_APP_BOOKING_API}/booking-patient/update`,
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
    throw new Error('Error Update Booking Status');
  }

  const json = await res.json();

  return json;
};

// http://book-dev.ejemplo.me/1.0/booking-patient/viewqr?params=aa554e39-0f46-40c5-abdf-fc14da76dd50
export const getQRCode = async (cookies, bookingId) => {
  const res = await fetch(
    `${process.env.REACT_APP_BOOKING_API}/booking-patient/viewqr?id=${bookingId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get QR Code');
  }

  return await res.json();
};

export const getUserBookingList = async token => {
  const res = await fetch(`${process.env.REACT_APP_BOOKING_API}/booking/user`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Error Get User Booking List');
  }

  return await res.json();
};

export const getUserResponsibleBookingList = async token => {
  const res = await fetch(
    `${process.env.REACT_APP_BOOKING_API}/booking/user/responsible`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get User Booking List');
  }

  return await res.json();
};
