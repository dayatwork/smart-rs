export const getServiceTypes = async (cookies, institution_id) => {
  const formattedId = institution_id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_INSTITUTION_API}/service/type?institution_id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Service Type');
  }

  return await res.json();
};

export const getServiceTypeById = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_INSTITUTION_API}/department/type/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Department Type by id');
  }

  return await res.json();
};

export const createServiceType = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_INSTITUTION_API}/service/type/create`,
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
    throw new Error('Error Create Service Type');
  }

  return await res.json();
};

export const getServices = async (cookies, institution_id) => {
  const formattedId = institution_id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_INSTITUTION_API}/service?institution_id=${formattedId}&sort_unix_created_at=asc`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Services');
  }

  return await res.json();
};

// v1/institution/create
export const createService = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_INSTITUTION_API}/service/create`,
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
    throw new Error('Error Create Service');
  }

  return await res.json();
};

export const getServiceSchedules = async (cookies, institution_id) => {
  const formattedId = institution_id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_INSTITUTION_API}/service/schedule?institution_id=${formattedId}&sort_unix_created_at=asc`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Service Schedules');
  }

  return await res.json();
};

export const getServiceScheduleDetail = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_INSTITUTION_API}/service/schedule/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Service Schedule Detail');
  }

  return await res.json();
};

export const createServiceSchedule = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_INSTITUTION_API}/service/schedule/create`,
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
    throw new Error('Error Create Service Schedule');
  }

  return await res.json();
};

export const getScheduleEstimatedTimes = async (cookies, scheduleDetailId) => {
  const formattedId = scheduleDetailId.replace(/['"]+/g, '');
  // service/schedule/estimation?service_schedule_detail_id=2d6896f7-4fee-4991-9a89-fe9b59fd5531&sort_available_time=asc
  const res = await fetch(
    `${process.env.REACT_APP_INSTITUTION_API}/service/schedule/estimation?service_schedule_detail_id=${formattedId}&sort_available_time=asc`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Service Schedule Estimated Times');
  }

  return await res.json();
};

// export const getBookingSchedules = async (
//   cookies,
//   { startDate, endDate, serviceId, limit = 10, page, first, last }
// ) => {
//   // const URL = `${process.env.REACT_APP_BOOKING_API}/schedule/list?startDate=${startDate}&endDate=${endDate}&service_id=${serviceId}`;
//   const pagination =
//     page && first && last
//       ? `&page=${page}&first_unix_created_at=${first}&last_unix_created_at=${last}`
//       : '';

//   const URL = `${process.env.REACT_APP_INSTITUTION_API}/service/schedule/list-doctor?service_id=${serviceId}&sort_unix_created_at=asc&sort_date=asc&limit=${limit}&first_date=${startDate}&last_date=${endDate}${pagination}`;
//   const res = await fetch(URL, {
//     method: 'GET',
//     headers: {
//       Authorization: `Bearer ${cookies?.token}`,
//     },
//   });

//   if (!res.ok) {
//     throw new Error('Error Get Schedules List');
//   }

//   return await res.json();
// };

// export const getBookingSchedules = async (
//   cookies,
//   { serviceId, limit = 10, page = 1, first_date, last_date, institutionId }
// ) => {
//   const dateFilter =
//     first_date && last_date
//       ? `&first_date=${first_date}&last_date=${last_date}`
//       : '';

//   const pagination = limit && page ? `&limit=${limit}&page=${page}` : '';
//   // const institutionId = 'cf5e9090-3657-41f6-903e-9ba95184f3ff';

//   // const URL = `${process.env.REACT_APP_INSTITUTION_API}/service/schedule/list/doctor?service_id=${serviceId}${dateFilter}${pagination}&sort_date=asc&sort_start_time=asc`;
//   const filterInstitution = institutionId
//     ? `institution_id=${institutionId}&`
//     : '';

//   const URL = `${process.env.REACT_APP_INSTITUTION_API}/service/schedule/list/doctor?${filterInstitution}service_id=${serviceId}${dateFilter}${pagination}&sort_date=asc&sort_start_time=asc`;

//   const res = await fetch(URL, {
//     method: 'GET',
//     headers: {
//       Authorization: `Bearer ${cookies?.token}`,
//     },
//   });

//   if (!res.ok) {
//     throw new Error('Error Get Schedules List');
//   }

//   return await res.json();
// };

export const getBookingSchedules = async (
  cookies,
  { serviceId, limit = 10, page = 1, first_date, last_date, institutionId }
) => {
  const dateFilter =
    first_date && last_date
      ? `&start_date=${first_date}&end_date=${last_date}`
      : '';

  const pagination = limit && page ? `&limit=${limit}&page=${page}` : '';
  // const institutionId = 'cf5e9090-3657-41f6-903e-9ba95184f3ff';

  // const URL = `${process.env.REACT_APP_INSTITUTION_API}/service/schedule/list/doctor?service_id=${serviceId}${dateFilter}${pagination}&sort_date=asc&sort_start_time=asc`;
  const filterInstitution = institutionId
    ? `institution_id=${institutionId}&`
    : '';

  const URL = `${process.env.REACT_APP_INSTITUTION_API}/service/schedule/list/doctor?${filterInstitution}service_id=${serviceId}${dateFilter}${pagination}&sort_date=asc&sort_start_time=asc`;

  const res = await fetch(URL, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${cookies?.token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Error Get Schedules List');
  }

  return await res.json();
};

// export const getBookingSchedulesInstitution = async (
//   cookies,
//   { startDate, endDate, serviceId, institutionId }
// ) => {
//   // const URL = `${process.env.REACT_APP_BOOKING_API}/schedule/list?startDate=${startDate}&endDate=${endDate}&service_id=${serviceId}`;

//   const URL = `${process.env.REACT_APP_INSTITUTION_API}/service/schedule/list-doctor?institution_id=${institutionId}&service_id=${serviceId}&sort_date=asc&first_date=${startDate}&last_date=${endDate}`;
//   const res = await fetch(URL, {
//     method: 'GET',
//     headers: {
//       Authorization: `Bearer ${cookies?.token}`,
//     },
//   });

//   if (!res.ok) {
//     throw new Error('Error Get Schedules List');
//   }

//   return await res.json();
// };

export const getBookingSchedulesInstitution = async (
  cookies,
  { serviceId, limit = 10, page = 1, first_date, last_date, institutionId }
) => {
  const dateFilter =
    first_date && last_date
      ? `&first_date=${first_date}&last_date=${last_date}`
      : '';

  const pagination = limit && page ? `&limit=${limit}&page=${page}` : '';

  const URL = `${process.env.REACT_APP_INSTITUTION_API}/service/schedule/list/doctor?institution_id=${institutionId}&service_id=${serviceId}${dateFilter}${pagination}&sort_date=asc&sort_start_time=asc`;

  const res = await fetch(URL, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${cookies?.token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Error Get Schedules List');
  }

  return await res.json();
};
