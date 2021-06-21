export const getCities = async (id) => {
  // const parse = JSON.parse(id);
  const res = await fetch(
    `https://dev.farizdotid.com/api/daerahindonesia/kota?id_provinsi=${id}`,
  );

  if (!res.ok) {
    throw new Error('Error Get Cities');
  }

  return await res.json();
};
export const getDistricts = async (id) => {
  // const parse = JSON.parse(id);
  const res = await fetch(
    `https://dev.farizdotid.com/api/daerahindonesia/kecamatan?id_kota=${id}`,
  );

  if (!res.ok) {
    throw new Error('Error Get Districs');
  }

  return await res.json();
};
export const getSubDistricts = async (id) => {
  // const parse = JSON.parse(id);
  const res = await fetch(
    `https://dev.farizdotid.com/api/daerahindonesia/kelurahan?id_kecamatan=${id}`,
  );

  if (!res.ok) {
    throw new Error('Error Get Districs');
  }

  return await res.json();
};
