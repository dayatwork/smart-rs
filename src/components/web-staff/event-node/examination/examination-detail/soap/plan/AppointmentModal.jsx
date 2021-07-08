import React, { useContext, useState } from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Select,
  useToast,
  SimpleGrid,
  Box,
  Center,
  Spinner,
  Text,
  Flex,
  HStack,
  Switch,
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useQuery, useQueryClient } from 'react-query';
import format from 'date-fns/format';
import { Helmet } from 'react-helmet-async';

import { AuthContext } from '../../../../../../../contexts/authContext';
import {
  getServices,
  getScheduleEstimatedTimes,
  getBookingSchedulesInstitution,
} from '../../../../../../../api/institution-services/service';
import { createOnsiteBooking } from '../../../../../../../api/booking-services/booking';
import { createOrder } from '../../../../../../../api/payment-services/order';
import { getServicePriceDetails } from '../../../../../../../api/finance-services/service-price';
import { getPaymentMethods } from '../../../../../../../api/institution-services/payment-method';

export const AppointmentModal = ({ isOpen, onClose, dataSoap }) => {
  // console.log({ dataSoap });
  const { employeeDetail } = useContext(AuthContext);
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [selectedService, setSelectedService] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDayRange, setSelectedDayRange] = useState({
    from: undefined,
    to: undefined,
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isLoadingBooking, setIsLoadingBooking] = useState(false);
  const [onlyMe, setIsOnlyMe] = useState(false);
  const queryClient = useQueryClient();

  // ==========================
  // ======= Calendar =========
  // ==========================
  const startDate =
    selectedDayRange.from && format(selectedDayRange.from, 'yyyy-MM-dd');
  const endDate =
    selectedDayRange.to && format(selectedDayRange.to, 'yyyy-MM-dd');
  // ==========================
  // ===== End Calendar =======
  // ==========================

  const { data: dataServicePrice, isSuccess: isSuccessServicePrice } = useQuery(
    ['service-price', selectedService, dataSoap?.institution_id],
    () =>
      getServicePriceDetails(
        cookies,
        dataSoap?.institution_id,
        selectedService
      ),
    {
      enabled: Boolean(selectedService) && Boolean(dataSoap?.institution_id),
    }
  );

  const { data: dataPaymentMethods } = useQuery(
    ['institution-payment-methods', dataSoap?.institution_id],
    () => getPaymentMethods(cookies, dataSoap?.institution_id),
    {
      enabled: Boolean(dataSoap?.institution_id),
    }
  );

  const { data: dataServices } = useQuery(
    ['services', dataSoap?.institution_id],
    () => getServices(cookies, dataSoap?.institution_id),
    { enabled: Boolean(dataSoap?.institution_id) }
  );

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
        institutionId: dataSoap?.institution_id,
      },
    ],
    () =>
      getBookingSchedulesInstitution(cookies, {
        first_date: startDate,
        last_date: endDate,
        serviceId: selectedService,
        institutionId: dataSoap?.institution_id,
      }),
    {
      enabled:
        Boolean(selectedService) &&
        Boolean(startDate) &&
        Boolean(endDate) &&
        Boolean(dataSoap?.institution_id),
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

  const handleSubmit = async e => {
    e.preventDefault();
    const { patient_id, institution_id } = dataSoap;
    if (!selectedPaymentMethod) return;
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

    // console.log({ data });

    try {
      setIsLoadingBooking(true);
      const res = await createOnsiteBooking(cookies, data);
      // console.log({ res });
      const orderData = {
        booking_order_id: res?.data?.booking_order?.id,
        type: '02',
        address_id: null,
        event_node: 'Booking',
        estimate_time_id: selectedTime?.id,
        method_id: paymentMethod?.id,
        institution_id,
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
        institution_id,
      ]);
      setIsLoadingBooking(false);
      setSelectedService('');
      setSelectedSchedule('');
      setSelectedDayRange({
        from: undefined,
        to: undefined,
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
      onClose();
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

  return (
    <>
      <Helmet>
        <style>{customStyle}</style>
      </Helmet>
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Appointment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid columns={2} gap="6">
              <Box>
                <FormControl id="lab-service" mb="4">
                  <FormLabel>Pilih Layanan</FormLabel>
                  <Select
                    bg="white"
                    value={selectedService}
                    onChange={e => {
                      setSelectedSchedule('');
                      setSelectedService(e.target.value);
                    }}
                  >
                    <option>Pilih Layanan</option>
                    {dataServices?.data?.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                    {/* {dataServices?.data
                      ?.filter(
                        service => service.master_service_id === MASTER_LAB
                      )
                      ?.map(service => (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      ))} */}
                  </Select>
                </FormControl>

                {selectedService && (
                  <FormControl mb="4">
                    <FormLabel>Jadwal</FormLabel>
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
                        selectedDayRange={selectedDayRange}
                        setSelectedDayRange={setSelectedDayRange}
                        setSelectedSchedule={setSelectedSchedule}
                      />
                    </Box>
                  </FormControl>
                )}
              </Box>
              <Box>
                {isLoadingSchedules && (
                  <Center py="6">
                    <Spinner />
                  </Center>
                )}
                {isSuccessSchedule && dataSchedules.code === 404 && (
                  <Center py="6">
                    <Box>Schedule not found</Box>
                  </Center>
                )}
                {dataSchedules && dataSchedules.code !== 404 && (
                  <FormControl mb="4">
                    <Flex justify="space-between" align="center">
                      <FormLabel>Schedule</FormLabel>
                      <HStack mb="1">
                        <Text
                          fontWeight="semibold"
                          fontSize={{ base: 'sm', md: 'md' }}
                          mt={{ base: '-1.5', md: '0' }}
                          // color="gray.500"
                        >
                          Only mine
                        </Text>
                        <Switch
                          colorScheme="purple"
                          isChecked={onlyMe}
                          onChange={e => setIsOnlyMe(e.target.checked)}
                        />
                      </HStack>
                    </Flex>
                    {/* <Select
                      value={selectedSchedule}
                      onChange={e => setSelectedSchedule(e.target.value)}
                    >
                      <option>Select Schedule</option>
                      {dataSchedules?.data?.map(schedule => {
                        return (
                          <option
                            key={schedule.id}
                            value={JSON.stringify({
                              id: schedule?.schedule_id,
                              detailId: schedule?.id,
                              date: schedule?.date,
                              employee_id: schedule?.employee?.id,
                              employee_name: schedule?.employee?.name,
                            })}
                          >
                            Dokter: {schedule?.employee?.name} --- Tanggal:{' '}
                            {schedule.date} --- Pukul: {schedule.start_time}-
                            {schedule.end_time}
                          </option>
                        );
                      })}
                    </Select> */}
                    <Box
                      maxH="96"
                      overflow="auto"
                      border="1px"
                      borderColor="gray.200"
                      px="4"
                      py="4"
                      rounded="md"
                      bgColor="white"
                    >
                      {dataSchedules?.data
                        ?.filter(schedule => {
                          if (onlyMe) {
                            return (
                              schedule?.employee?.id ===
                              employeeDetail?.employee_id
                            );
                          }
                          return schedule;
                        })
                        ?.map(schedule => {
                          return (
                            <Box
                              mb="2"
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
                                  : 'purple.50'
                              }
                              boxShadow="md"
                              px="4"
                              py="1"
                              rounded="md"
                              border="2px"
                              borderColor={
                                selectedSchedule?.id === schedule.id
                                  ? 'purple.500'
                                  : 'transparent'
                              }
                            >
                              <Flex justify="space-between">
                                <Box>
                                  <Text
                                    fontSize="md"
                                    color="purple.500"
                                    fontWeight="bold"
                                  >
                                    {schedule?.institution?.name}
                                  </Text>
                                  <Text fontSize="md" fontWeight="bold">
                                    {schedule?.employee?.name}
                                  </Text>
                                </Box>
                                <Box>
                                  <Text fontWeight="semibold" color="gray.700">
                                    {schedule?.days}, {schedule?.date_name}
                                  </Text>
                                  <Text fontWeight="semibold" color="gray.700">
                                    {schedule?.start_time} -{' '}
                                    {schedule?.end_time}
                                  </Text>
                                </Box>
                              </Flex>
                            </Box>
                          );
                        })}
                    </Box>
                  </FormControl>
                )}
                {isLoadingEstimatedTime && (
                  <Center py="6">
                    <Spinner />
                  </Center>
                )}
                {isSuccessEstimatedTime && selectedSchedule && (
                  <FormControl mb="4">
                    <FormLabel>Time</FormLabel>
                    <SimpleGrid
                      columns={4}
                      gap="4"
                      border="1px"
                      borderColor="gray.200"
                      px="4"
                      py="4"
                      rounded="md"
                    >
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
                    {/* <RadioGroup onChange={setSelectedTime} value={selectedTime}>
                      <SimpleGrid
                        columns={4}
                        gap="4"
                        border="1px"
                        borderColor="gray.200"
                        px="4"
                        py="2"
                        rounded="md"
                        bgColor="white"
                      >
                        {dataEstimatedTimes &&
                          dataEstimatedTimes?.data?.map(time => (
                            <Radio
                              id={time.id}
                              disabled={time.status}
                              value={JSON.stringify({
                                id: time.id,
                                value: time.available_time,
                              })}
                              key={time.id}
                              colorScheme="purple"
                            >
                              <Text color={time.status ? 'red' : 'green'}>
                                {time.available_time}
                              </Text>
                            </Radio>
                          ))}
                      </SimpleGrid>
                    </RadioGroup> */}
                  </FormControl>
                )}
                {isSuccessServicePrice && selectedSchedule && selectedTime && (
                  <FormControl mb="2">
                    <FormLabel mb="-1">Price</FormLabel>
                    <Box fontSize="2xl" fontWeight="extrabold" as="span">
                      {formatter.format(
                        Number(dataServicePrice?.data?.total_price)
                      )}
                    </Box>
                  </FormControl>
                )}
                {selectedSchedule && selectedTime && (
                  <FormControl id="payment_method" my="4">
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
              </Box>
            </SimpleGrid>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              colorScheme="purple"
              onClick={handleSubmit}
              isLoading={isLoadingBooking}
              disabled={!selectedTime || !selectedPaymentMethod}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const ScheduleDate = ({
  range,
  selectedDayRange,
  setSelectedDayRange,
  setSelectedSchedule,
}) => {
  const handleDayClick = (day, modifiers = {}) => {
    setSelectedSchedule('');
    if (modifiers.disabled) {
      return;
    }
    const selectedRange = DateUtils.addDayToRange(day, selectedDayRange);
    setSelectedDayRange(selectedRange);
  };

  const handleResetClick = () => {
    setSelectedDayRange({ from: undefined, to: undefined });
  };

  return (
    <Center flexDir="column" className="RangeExample">
      <DayPicker
        className="Selectable"
        numberOfMonths={1}
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
            minW="56"
            // w="full"
            display="block"
            colorScheme="purple"
            size="sm"
            onClick={handleResetClick}
          >
            Reset
          </Button>
        )}
      </Flex>
    </Center>
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
