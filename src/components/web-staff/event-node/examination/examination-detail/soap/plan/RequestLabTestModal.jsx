import React, { useState } from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  SimpleGrid,
  ModalFooter,
  Input,
  Select,
  Text,
  Center,
  Spinner,
  useToast,
  Flex,
} from '@chakra-ui/react';
import 'react-day-picker/lib/style.css';
import { useQuery, useQueryClient } from 'react-query';
import { useCookies } from 'react-cookie';
import format from 'date-fns/format';
import { Helmet } from 'react-helmet-async';

import {
  getServices,
  getScheduleEstimatedTimes,
  getBookingSchedulesInstitution,
} from '../../../../../../../api/institution-services/service';
import { createOnsiteBooking } from '../../../../../../../api/booking-services/booking';
import { createOrder } from '../../../../../../../api/payment-services/order';
import { getServicePriceDetails } from '../../../../../../../api/finance-services/service-price';
import { getPaymentMethods } from '../../../../../../../api/institution-services/payment-method';
import { getLabCategories } from '../../../../../../../api/institution-services/lab-category';
import { createLaboratoryRegistration } from '../../../../../../../api/laboratory-services/register';

const MASTER_LAB = '9fde6ede-38b8-47f7-b080-baa50a1b587c';

export const RequestLabTestModal = ({ isOpen, onClose, dataSoap }) => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [selectedService, setSelectedService] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [location, setLocation] = useState('UGD');
  const [selectedDayRange, setSelectedDayRange] = useState({
    from: undefined,
    to: undefined,
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [description, setDescription] = useState('');
  const [isLoadingRequestLaboratory, setIsLoadingRequestLaboratory] =
    useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
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
  // console.log({ dataSoap });
  // console.log({ selectedService });
  // console.log({ selectedPaymentMethod });

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

  const { data: dataCategories } = useQuery(
    ['laboratory-categories', dataSoap?.institution_id],
    () => getLabCategories(cookies, dataSoap?.institution_id),
    {
      enabled: Boolean(dataSoap?.institution_id),
    }
  );

  // console.log({ selectedSchedule });
  // console.log({ selectedService });
  // console.log({ selectedTime });
  // console.log({ selectedPaymentMethod });

  const handleSubmit = async e => {
    e.preventDefault();
    const { id: soap_id, patient_id, institution_id } = dataSoap;
    const { category_id } = JSON.parse(selectedCategory);
    const paymentMethod = JSON.parse(selectedPaymentMethod);

    const dataBooking = {
      patient_id,
      service_id: selectedService,
      schedule_id: selectedSchedule?.schedule_id,
      schedule_detail_id: selectedSchedule?.id,
      estimate_time_id: selectedTime?.id,
    };
    // console.log({ dataBooking });

    // console.log({ dataRegisterLab });

    try {
      setIsLoadingRequestLaboratory(true);
      // Create Booking
      const res = await createOnsiteBooking(cookies, dataBooking);
      // console.log({ res });

      // Create Order
      const orderData = {
        booking_order_id: res?.data?.booking_order?.id,
        type: '02',
        address_id: null,
        event_node: 'Pemeriksaan di Laboratorium',
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

      // Create Registration Lab
      const dataRegisterLab = {
        institution_id,
        patient_id,
        soap_id,
        category_id,
        // subcategory_id,
        method: 'default',
        booking_id: res?.data?.booking_order?.booking_id,
        employee_id: selectedSchedule?.employee?.id,
        date: selectedSchedule?.date,
        time: selectedTime?.available_time,
        description,
        location,
      };
      await createLaboratoryRegistration(cookies)(dataRegisterLab);

      await queryClient.invalidateQueries('booking-list');
      await queryClient.invalidateQueries([
        'institution-order-list',
        institution_id,
      ]);
      await queryClient.invalidateQueries([
        'laboratory-list',
        dataRegisterLab.institution_id,
      ]);
      setIsLoadingRequestLaboratory(false);

      setSelectedService('');
      setSelectedSchedule('');
      setSelectedDayRange({
        from: undefined,
        to: undefined,
      });
      setSelectedTime('');
      setSelectedCategory('');
      // setSelectedSubcategory("");
      toast({
        position: 'top-right',
        title: 'Success',
        description: `Request laboratory success`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      setIsLoadingRequestLaboratory(false);

      toast({
        position: 'top-right',
        title: 'Error',
        description: `Request laboratory failed`,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  // console.log({
  //   dataSchedules,
  //   dataEstimatedTimes,
  //   dataServices,
  //   dataCategories,
  // });

  // console.log({ dataSoap });
  // console.log({ selectedService });
  // console.log({ dataCategories });

  const labCategories = dataCategories?.data?.map(
    category => `${category.category_id} ${category.category_name}`
  );
  const categories = [...new Set(labCategories)];
  // console.log({ categories });

  return (
    <>
      <Helmet>
        <style>{customStyle}</style>
      </Helmet>
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Request Lab Test</ModalHeader>
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
                    {/* {dataServices?.data?.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))} */}
                    {dataServices?.data
                      ?.filter(
                        service => service.master_service_id === MASTER_LAB
                      )
                      ?.map(service => (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      ))}
                  </Select>
                </FormControl>
                <FormControl id="location" mb="4">
                  <FormLabel>Location</FormLabel>
                  <Input
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                  />
                </FormControl>
                <FormControl id="laboratory-category" mb="4">
                  <FormLabel>Pilih Category</FormLabel>
                  <Select
                    bg="white"
                    value={selectedCategory}
                    onChange={e => {
                      setSelectedCategory(e.target.value);
                    }}
                  >
                    {/* <option>Pilih Category</option>
                {dataCategories?.data?.map(category => (
                  <option
                    key={category.id}
                    value={JSON.stringify({
                      category_id: category.category_id,
                      subcategory_id: category.subcategory_id,
                    })}
                  >
                    {category.category_name} - {category.subcategory_name}
                  </option>
                ))} */}
                    <option>Pilih Category</option>
                    {categories.map(category => (
                      <option
                        key={category}
                        value={JSON.stringify({
                          category_id: category.split(' ')[0],
                          // subcategory_id: category.subcategory_id,
                        })}
                      >
                        {category.split(' ')[1]}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                {selectedCategory && (
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
                    <FormLabel>Schedule</FormLabel>
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
                      {dataSchedules?.data?.map(schedule => {
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
                                  {schedule?.start_time} - {schedule?.end_time}
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
                      maxH="96"
                      overflow="auto"
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
                  </FormControl>
                )}
                {selectedSchedule && selectedTime && (
                  <FormControl mb="2" id="description">
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      rows="3"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                    />
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
              isLoading={isLoadingRequestLaboratory}
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
