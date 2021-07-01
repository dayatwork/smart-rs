export const getSoaps = async (cookies, institutionId, status = 'process') => {
  const formattedId = institutionId.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_ANAMNESIS_API}/soap?institution_id=${formattedId}&sort_unix_created_at=asc&filter_soap_patients_status=${status}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get SOAP List');
  }

  return await res.json();
};

export const getPatientSoaps = async (cookies, patientId) => {
  const formattedId = patientId.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_ANAMNESIS_API}/soap?patient_id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get SOAP List');
  }

  return await res.json();
};

// soap/user?sort_unix_created_at=asc
export const getUserSoaps = async cookies => {
  const res = await fetch(
    `${process.env.REACT_APP_ANAMNESIS_API}/soap/user?sort_unix_created_at=asc`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get User SOAP List');
  }

  return await res.json();
};

export const createSoap = async (cookies, data) => {
  const res = await fetch(
    `${process.env.REACT_APP_ANAMNESIS_API}/soap/create`,
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
    throw new Error('Error Create SOAP');
  }

  return await res.json();
};

export const updateSoapStatus = async (cookies, data) => {
  const res = await fetch(
    `${process.env.REACT_APP_ANAMNESIS_API}/soap/update/status`,
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
    throw new Error('Error Update SOAP status');
  }

  return await res.json();
};

export const getSoapById = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_ANAMNESIS_API}/soap/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error('Error Get SOAP by id');
  }

  return await res.json();
};

// ========== Subjective ==========
// ========== Symptom ==========
export const getPatientSymptoms = async (cookies, patient_id) => {
  const formattedId = patient_id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_ANAMNESIS_API}/patient/symptom?identity=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get Patient Symptom List');
  }

  return await res.json();
};
export const createPatientSymptom = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_ANAMNESIS_API}/patient/symptom/create`,
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

export const editSoapSubjective = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_ANAMNESIS_API}/soap/subjective/update`,
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
    throw new Error('Error Update SOAP Subjective');
  }

  return await res.json();
};

export const getSoapSubjectiveDetail = async (cookies, id) => {
  const formattedId = id.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_ANAMNESIS_API}/soap/subjective/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Error Get SOAP Subjective Details');
  }

  return await res.json();
};

// ========== Objective ==========
// soap/objective/add-item
export const createPatientObjective = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_ANAMNESIS_API}/soap/objective/add-item`,
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
    throw new Error('Error Create Objective');
  }

  return await res.json();
};

// soap/objective/detail?soap_patient_id=875a1881-a2c6-4530-a30b-2cbd16ee5d74
export const getPatientObjective = async (cookies, soapId) => {
  const formattedId = soapId.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_ANAMNESIS_API}/soap/objective/detail?soap_patient_id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error('Error Get patient Objective');
  }

  return await res.json();
};

// /soap/objective/update
export const updatePatientObjective = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_ANAMNESIS_API}/soap/objective/update`,
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
    throw new Error('Error Update Objective');
  }

  return await res.json();
};

// ========== Assessment ==========
export const createPatientAssessment = async (cookies, data) => {
  const res = await fetch(
    `${process.env.REACT_APP_ANAMNESIS_API}/soap/assessment/add-item`,
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
    throw new Error('Error Create Assessment');
  }

  return await res.json();
};

export const getPatientAssessment = async (cookies, assessmentId) => {
  const formattedId = assessmentId.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_ANAMNESIS_API}/soap/assessment/detail?id=${formattedId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error('Error Get patient assessment');
  }

  return await res.json();
};

// ========== Plan ==========
export const createPatientPrescription = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_ANAMNESIS_API}/prescription/create`,
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
    throw new Error('Error Create Prescription');
  }

  return await res.json();
};

export const editPatientPrescription = cookies => async data => {
  const res = await fetch(
    `${process.env.REACT_APP_ANAMNESIS_API}/prescription/update`,
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
    throw new Error('Error Update Prescription');
  }

  return await res.json();
};

export const getPatientPrescription = async (
  cookies,
  institutionId,
  planId
) => {
  const formattedInstitutionId = institutionId.replace(/['"]+/g, '');
  const formattedPlanId = planId.replace(/['"]+/g, '');
  const res = await fetch(
    `${process.env.REACT_APP_ANAMNESIS_API}/prescription?institution_id=${formattedInstitutionId}&soap_plan_id=${formattedPlanId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error('Error Get patient prescription');
  }

  return await res.json();
};
