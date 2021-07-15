import React, { useState, useContext } from 'react';
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
  Text,
  Heading,
  HStack,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useQuery, useQueryClient } from 'react-query';
import format from 'date-fns/format';
import { Helmet } from 'react-helmet-async';

import { AuthContext } from '../../../../../contexts/authContext';
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
import { getServicePriceDetails } from '../../../../../api/finance-services/service-price';
import { getPaymentMethods } from '../../../../../api/institution-services/payment-method';
import { createOrder } from '../../../../../api/payment-services/order';
import { BackButton } from '../../../../../components/shared/BackButton';
import { PrivateComponent, Permissions } from '../../../../../access-control';

export const CreateBooking = () => {
  const { employeeDetail, user } = useContext(AuthContext);
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
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isLoadingBooking, setIsLoadingBooking] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState(
    employeeDetail?.institution_id || ''
  );
  const [limit, setLimit] = useState(6);
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const bookingColumns = useBreakpointValue({
    base: 1,
    '2xl': 2,
  });

  const startDate =
    selectedDayRange.from && format(selectedDayRange.from, 'yyyy-MM-dd');
  const endDate =
    selectedDayRange.to && format(selectedDayRange.to, 'yyyy-MM-dd');

  const { data: resInstitution, isSuccess: isSuccessInstitution } = useQuery(
    'institutions',
    () => getInstitutions(cookies),
    { staleTime: Infinity }
  );

  const { data: dataServices } = useQuery(
    ['services', selectedInstitution],
    () => getServices(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution) }
  );

  const { data: dataHospitalPatients, isLoading: isLoadingHospitalPatients } =
    useQuery(
      ['hospital-patients', selectedInstitution],
      () => getHospitalPatients(cookies, selectedInstitution),
      { enabled: Boolean(selectedInstitution) }
    );

  const { data: dataPaymentMethods } = useQuery(
    ['institution-payment-methods', selectedInstitution],
    () => getPaymentMethods(cookies, selectedInstitution),
    {
      enabled: Boolean(selectedInstitution),
    }
  );

  const searchPatient = async patientId => {
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

  const handleSubmit = async e => {
    e.preventDefault();
    if (!selectedPaymentMethod) return;
    const patient_id = foundPatient.patient_id;
    const service_id = selectedService;
    const schedule_id = selectedSchedule?.schedule_id;
    const schedule_detail_id = selectedSchedule?.id;
    const estimate_time_id = selectedTime?.id;
    const data = {
      patient_id,
      service_id,
      schedule_id,
      schedule_detail_id,
      estimate_time_id,
    };
    const paymentMethod = JSON.parse(selectedPaymentMethod);

    try {
      setIsLoadingBooking(true);
      const res = await createOnsiteBooking(cookies, data);
      // console.log({ res });
      const orderData = {
        patient_id,
        booking_order_id: res?.data?.booking_order?.id,
        type: '02',
        address_id: null,
        event_node: 'Booking',
        estimate_time_id: selectedTime?.id,
        method_id: paymentMethod?.id,
        institution_id: selectedInstitution,
        method_name: paymentMethod?.name,
        transaction_number: res?.data?.transaction_number,
        transfer_to: paymentMethod?.account_number,
        tax: dataServicePrice?.data?.tax,
        discount: null,
        items: [
          {
            product_id: dataServicePrice?.data?.service_id,
            price: dataServicePrice?.data?.total_price,
            quantity: 1,
            description: null,
          },
        ],
      };
      // console.log({ orderData });
      await createOrder(cookies)(orderData);
      // console.log({ resOrder });
      await queryClient.invalidateQueries('booking-list');
      await queryClient.invalidateQueries([
        'institution-order-list',
        selectedInstitution,
      ]);
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
        position: 'top-right',
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
        position: 'top-right',
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
    [
      'booking-schedule',
      {
        first_date: startDate,
        last_date: endDate,
        serviceId: selectedService,
        institutionId: selectedInstitution,
        limit,
        page,
      },
    ],
    () =>
      getBookingSchedulesInstitution(cookies, {
        first_date: startDate,
        last_date: endDate,
        serviceId: selectedService,
        institutionId: selectedInstitution,
        limit,
        page,
      }),
    {
      enabled:
        Boolean(selectedService) &&
        Boolean(startDate) &&
        Boolean(endDate) &&
        Boolean(selectedInstitution) &&
        Boolean(limit) &&
        Boolean(page),
    }
  );

  const {
    data: dataEstimatedTimes,
    isLoading: isLoadingEstimatedTime,
    isSuccess: isSuccessEstimatedTime,
  } = useQuery(
    ['estimated-times', selectedSchedule?.id],
    () => getScheduleEstimatedTimes(cookies, selectedSchedule?.id),
    { enabled: Boolean(selectedSchedule?.id) }
  );

  const { data: dataServicePrice, isSuccess: isSuccessServicePrice } = useQuery(
    ['service-price', selectedService, selectedInstitution],
    () => getServicePriceDetails(cookies, selectedInstitution, selectedService),
    {
      enabled: Boolean(selectedService) && Boolean(selectedInstitution),
    }
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
    <Box pb={{ base: '16', '2xl': '10' }}>
      <Helmet>
        <style>{customStyle}</style>
      </Helmet>
      <BackButton to="/events/booking" text="Back to Booking List" />
      <Heading mb="6" fontSize="3xl">
        Create New Booking
      </Heading>
      {user?.role?.alias === 'super-admin' && (
        <FormControl id="name" mb="4" maxW="xs">
          <FormLabel>Institution</FormLabel>
          <Select
            bg="white"
            name="institution"
            value={selectedInstitution}
            onChange={e => setSelectedInstitution(e.target.value)}
          >
            <option value="">Select Institution</option>
            {isSuccessInstitution &&
              resInstitution?.data?.map(institution => (
                <option key={institution.id} value={institution.id}>
                  {institution.name}
                </option>
              ))}
          </Select>
        </FormControl>
      )}
      {selectedInstitution && (
        <Box as="form" onSubmit={handleSubmit}>
          <SimpleGrid
            columns={bookingColumns}
            gap="8"
            maxW={{ base: '2xl', '2xl': 'full' }}
          >
            <VStack spacing="6">
              <FormControl id="patient_id">
                <FormLabel>Select Patient</FormLabel>
                <Select
                  bg="white"
                  onChange={e => {
                    searchPatient(e.target.value);
                  }}
                  mb="6"
                  disabled={isLoadingHospitalPatients}
                >
                  <option value="">Select Patient</option>
                  {dataHospitalPatients?.data?.map(patient => (
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
                    <Box
                      bg="white"
                      p="4"
                      border="1px"
                      borderColor="gray.200"
                      rounded="md"
                    >
                      <Description
                        title="Patient ID"
                        value={foundPatient.patient_id}
                      />
                      <Description
                        title="Patient Number"
                        value={foundPatient.patient_number}
                      />
                      <Description
                        title="Name"
                        value={foundPatient.patient.name}
                      />
                      <Description
                        title="Email"
                        value={foundPatient.patient.email}
                      />
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
                    onChange={e => {
                      setSelectedSchedule('');
                      setSelectedService(e.target.value);
                    }}
                  >
                    <option value="">Pilih Layanan</option>
                    {dataServices?.data?.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              )}
              {selectedService && (
                <FormControl mb="6" maxW="xl" alignSelf="baseline">
                  <FormLabel>Schedule Day Range</FormLabel>
                  <Box
                    border="1px"
                    borderColor="gray.200"
                    px="4"
                    py="2"
                    rounded="md"
                    bgColor="white"
                  >
                    <ScheduleDate
                      range={selectedDayRange}
                      handleDayClick={handleDayClick}
                      handleResetClick={handleResetClick}
                    />
                  </Box>
                </FormControl>
              )}{' '}
            </VStack>
            <Box>
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
                <>
                  <Flex justify="space-between" align="center" mt="-1" mb="1">
                    <Heading fontWeight="semibold" fontSize="md" mb="2">
                      Jadwal dokter yang tersedia
                    </Heading>
                    <HStack spacing="5">
                      <FormControl display="flex">
                        <FormLabel>Limit</FormLabel>
                        <Select
                          bg="white"
                          size="sm"
                          rounded="sm"
                          mt="-1"
                          w="20"
                          value={limit}
                          onChange={e => setLimit(e.target.value)}
                        >
                          <option value={6}>6</option>
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                          <option value={50}>50</option>
                        </Select>
                      </FormControl>
                      <FormControl display="flex">
                        <FormLabel>Page</FormLabel>
                        <Select
                          bg="white"
                          size="sm"
                          rounded="sm"
                          mt="-1"
                          w="20"
                          value={page}
                          onChange={e => setPage(e.target.value)}
                        >
                          {[
                            ...Array(
                              Math.ceil(dataSchedules?.total_data / limit)
                            ).keys(),
                          ]?.map(v => (
                            <option key={v + 1} value={v + 1}>
                              {v + 1}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                    </HStack>
                  </Flex>
                  <SimpleGrid columns={2} gap="4" w="full" mb="6">
                    {dataSchedules?.data?.map(schedule => {
                      return (
                        <Box
                          cursor="pointer"
                          onClick={() => {
                            setSelectedSchedule(schedule);
                            setSelectedTime('');
                            setSelectedPaymentMethod('');
                          }}
                          key={schedule.id}
                          bg={
                            selectedSchedule?.id === schedule.id
                              ? 'purple.100'
                              : 'white'
                          }
                          boxShadow="md"
                          px="6"
                          py="4"
                          rounded="md"
                          border="2px"
                          borderColor={
                            selectedSchedule?.id === schedule.id
                              ? 'purple.500'
                              : 'transparent'
                          }
                        >
                          <Box>
                            <Text
                              fontSize="md"
                              color="purple.500"
                              fontWeight="bold"
                            >
                              {schedule?.institution?.name}
                            </Text>
                            <Text fontSize="xl" fontWeight="bold">
                              {schedule?.employee?.name}
                            </Text>
                            <Text
                              mt="-1"
                              mb="1"
                              fontSize="sm"
                              fontWeight="semibold"
                              color="gray.500"
                            >
                              {schedule?.employee?.profession}
                            </Text>
                            <Text fontWeight="semibold" color="gray.700">
                              {schedule?.days}, {schedule?.date_name}
                            </Text>
                            <Text fontWeight="semibold" color="gray.700">
                              {schedule?.start_time} - {schedule?.end_time}
                            </Text>
                          </Box>
                        </Box>
                      );
                    })}
                  </SimpleGrid>
                </>
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

              {dataEstimatedTimes?.data?.length ? (
                <Box mb="6">
                  <Heading fontWeight="semibold" fontSize="md" mb="3">
                    Waktu yang tersedia
                  </Heading>
                  <SimpleGrid columns={4} gap="4">
                    {dataEstimatedTimes?.data?.map(time => {
                      return (
                        <Center
                          as="button"
                          disabled={time.status}
                          cursor={time.status ? 'not-allowed' : 'pointer'}
                          onClick={() => setSelectedTime(time)}
                          key={time.id}
                          bg={
                            time.status
                              ? 'red.100'
                              : selectedTime?.id === time.id
                              ? 'purple.100'
                              : 'green.100'
                          }
                          boxShadow="md"
                          rounded="md"
                          border="2px"
                          borderColor={
                            selectedTime?.id === time.id
                              ? 'purple.500'
                              : 'transparent'
                          }
                        >
                          {time.available_time}
                        </Center>
                      );
                    })}
                  </SimpleGrid>
                </Box>
              ) : (
                isSuccessEstimatedTime && (
                  <>
                    <Heading fontWeight="semibold" fontSize="lg" mb="3">
                      Waktu yang tersedia
                    </Heading>
                    <Box h="60">
                      <Text fontSize="lg" fontWeight="bold">
                        Not Available
                      </Text>
                    </Box>
                  </>
                )
              )}

              {isSuccessServicePrice && selectedTime && (
                <FormControl mb="6">
                  <FormLabel mb="-1">Price</FormLabel>
                  <Box fontSize="2xl" fontWeight="extrabold" as="span">
                    {formatter.format(
                      Number(dataServicePrice?.data?.total_price)
                    )}
                  </Box>
                </FormControl>
              )}

              {selectedTime && (
                <FormControl id="payment_method" my="6">
                  <FormLabel>Payment Method</FormLabel>
                  <Select
                    value={selectedPaymentMethod}
                    onChange={e => setSelectedPaymentMethod(e.target.value)}
                  >
                    <option value="">Pilih Metode Pembayaran</option>
                    {dataPaymentMethods?.data
                      ?.filter(paymentMethod => paymentMethod.active)
                      .map(paymentMethod => (
                        <option
                          key={paymentMethod.id}
                          value={JSON.stringify(paymentMethod)}
                        >
                          {paymentMethod.name}
                        </option>
                      ))}
                  </Select>
                </FormControl>
              )}
              {selectedTime && (
                <PrivateComponent permission={Permissions.createBookingDoctor}>
                  <Button
                    w="full"
                    colorScheme="purple"
                    type="submit"
                    disabled={
                      !selectedSchedule ||
                      !selectedTime ||
                      !selectedPaymentMethod
                    }
                    isLoading={isLoadingBooking}
                  >
                    Book
                  </Button>
                </PrivateComponent>
              )}
            </Box>
          </SimpleGrid>
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
        modifiers={{
          start: range.from,
          end: range.to,
          sunday: { daysOfWeek: [0] },
        }}
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
            onClick={handleResetClick}
          >
            Reset
          </Button>
        )}
      </Flex>
    </Box>
  );
};

const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
});

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
