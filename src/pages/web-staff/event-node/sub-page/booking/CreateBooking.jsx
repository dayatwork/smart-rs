import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import DayPicker, { DateUtils } from 'react-day-picker';
import {
  Button,
  Box,
  FormControl,
  FormLabel,
  Select,
  VStack,
  Flex,
  Center,
  Spinner,
  useToast,
  SimpleGrid,
  RadioGroup,
  Radio,
  Text,
  Heading,
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useQuery, useQueryClient } from 'react-query';
import format from 'date-fns/format';
import { Helmet } from 'react-helmet-async';

import { getInstitutions } from '../../../../../api/institution-services/institution';
import {
  getServices,
  getScheduleEstimatedTimes,
} from '../../../../../api/institution-services/service';
import { createOnsiteBooking } from '../../../../../api/booking-services/booking';
import {
  getHospitalPatients,
  getHospitalPatientById,
} from '../../../../../api/patient-services/hospital-patient';
import { getBookingSchedulesInstitution } from '../../../../../api/institution-services/service';
import { BackButton } from '../../../../../components/shared/BackButton';

export const CreateBooking = () => {
  const history = useHistory();
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [hasSearch, setHasSearch] = useState(false);
  const [foundPatient, setFoundPatient] = useState(null);
  const [isLoadingSearchPatient, setIsLoadingSetPatient] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDayRange, setSelectedDayRange] = useState({
    from: undefined,
    to: undefined,
  });
  const [isLoadingBooking, setIsLoadingBooking] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState(
    '3f026d44-6b43-47ce-ba4b-4d0a8b174286',
  );
  const queryClient = useQueryClient();

  const startDate = selectedDayRange.from && format(selectedDayRange.from, 'yyyy-MM-dd');
  const endDate = selectedDayRange.to && format(selectedDayRange.to, 'yyyy-MM-dd');

  const { data: resInstitution, isSuccess: isSuccessInstitution } = useQuery(
    'institutions',
    () => getInstitutions(cookies),
    { staleTime: Infinity },
  );

  const { data: dataServices } = useQuery(
    ['services', selectedInstitution],
    () => getServices(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution) },
  );

  const { data: dataHospitalPatients } = useQuery(
    ['hospital-patients', selectedInstitution],
    () => getHospitalPatients(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution) },
  );

  const searchPatient = async (patientId) => {
    if (patientId && selectedInstitution) {
      try {
        setFoundPatient(null);
        setHasSearch(false);
        setSelectedSchedule('');
        setSelectedDayRange({
          from: '',
          to: '',
        });
        setIsLoadingSetPatient(true);
        const res = await getHospitalPatientById(cookies, {
          patient_id: patientId,
          institution_id: selectedInstitution,
        });
        setHasSearch(true);
        setIsLoadingSetPatient(false);
        if (res.code === 404) {
          setFoundPatient(null);
        }
        if (res?.data?.id) {
          setFoundPatient(res.data);
        }
      } catch (error) {
        setIsLoadingSetPatient(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const patient_id = foundPatient.patient_id;
    const service_id = selectedService;
    const schedule_id = JSON.parse(selectedSchedule).id;
    const schedule_detail_id = JSON.parse(selectedSchedule).detailId;
    const estimate_time_id = selectedTime;
    const data = {
      patient_id,
      service_id,
      schedule_id,
      schedule_detail_id,
      estimate_time_id,
    };
    try {
      setIsLoadingBooking(true);
      await createOnsiteBooking(cookies, data);
      await queryClient.invalidateQueries('booking-list');
      setIsLoadingBooking(false);
      setHasSearch(false);
      setFoundPatient(null);
      setSelectedService('');
      setSelectedSchedule('');
      setSelectedDayRange({
        from: '',
        to: '',
      });
      setSelectedTime('');
      toast({
        title: 'Success',
        description: `Booking Success`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      history.replace('/events/booking');
    } catch (error) {
      setIsLoadingBooking(false);
      toast({
        title: 'Error',
        description: `Booking Failed`,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const {
    data: dataSchedules,
    isLoading: isLoadingSchedules,
    isSuccess: isSuccessSchedule,
  } = useQuery(
    ['booking-schedule', { selectedService, startDate, endDate }],
    () =>
      getBookingSchedulesInstitution(cookies, {
        startDate,
        endDate,
        serviceId: selectedService,
        institutionId: selectedInstitution,
      }),
    {
      enabled: Boolean(selectedService) && Boolean(startDate) && Boolean(endDate),
    },
  );

  const {
    data: dataEstimatedTimes,
    isLoading: isLoadingEstimatedTime,
    isSuccess: isSuccessEstimatedTime,
  } = useQuery(
    ['estimated-times', JSON.parse(selectedSchedule || '{}')?.detailId],
    () =>
      getScheduleEstimatedTimes(cookies, JSON.parse(selectedSchedule || '{}')?.detailId),
    { enabled: Boolean(JSON.parse(selectedSchedule || '{}')?.detailId) },
  );

  const handleDayClick = (day, modifiers = {}) => {
    if (modifiers.disabled) {
      return;
    }
    const selectedRange = DateUtils.addDayToRange(day, selectedDayRange);
    setSelectedDayRange(selectedRange);
    setSelectedSchedule('');
    setSelectedTime('');
  };

  const handleResetClick = () => {
    setSelectedDayRange({ from: undefined, to: undefined });
    setSelectedSchedule('');
    setSelectedTime('');
  };

  return (
    <Box>
      <Helmet>
        <style>{customStyle}</style>
      </Helmet>
      <BackButton to="/events/booking" text="Back to Booking List" />
      <Heading mb="6" fontSize="3xl">
        Create New Booking
      </Heading>
      <FormControl id="name" mb="4" maxW="xs">
        <FormLabel>Institution</FormLabel>
        <Select
          bg="white"
          name="institution"
          value={selectedInstitution}
          onChange={(e) => setSelectedInstitution(e.target.value)}>
          <option value="">Select Institution</option>
          {isSuccessInstitution &&
            resInstitution?.data?.map((institution) => (
              <option key={institution.id} value={institution.id}>
                {institution.name}
              </option>
            ))}
        </Select>
      </FormControl>
      {selectedInstitution && (
        <Box as="form" onSubmit={handleSubmit} maxW="3xl">
          <VStack spacing="6">
            <FormControl id="patient_id">
              <FormLabel>Select Patient</FormLabel>
              <Select
                bg="white"
                onChange={(e) => {
                  searchPatient(e.target.value);
                }}
                mb="4">
                <option value="">Select Patient</option>
                {dataHospitalPatients?.data?.map((patient) => (
                  <option key={patient.id} value={patient?.patient_id}>
                    {patient?.patient?.name} - {patient?.patient_number}
                  </option>
                ))}
              </Select>
              <Box>
                {isLoadingSearchPatient && (
                  <Center py="6">
                    <Spinner
                      thickness="4px"
                      emptyColor="gray.200"
                      color="purple.500"
                      size="lg"
                    />
                  </Center>
                )}
                {foundPatient ? (
                  <Box bg="white" p="4" border="1px" borderColor="gray.200" rounded="md">
                    <Description title="Patient ID" value={foundPatient.patient_id} />
                    <Description
                      title="Patient Number"
                      value={foundPatient.patient_number}
                    />
                    <Description title="Name" value={foundPatient.patient.name} />
                    <Description title="Email" value={foundPatient.patient.email} />
                    <Description
                      title="Phone Number"
                      value={foundPatient.patient.phone_number}
                    />
                  </Box>
                ) : hasSearch && !foundPatient ? (
                  <Center py="6">
                    <Box>Patient not found</Box>
                  </Center>
                ) : null}
              </Box>
            </FormControl>

            {foundPatient && (
              <FormControl id="services">
                <FormLabel>Select Service</FormLabel>
                <Select
                  bg="white"
                  value={selectedService}
                  onChange={(e) => {
                    setSelectedSchedule('');
                    setSelectedService(e.target.value);
                  }}>
                  <option value="">Pilih Layanan</option>
                  {dataServices?.data?.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            )}

            {selectedService && (
              <FormControl mb="4" maxW="xl" alignSelf="baseline">
                <FormLabel>Schedule Day Range</FormLabel>
                <Box
                  border="1px"
                  borderColor="gray.200"
                  px="4"
                  py="2"
                  rounded="md"
                  bgColor="white">
                  <ScheduleDate
                    range={selectedDayRange}
                    handleDayClick={handleDayClick}
                    handleResetClick={handleResetClick}
                  />
                </Box>
              </FormControl>
            )}

            {isLoadingSchedules && (
              <Center py="6">
                <Spinner
                  thickness="4px"
                  emptyColor="gray.200"
                  color="purple.500"
                  size="lg"
                />
              </Center>
            )}

            {isSuccessSchedule && dataSchedules.code === 404 && (
              <Center py="6">
                <Box>Schedule not found</Box>
              </Center>
            )}

            {dataSchedules && dataSchedules.code !== 404 && (
              <FormControl>
                <FormLabel>Select Doctor</FormLabel>
                <Select
                  bg="white"
                  value={selectedSchedule}
                  onChange={(e) => {
                    setSelectedSchedule(e.target.value);
                    setSelectedTime('');
                  }}>
                  <option value="">Select Schedule</option>
                  {dataSchedules?.data?.map((schedule) => {
                    return (
                      <option
                        key={schedule.id}
                        value={JSON.stringify({
                          id: schedule?.schedule_id,
                          detailId: schedule.id,
                        })}>
                        Dokter: {schedule?.employee?.name} --- Tanggal: {schedule.date}{' '}
                        --- Pukul: {schedule.start_time}-{schedule.end_time}
                      </option>
                    );
                  })}
                </Select>
              </FormControl>
            )}

            {isLoadingEstimatedTime && (
              <Center py="6">
                <Spinner
                  thickness="4px"
                  emptyColor="gray.200"
                  color="purple.500"
                  size="lg"
                />
              </Center>
            )}

            {isSuccessEstimatedTime && selectedSchedule && (
              <FormControl>
                <FormLabel>Select Time</FormLabel>
                <RadioGroup
                  onChange={setSelectedTime}
                  value={selectedTime}
                  bg="white"
                  p="4"
                  border="1px"
                  borderColor="gray.200"
                  rounded="md">
                  <SimpleGrid columns={4} gap="6">
                    {dataEstimatedTimes &&
                      dataEstimatedTimes?.data?.map((time) => (
                        <Radio
                          id={time.id}
                          disabled={time.status}
                          value={time.id}
                          key={time.id}
                          colorScheme="purple">
                          <Text color={time.status ? 'red' : 'green'}>
                            {time.available_time}
                          </Text>
                          {/* {time.status && (
                              <Text fontSize="sm">Not Available</Text>
                            )} */}
                        </Radio>
                      ))}
                  </SimpleGrid>
                </RadioGroup>
              </FormControl>
            )}
          </VStack>

          {selectedTime && (
            <Button
              w="full"
              mt="6"
              colorScheme="purple"
              type="submit"
              disabled={!selectedSchedule || !selectedTime}
              isLoading={isLoadingBooking}>
              Book
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

const Description = ({ title, value }) => {
  return (
    <Flex as="dl" direction={{ base: 'column', sm: 'row' }}>
      <Box as="dt" flexBasis="25%">
        {title}
      </Box>
      <Box as="dd" flex="1" fontWeight="semibold">
        {value}
      </Box>
    </Flex>
  );
};

const ScheduleDate = ({ range, handleDayClick, handleResetClick }) => {
  return (
    <Box className="RangeExample">
      <DayPicker
        className="Selectable"
        numberOfMonths={2}
        selectedDays={[range.from, { from: range.from, to: range.to }]}
        modifiers={{ start: range.from, end: range.to, sunday: { daysOfWeek: [0] } }}
        onDayClick={handleDayClick}
        disabledDays={{ before: new Date() }}
      />
      <Flex>
        {range.from && range.to && (
          <Button
            mb="2"
            w="full"
            display="block"
            colorScheme="purple"
            variant="ghost"
            size="sm"
            onClick={handleResetClick}>
            Reset
          </Button>
        )}
      </Flex>
    </Box>
  );
};

const customStyle = `
  .Selectable
    .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {
    background-color: #f0f8ff !important;
    color: #805AD5 !important;
  }
  .Selectable .DayPicker-Day {
    border-radius: 0 !important;
  }
  .Selectable .DayPicker-Day.DayPicker-Day--today {
    background-color: #f0f8ff !important;
    color: #805AD5;
  }
  .Selectable .DayPicker-Day.DayPicker-Day--start {
    background-color: #805AD5 !important;
    color: #f0f8ff !important;
  }
  .Selectable .DayPicker-Day.DayPicker-Day--end {
    background-color: #805AD5 !important;
    color: #f0f8ff !important;
  }
  .Selectable .DayPicker-Day--start {
    border-top-left-radius: 50% !important;
    border-bottom-left-radius: 50% !important;
  }
  .Selectable .DayPicker-Day--end {
    border-top-right-radius: 50% !important;
    border-bottom-right-radius: 50% !important;
  }
  .DayPicker-Day--today {
    color: #9F7AEA !important;
    background-color: #ffffff !important;
  }
`;
