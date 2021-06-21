export const calculateBMI = (weight, height) => {
  if (Number(height) === 0) {
    return 0;
  } else {
    const BMI = Number(weight) / ((Number(height) * Number(height)) / 10000);
    return Number(BMI.toFixed(2));
  }
};

export const getBmiStatus = (bmi) => {
  if (bmi <= 0) {
    return '';
  } else if (bmi <= 18.5) {
    return 'Underweight';
  } else if (bmi <= 24.9) {
    return 'Normal';
  } else if (bmi <= 29.9) {
    return 'Overweight';
  } else if (bmi >= 30) {
    return 'Obesity';
  }
};

export const getBodyTemperatureStatus = (temp) => {
  if (temp < 35) {
    return 'Hypothermia';
  } else if (temp < 37.5) {
    return 'Normal';
  } else if (temp < 38.3) {
    return 'Fever/ Hyperthermia';
  } else {
    return 'Hyperpyrexia';
  }
};

export const getOxygenSaturationStatus = (value) => {
  if (value > 100) {
    return 'Invalid input';
  } else if (value >= 95) {
    return 'Normal';
  } else if (value >= 92) {
    return 'Hypoxic - Stage 1';
  } else if (value >= 80) {
    return 'Hypoxic - Stage 2';
  } else if (value >= 65) {
    return 'Hypoxic - Stage 3';
  } else {
    return 'Invalid input';
  }
};

export const getBloodPressureStatus = (numerator, denominator) => {
  if (numerator >= 210 || denominator >= 120) {
    return 'Hypertension - Stage 4';
  } else if (numerator >= 180 || denominator >= 110) {
    return 'Hypertension - Stage 3';
  } else if (numerator >= 160 || denominator >= 100) {
    return 'Hypertension - Stage 2';
  } else if (numerator >= 140 || denominator >= 90) {
    return 'Hypertension - Stage 1';
  } else if (numerator >= 130 || denominator >= 85) {
    return 'Pre-Hypertension';
  } else if (numerator >= 121 || denominator >= 81) {
    return 'Normal';
  } else if (numerator >= 100 || denominator >= 65) {
    return 'Ideal';
  } else if (numerator >= 90 || denominator >= 60) {
    return 'Low';
  } else if (numerator >= 70 || denominator >= 40) {
    return 'Moderate Hypotension';
  } else if (numerator >= 50 || denominator >= 35) {
    return 'Severe Hypotension';
  } else {
    return 'Extremely Severe Hypotension';
  }
};

export const getPulseRateStatus = (pulseRate, age) => {
  if (age >= 12) {
    if (pulseRate > 60 && pulseRate < 100) {
      return 'Normal';
    } else if (pulseRate > 0.6 * (220 - age) && pulseRate < 0.85 * (220 - age)) {
      return 'Normal';
    } else {
      return 'Abnormal';
    }
  } else if (age >= 6) {
    if (pulseRate > 70 && pulseRate < 120) {
      return 'Normal';
    } else if (pulseRate > 0.6 * (220 - age) && pulseRate < 0.85 * (220 - age)) {
      return 'Normal';
    } else {
      return 'Abnormal';
    }
  } else if (age >= 3) {
    if (pulseRate > 80 && pulseRate < 140) {
      return 'Normal';
    } else if (pulseRate > 0.6 * (220 - age) && pulseRate < 0.85 * (220 - age)) {
      return 'Normal';
    } else {
      return 'Abnormal';
    }
  } else if (age >= 1) {
    if (pulseRate > 90 && pulseRate < 150) {
      return 'Normal';
    } else if (pulseRate > 0.6 * (220 - age) && pulseRate < 0.85 * (220 - age)) {
      return 'Normal';
    } else {
      return 'Abnormal';
    }
  } else {
    if (pulseRate > 100 && pulseRate < 160) {
      return 'Normal';
    } else if (pulseRate > 0.6 * (220 - age) && pulseRate < 0.85 * (220 - age)) {
      return 'Normal';
    } else {
      return 'Abnormal';
    }
  }
};

export const getRespiratoryRateStatus = (respiratoryRate, age) => {
  if (age >= 12) {
    if (respiratoryRate > 12 && respiratoryRate < 20) {
      return 'Normal';
    } else if (respiratoryRate >= 27) {
      return 'Risk';
    } else {
      return 'Abnormal';
    }
  } else if (age >= 5) {
    if (respiratoryRate > 18 && respiratoryRate > 25) {
      return 'Normal';
    } else {
      return 'Abnormal';
    }
  } else if (age >= 3) {
    if (respiratoryRate > 20 && respiratoryRate > 28) {
      return 'Normal';
    } else {
      return 'Abnormal';
    }
  } else if (age >= 1) {
    if (respiratoryRate > 22 && respiratoryRate > 37) {
      return 'Normal';
    } else {
      return 'Abnormal';
    }
  } else {
    if (respiratoryRate > 30 && respiratoryRate > 53) {
      return 'Normal';
    } else {
      return 'Abnormal';
    }
  }
};
