import * as React from 'react';
import { Box, Button, Flex, useBreakpointValue, Text } from '@chakra-ui/react';
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
  setSelectedSchedule,
}) => {
  const buttonSize = useBreakpointValue({ base: 'sm', md: 'md' });
  return (
    <>
      <Box maxW="xl" mx="auto" pb={{ base: '20', md: '28' }}>
        <Text fontSize="3xl" textAlign="center" mb="6" fontWeight="semibold">
          Booking for:
        </Text>
        <ButtonRadioGroup
          defaultValue={patient}
          setPatient={setPatient}
          setPatientData={setPatientData}
          setSelectedService={setSelectedService}
          setSelectedDayRange={setSelectedDayRange}
          setSelectedSchedule={setSelectedSchedule}
          options={[
            {
              label: 'Me',
              description: 'I want to register for myself',
              icon: <FaUser />,
              value: 'me',
            },
            {
              label: 'Others',
              description: 'I want to register for others',
              icon: <FaUsers />,
              value: 'others',
            },
          ]}
        />
      </Box>
      <Box
        h={{ base: '20', md: '28' }}
        bg="primary.500"
        position="absolute"
        bottom="0"
        left="0"
        w="full"
        zIndex="5"
      >
        <Flex
          h="full"
          maxW="7xl"
          mx="auto"
          justify={{ base: 'center', md: 'flex-end' }}
          align="center"
          px="4"
        >
          <Button
            leftIcon={<FaArrowLeft />}
            // disabled
            onClick={() => setCurrentStepIndex(currentStepIndex - 1)}
            size={buttonSize}
            bgColor="secondary.light"
            color="secondary.dark"
            _hover={{
              bgColor: 'secondary.dark',
              color: 'secondary.light',
            }}
          >
            Back
          </Button>
          <Button
            rightIcon={<FaArrowRight />}
            bgColor="secondary.light"
            color="secondary.dark"
            _hover={{
              bgColor: 'secondary.dark',
              color: 'secondary.light',
            }}
            ml="2"
            disabled={!patient}
            onClick={() => setCurrentStepIndex(currentStepIndex + 1)}
            size={buttonSize}
          >
            Next
          </Button>
        </Flex>
      </Box>
    </>
  );
};
