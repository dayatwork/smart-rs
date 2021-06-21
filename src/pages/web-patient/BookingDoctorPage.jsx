import React, { useState } from 'react';
import { Badge, Box, Flex, Heading, HStack, Text } from '@chakra-ui/react';

import { WebPatientNav, Wrapper, Step } from '../../components/web-patient/shared';
import {
  ChoosePatient,
  PatientData,
  SelectDoctor,
  PaymentBooking,
} from '../../components/web-patient/booking-doctor';

const bookingStep = [
  {
    value: 'Step 1',
    text: 'Pilih Pasien',
    description: 'Pilih Pasien yang ingin anda daftarkan',
  },
  {
    value: 'Step 2',
    text: 'Isi Data Pasien',
    description: 'Data ini akan digunakan untuk keperluan pemeriksaan',
  },
  {
    value: 'Step 3',
    text: 'Pilih Dokter',
    description: 'Pilih dokter dan tentukan jadwal pemeriksaan anda',
  },
  {
    value: 'Step 4',
    text: 'Pembayaran',
    description: 'Cek kembali detail booking dan lakukan pembayaran',
  },
];

export const BookingDoctorPage = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = bookingStep[currentStepIndex];

  const [patient, setPatient] = useState('me');
  const [patientData, setPatientData] = useState({});
  const [selectedService, setSelectedService] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState({});
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDayRange, setSelectedDayRange] = useState({
    // from: '',
    // to: '',
    from: undefined,
    to: undefined,
  });
  const [selectedPagination, setSelectedPagination] = useState({});

  return (
    <Flex direction="column" bg="gray.100" minH="100vh">
      <WebPatientNav active="dokter" />
      <Wrapper>
        <Heading fontSize="2xl">Booking Dokter</Heading>
        {/* Booking Step */}
        <Box py="4" maxW="2xl" mx="auto">
          <nav aria-label="Progress steps">
            <HStack as="ol" listStyleType="none" spacing="0">
              {bookingStep.map((step) => (
                <Step key={step.value} isCurrent={step.value === currentStep.value}>
                  {step.text}
                </Step>
              ))}
            </HStack>
          </nav>
        </Box>

        {/* Content */}
        <Box as="section" pt="4">
          <Box maxW={{ base: 'xl', md: '7xl' }} mx="auto" px={{ base: '6', md: '0' }}>
            {/* Header */}
            <Box textAlign="center" mb="10">
              <Badge px="3" py="1" variant="solid" colorScheme="blue">
                {currentStep.value}
              </Badge>
              <Heading size="lg" fontWeight="extrabold" mt="6" mb="2">
                {currentStep.text}
              </Heading>
              <Text maxW="md" mx="auto">
                {currentStep.description}
              </Text>
            </Box>

            {/* Body */}
            {currentStep.value === 'Step 1' && (
              <ChoosePatient
                patient={patient}
                setPatient={setPatient}
                setPatientData={setPatientData}
                currentStep={currentStep}
                currentStepIndex={currentStepIndex}
                setCurrentStepIndex={setCurrentStepIndex}
                setSelectedService={setSelectedService}
                setSelectedDayRange={setSelectedDayRange}
              />
            )}
            {currentStep.value === 'Step 2' && (
              <PatientData
                patient={patient}
                patientData={patientData}
                setPatientData={setPatientData}
                currentStep={currentStep}
                currentStepIndex={currentStepIndex}
                setCurrentStepIndex={setCurrentStepIndex}
              />
            )}
            {currentStep.value === 'Step 3' && (
              <SelectDoctor
                patient={patient}
                selectedService={selectedService}
                setSelectedService={setSelectedService}
                currentStep={currentStep}
                currentStepIndex={currentStepIndex}
                setCurrentStepIndex={setCurrentStepIndex}
                selectedSchedule={selectedSchedule}
                setSelectedSchedule={setSelectedSchedule}
                selectedDayRange={selectedDayRange}
                setSelectedDayRange={setSelectedDayRange}
                selectedTime={selectedTime}
                setSelectedTime={setSelectedTime}
                selectedPagination={selectedPagination}
                setSelectedPagination={setSelectedPagination}
              />
            )}
            {currentStep.value === 'Step 4' && (
              <PaymentBooking
                patient={patient}
                patientData={patientData}
                currentStep={currentStep}
                currentStepIndex={currentStepIndex}
                setCurrentStepIndex={setCurrentStepIndex}
                selectedSchedule={selectedSchedule}
                selectedTime={selectedTime}
              />
            )}
          </Box>
        </Box>
      </Wrapper>
    </Flex>
  );
};
