import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Flex, Heading, HStack, Text } from '@chakra-ui/react';

import {
  WebPatientNav,
  Wrapper,
  Step,
} from '../../components/web-patient/shared';
import {
  ChoosePatient,
  PatientData,
  SelectDoctor,
  PaymentBooking,
} from '../../components/web-patient/booking-doctor';

const bookingStep = [
  {
    value: 'Step 1',
    text: 'Pilih Dokter',
    description: 'Pilih dokter dan tentukan jadwal pemeriksaan Anda',
  },
  {
    value: 'Step 2',
    text: 'Pilih Pasien',
    description: 'Pilih Pasien yang ingin Anda daftarkan',
  },
  {
    value: 'Step 3',
    text: 'Isi Data Pasien',
    description: 'Data ini akan digunakan untuk keperluan pemeriksaan',
  },
  {
    value: 'Step 4',
    text: 'Pembayaran',
    description: 'Cek kembali detail booking dan lakukan pembayaran',
  },
];

const BookingDoctorPage = () => {
  const { state } = useLocation();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = bookingStep[currentStepIndex];

  const [patient, setPatient] = useState('me');
  const [patientData, setPatientData] = useState({});
  const [selectedService, setSelectedService] = useState(
    state.selectedService || ''
  );
  const [selectedInstitution, setSelectedInstitution] = useState(
    state.selectedInstitution || ''
  );
  const [selectedSchedule, setSelectedSchedule] = useState({});
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDayRange, setSelectedDayRange] = useState({
    // from: '',
    // to: '',
    from: state.selectedDay ? state.selectedDay : undefined,
    to: state.selectedDay ? state.selectedDay : undefined,
  });

  const [selectedPagination, setSelectedPagination] = useState({});
  // const [selectedResponsible, setSelectedResponsible] = useState('');
  const [responsibleDefaultValue, setResponsibleDefaultValue] = useState({
    fullname: '',
    email: '',
    phone_number: '',
    identity_number: '',
    gender: '',
    marital_status: '',
    address: '',
    birth_date: new Date(),
  });
  const [otherPatientId, setOtherPatientId] = useState('');

  return (
    <Flex
      direction="column"
      bg="secondary.lighter"
      minH="100vh"
      position="relative"
      maxW="100vw"
      overflow="hidden"
    >
      <WebPatientNav active="dokter" />
      <Box bg="white" boxShadow="sm">
        <Box pt="6" pb="3" maxW="7xl" mx="auto">
          <Flex
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            align="center"
            px="4"
          >
            <Heading fontSize="2xl" mb={{ base: '4', md: '0' }}>
              Booking Dokter
            </Heading>
            {/* Booking Step */}
            <Box w={{ base: 'sm', md: 'lg' }}>
              <nav aria-label="Progress steps">
                <HStack as="ol" listStyleType="none" spacing="2">
                  {bookingStep.map(step => (
                    <Step
                      key={step.value}
                      isCurrent={step.value === currentStep.value}
                    >
                      {step.text}
                    </Step>
                  ))}
                </HStack>
              </nav>
            </Box>
          </Flex>
          <Text
            color="red.500"
            fontWeight="semibold"
            textAlign={{ base: 'center', md: 'right' }}
            mt="2"
            mr="4"
            fontSize={{ base: 'sm', md: 'md' }}
          >
            {currentStep.description}
          </Text>
        </Box>
      </Box>
      <Wrapper>
        {/* Content */}
        <Box as="section" pt="0">
          <Box
            maxW={{ base: 'xl', md: '7xl' }}
            mx="auto"
            // px={{ base: '2', md: '0' }}
          >
            {/* Header */}
            {/* <Box textAlign="center" mb="10">
              <Badge px="3" py="1" variant="solid" colorScheme="blue">
                {currentStep.value}
              </Badge>
              <Heading size="lg" fontWeight="extrabold" mt="3" mb="2">
                {currentStep.text}
              </Heading>
              <Text maxW="md" mx="auto">
                {currentStep.description}
              </Text>
            </Box> */}

            {/* Body */}
            {currentStep.value === 'Step 1' && (
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
                selectedInstitution={selectedInstitution}
                setSelectedInstitution={setSelectedInstitution}
              />
            )}
            {currentStep.value === 'Step 2' && (
              <ChoosePatient
                patient={patient}
                setPatient={setPatient}
                setPatientData={setPatientData}
                currentStep={currentStep}
                currentStepIndex={currentStepIndex}
                setCurrentStepIndex={setCurrentStepIndex}
                setSelectedService={setSelectedService}
                setSelectedDayRange={setSelectedDayRange}
                setSelectedSchedule={setSelectedSchedule}
              />
            )}
            {currentStep.value === 'Step 3' && (
              <PatientData
                patient={patient}
                patientData={patientData}
                setPatientData={setPatientData}
                currentStep={currentStep}
                currentStepIndex={currentStepIndex}
                setCurrentStepIndex={setCurrentStepIndex}
                // selectedResponsible={selectedResponsible}
                // setSelectedResponsible={setSelectedResponsible}
                responsibleDefaultValue={responsibleDefaultValue}
                setResponsibleDefaultValue={setResponsibleDefaultValue}
                otherPatientId={otherPatientId}
                setOtherPatientId={setOtherPatientId}
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
                selectedService={selectedService}
                otherPatientId={otherPatientId}
              />
            )}
          </Box>
        </Box>
      </Wrapper>
    </Flex>
  );
};

export default BookingDoctorPage;
