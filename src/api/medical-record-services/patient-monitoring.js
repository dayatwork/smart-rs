export const getPatientMonitoringList = async cookies => {
  const response = await fetch(
    `${process.env.REACT_APP_ANAMNESIS_API_V2}/monitoring`,
    {
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Error get patient monitoring list');
  }

  return response.json();
};

export const createPatientMonitoring = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_ANAMNESIS_API_V2}/monitoring`,
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
    throw new Error('Error Create Patient Symptom');
  }

  return await res.json();
};

// export const addPatientSymptom = cookies => async data => {
//   const res = await fetch(
//     `${process.env.REACT_APP_ANAMNESIS_API}/patient/symptom/add-item`,
//     {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${cookies?.token}`,
//       },
//       body: JSON.stringify(data),
//     }
//   );

//   if (!res.ok) {
//     throw new Error('Error Add Patient Symptom');
//   }

//   return await res.json();
// };

// export const deletePatientSymptom = async (cookies, data) => {
//   const res = await fetch(
//     `${process.env.REACT_APP_ANAMNESIS_API}/patient/symptom/delete`,
//     {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${cookies?.token}`,
//       },
//       body: JSON.stringify(data),
//     }
//   );

//   if (!res.ok) {
//     throw new Error('Error Add Patient Symptom');
//   }

//   return await res.json();
// };
