import * as React from 'react';
import { Box, Button } from '@chakra-ui/react';
import { FaArrowLeft, FaArrowRight, FaUser, FaUsers } from 'react-icons/fa';

import { ButtonRadioGroup } from '../shared';

export const ChoosePatient = ({
  patient,
  setPatient,
  setPatientData,
  // currentStep,
  currentStepIndex,
  setCurrentStepIndex,
  setSelectedService,
  setSelectedDayRange,
}) => {
  return (
    <>
      <Box maxW="xl" mx="auto">
        <ButtonRadioGroup
          defaultValue={patient}
          setPatient={setPatient}
          setPatientData={setPatientData}
          setSelectedService={setSelectedService}
          setSelectedDayRange={setSelectedDayRange}
          options={[
            {
              label: 'Saya',
              description: 'Saya ingin mendaftarkan diri saya',
              icon: <FaUser />,
              value: 'me',
            },
            {
              label: 'Orang Lain',
              description: 'Saya ingin mendaftarkan orang lain',
              icon: <FaUsers />,
              value: 'others',
            },
          ]}
        />
      </Box>
      <Box mt="14" textAlign="right">
        <Button
          leftIcon={<FaArrowLeft />}
          disabled
          onClick={() => setCurrentStepIndex(currentStepIndex - 1)}>
          Back
        </Button>
        <Button
          rightIcon={<FaArrowRight />}
          colorScheme="blue"
          ml="2"
          disabled={!patient}
          onClick={() => setCurrentStepIndex(currentStepIndex + 1)}>
          Next
        </Button>
      </Box>
    </>
  );
};
