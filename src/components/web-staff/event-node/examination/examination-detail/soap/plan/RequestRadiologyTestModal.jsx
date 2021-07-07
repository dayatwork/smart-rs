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
  Select,
  Text,
  Center,
  Spinner,
  RadioGroup,
  Radio,
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
import {
  getRadiologyCategoriesName,
  getRadiologySubCategoriesName,
} from '../../../../../../../api/institution-services/radiology-category';
import { createRadiology } from '../../../../../../../api/radiology-services/radiology';

const MASTER_RADIOLOGY = '0dcb09ce-cfee-4d6c-bf9c-23048be9c526';

export const RequestRadiologyTestModal = ({ isOpen, onClose, dataSoap }) => {
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
  const [description, setDescription] = useState('');
  const [isLoadingRequestRadiology, setIsLoadingRequestRadiology] =
    useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const queryClient = useQueryClient();

  // ==========================
  // ======= Calendar =========
  // ==========================
  // console.log({ dataSoap });
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

  // console.log({ selectedService });
  // console.log({ inst: dataSoap?.institution_id });

  // console.log({ dataServicePrice });

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

  // console.log({ dataServices });

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
    ['estimated-times', JSON.parse(selectedSchedule || '{}')?.detailId],
    () =>
      getScheduleEstimatedTimes(
        cookies,
        JSON.parse(selectedSchedule || '{}')?.detailId
      ),
    { enabled: Boolean(JSON.parse(selectedSchedule || '{}')?.detailId) }
  );

  const {
    data: dataCategories,
    // isLoading: isLoadingCategories,
    // isSuccess: isSuccessCategories,
  } = useQuery(
    ['radiology-categories-name', dataSoap?.institution_id],
    () => getRadiologyCategoriesName(cookies, dataSoap?.institution_id),
    { enabled: Boolean(dataSoap?.institution_id) }
  );

  const {
    data: dataSubcategories,
    isLoading: isLoadingSubcategories,
    isSuccess: isSuccessSubcategories,
  } = useQuery(
    [
      'radiology-subcategories-name',
      dataSoap?.institution_id,
      selectedCategory,
    ],
    () =>
      getRadiologySubCategoriesName(
        cookies,
        dataSoap?.institution_id,
        selectedCategory
      ),
    { enabled: Boolean(dataSoap?.institution_id) && Boolean(selectedCategory) }
  );

  const handleSubmit = async e => {
    e.preventDefault();
    const { id: soap_id, patient_id, institution_id } = dataSoap;
    const {
      employee_id,
      date,
      id: scheduleId,
      detailId: scheduleDetailId,
    } = JSON.parse(selectedSchedule);
    const { value: time, id: timeId } = JSON.parse(selectedTime);

    const paymentMethod = JSON.parse(selectedPaymentMethod);

    const dataBooking = {
      patient_id,
      service_id: selectedService,
      schedule_id: scheduleId,
      schedule_detail_id: scheduleDetailId,
      estimate_time_id: timeId,
    };
    console.log({ dataBooking });

    try {
      setIsLoadingRequestRadiology(true);
      // Create Booking
      const res = await createOnsiteBooking(cookies, dataBooking);

      // Create Order
      const orderData = {
        booking_order_id: res?.data?.booking_order?.id,
        type: '02',
        address_id: null,
        event_node: 'Booking',
        estimate_time_id: timeId,
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
      console.log({ orderData });
      await createOrder(cookies)(orderData);

      // Create Registration Radiology
      const dataRegisterImaging = {
        institution_id,
        patient_id,
        soap_id,
        radiology_type_id: selectedSubcategory,
        booking_id: res?.data?.booking_order?.booking_id,
        employee_id,
        date,
        time,
        description,
      };
      await createRadiology(cookies)(dataRegisterImaging);

      await queryClient.invalidateQueries('booking-list');
      await queryClient.invalidateQueries([
        'institution-order-list',
        institution_id,
      ]);
      await queryClient.invalidateQueries(['radiology-list', institution_id]);
      setIsLoadingRequestRadiology(false);

      setSelectedService('');
      setSelectedSchedule('');
      setSelectedDayRange({
        from: '',
        to: '',
      });
      setSelectedTime('');
      setSelectedCategory('');
      setSelectedSubcategory('');
      toast({
        position: 'top-right',
        title: 'Success',
        description: `Request radiology success`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      setIsLoadingRequestRadiology(false);

      toast({
        position: 'top-right',
        title: 'Error',
        description: `Request radiology failed`,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <Helmet>
        <style>{customStyle}</style>
      </Helmet>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Request Radiology Test</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleGrid columns={2} gap="6">
            <Box>
              <FormControl id="radiology-service" mb="4">
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
                  {dataServices?.data
                    ?.filter(
                      service => service.master_service_id === MASTER_RADIOLOGY
                    )
                    ?.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                </Select>
              </FormControl>
              <FormControl id="radiology-category" mb="4">
                <FormLabel>Pilih Category</FormLabel>
                <Select
                  bg="white"
                  value={selectedCategory}
                  onChange={e => {
                    setSelectedCategory(e.target.value);
                  }}
                >
                  <option>Pilih Category</option>
                  {dataCategories?.data?.map(category => (
                    <option
                      key={category.category_id}
                      value={category.category_id}
                    >
                      {category.category_name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              {isLoadingSubcategories && (
                <Center py="6">
                  <Spinner />
                </Center>
              )}
              {selectedCategory && isSuccessSubcategories && (
                <FormControl id="radiology-subcategory" mb="4">
                  <FormLabel>Pilih Sub Category</FormLabel>
                  <Select
                    bg="white"
                    value={selectedSubcategory}
                    onChange={e => {
                      setSelectedSubcategory(e.target.value);
                    }}
                  >
                    <option>Pilih Sub Category</option>
                    {dataSubcategories?.data?.map(subcategory => (
                      <option
                        key={subcategory.subcategory_id}
                        value={subcategory.subcategory_id}
                      >
                        {subcategory.subcategory_name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              )}
              {selectedSubcategory && (
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
                  <Select
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
                  </Select>
                </FormControl>
              )}
              {isLoadingEstimatedTime && (
                <Center py="6">
                  <Spinner />
                </Center>
              )}
              {isSuccessEstimatedTime && selectedSchedule && (
                <FormControl mb="6">
                  <FormLabel>Time</FormLabel>
                  <RadioGroup onChange={setSelectedTime} value={selectedTime}>
                    <SimpleGrid columns={4} gap="4">
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
                            {/* {time.status && (
                              <Text fontSize="sm">Not Available</Text>
                            )} */}
                          </Radio>
                        ))}
                    </SimpleGrid>
                  </RadioGroup>
                </FormControl>
              )}
              <SimpleGrid columns={2} gap="4">
                <Box>
                  {selectedSchedule && selectedTime && (
                    <FormControl mb="4" id="description">
                      <FormLabel>Description</FormLabel>
                      <Textarea
                        rows="6"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                      />
                    </FormControl>
                  )}
                </Box>
                <Box>
                  {isSuccessServicePrice && selectedTime && (
                    <FormControl mb="2">
                      <FormLabel mb="-1">Price</FormLabel>
                      <Box fontSize="2xl" fontWeight="extrabold" as="span">
                        {formatter.format(
                          Number(dataServicePrice?.data?.total_price)
                        )}
                      </Box>
                    </FormControl>
                  )}
                  {selectedTime && (
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
            isLoading={isLoadingRequestRadiology}
            disabled={!selectedTime || !selectedPaymentMethod}
          >
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
});

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
    <Box className="RangeExample">
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
