export const getBookingStatistic = async (
  cookies,
  institution_id,
  booking_status
) => {
  // console.log({ cookies });
  const formattedId = institution_id.replace(/['"]+/g, '');
  const status = booking_status ? booking_status.replace(/['"]+/g, '') : '';
  const bookingStatus = status ? `&booking_status=${status}` : '';

  const URL = `${process.env.REACT_APP_BOOKING_API}/statistic/total-booking?institution_id=${formattedId}${bookingStatus}`;

  const res = await fetch(URL, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${cookies?.token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Error Get Booking Statistic');
  }

  return await res.json();
};

export const getBookingStatisticByDay = async (
  cookies,
  { institution_id = '', booking_status = '', startDate, endDate }
) => {
  // console.log({ cookies });
  const formattedId = institution_id
    ? institution_id.replace(/['"]+/g, '')
    : '';
  const status = booking_status ? booking_status.replace(/['"]+/g, '') : '';

  const bookingStatus = status ? `&booking_status=${status}` : '';
  const filterDate =
    startDate && endDate ? `&startDate=${startDate}&endDate=${endDate}` : '';

  const URL = `${process.env.REACT_APP_BOOKING_API}/statistic/graph-booking?institution_id=${formattedId}${bookingStatus}&groupBy=day${filterDate}`;

  const res = await fetch(URL, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${cookies?.token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Error Get Booking Statistic');
  }

  return await res.json();
};
