import React, { useState } from 'react';
import { Calendar } from '@hassanmojab/react-modern-calendar-datepicker';
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
  RadioGroup,
  Radio,
  useToast,
} from '@chakra-ui/react';
import 'react-day-picker/lib/style.css';
import { useQuery, useQueryClient } from 'react-query';
import { useCookies } from 'react-cookie';

import {
  getServices,
  getScheduleEstimatedTimes,
  getBookingSchedules,
} from '../../../../../../../api/institution-services/service';

import { getLabCategories } from '../../../../../../../api/institution-services/lab-category';
import { createLaboratoryRegistration } from '../../../../../../../api/laboratory-services/register';

export const RequestLabTestModal = ({ isOpen, onClose, dataSoap }) => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [selectedService, setSelectedService] = useState(
    'f0d0b365-ed2a-46cb-a056-8cc589d6e3b5',
  );
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [location, setLocation] = useState('UGD');
  const [selectedDayRange, setSelectedDayRange] = useState({
    from: '',
    to: '',
  });
  const [description, setDescription] = useState('');
  const [isLoadingRequestLaboratory, setIsLoadingRequestLaboratory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  // const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const queryClient = useQueryClient();

  // ==========================
  // ======= Calendar =========
  // ==========================
  const maximumDate = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 2,
    day: new Date().getDate(),
  };

  const myCustomLocale = {
    // months list by order
    months: [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ],

    // week days by order
    weekDays: [
      {
        name: 'Minggu', // used for accessibility
        short: 'M', // displayed at the top of days' rows
        isWeekend: true, // is it a formal weekend or not?
      },
      {
        name: 'Senin',
        short: 'S',
      },
      {
        name: 'Selasa',
        short: 'S',
      },
      {
        name: 'Rabu',
        short: 'R',
      },
      {
        name: 'Kamis',
        short: 'K',
      },
      {
        name: "Jum'at",
        short: 'J',
      },
      {
        name: 'Sabtu',
        short: 'S',
      },
    ],

    // just play around with this number between 0 and 6
    weekStartingIndex: 0,

    // return a { year: number, month: number, day: number } object
    getToday(gregorainTodayObject) {
      return gregorainTodayObject;
    },

    // return a native JavaScript date here
    toNativeDate(date) {
      return new Date(date.year, date.month - 1, date.day);
    },

    // return a number for date's month length
    getMonthLength(date) {
      return new Date(date.year, date.month, 0).getDate();
    },

    // return a transformed digit to your locale
    transformDigit(digit) {
      return digit;
    },

    // texts in the date picker
    nextMonth: 'Next Month',
    previousMonth: 'Previous Month',
    openMonthSelector: 'Open Month Selector',
    openYearSelector: 'Open Year Selector',
    closeMonthSelector: 'Close Month Selector',
    closeYearSelector: 'Close Year Selector',
    defaultPlaceholder: 'Select...',

    // for input range value
    from: 'from',
    to: 'to',

    // used for input value when multi dates are selected
    digitSeparator: ',',

    // if your provide -2 for example, year will be 2 digited
    yearLetterSkip: 0,

    // is your language rtl or ltr?
    isRtl: false,
  };

  const startDate =
    selectedDayRange.from &&
    new Date(
      `${selectedDayRange.from.year}-${selectedDayRange.from.month}-${selectedDayRange.from.day}`,
    )
      .toISOString()
      .split('T')[0];

  const endDate =
    selectedDayRange.to &&
    new Date(
      `${selectedDayRange.to.year}-${selectedDayRange.to.month}-${selectedDayRange.to.day}`,
    )
      .toISOString()
      .split('T')[0];

  // ==========================
  // ===== End Calendar =======
  // ==========================
  const { data: dataServices } = useQuery(
    ['services', dataSoap?.institution_id],
    () => getServices(cookies, dataSoap?.institution_id),
    { enabled: Boolean(dataSoap?.institution_id) },
  );

  const {
    data: dataSchedules,
    isLoading: isLoadingSchedules,
    isSuccess: isSuccessSchedule,
  } = useQuery(
    ['booking-schedule', { selectedService, startDate, endDate }],
    () =>
      getBookingSchedules(cookies, {
        startDate,
        endDate,
        serviceId: selectedService,
        institutionId: dataSoap?.institution_id,
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

  const { data: dataCategories } = useQuery(
    ['laboratory-categories', dataSoap?.institution_id],
    () => getLabCategories(cookies, dataSoap?.institution_id),
    {
      enabled: Boolean(dataSoap?.institution_id),
    },
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id: soap_id, patient_id, institution_id } = dataSoap;
    const { employee_id, date } = JSON.parse(selectedSchedule);
    const { value: time } = JSON.parse(selectedTime);
    const { category_id, subcategory_id } = JSON.parse(selectedCategory);

    const data = {
      institution_id,
      patient_id,
      soap_id,
      category_id,
      subcategory_id,
      method: 'default',
      booking_id: null,
      employee_id,
      date,
      time,
      description,
      location,
    };

    try {
      setIsLoadingRequestLaboratory(true);
      await createLaboratoryRegistration(cookies)(data);
      await queryClient.invalidateQueries(['laboratory-list', data.institution_id]);
      setIsLoadingRequestLaboratory(false);

      setSelectedService('');
      setSelectedSchedule('');
      setSelectedDayRange({
        from: '',
        to: '',
      });
      setSelectedTime('');
      setSelectedCategory('');
      // setSelectedSubcategory("");
      toast({
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
        title: 'Error',
        description: `Request laboratory failed`,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Request Lab Test</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="lab-service" mb="4">
            <FormLabel>Pilih Layanan</FormLabel>
            <Select
              bg="white"
              value={selectedService}
              onChange={(e) => {
                setSelectedSchedule('');
                setSelectedService(e.target.value);
              }}>
              <option>Pilih Layanan</option>
              {dataServices?.data
                ?.filter(
                  (service) =>
                    service.master_service_id === '9fde6ede-38b8-47f7-b080-baa50a1b587c',
                )
                ?.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
            </Select>
          </FormControl>
          <FormControl id="laboratory-category" mb="4">
            <FormLabel>Pilih Category</FormLabel>
            <Select
              bg="white"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
              }}>
              <option>Pilih Category</option>
              {dataCategories?.data?.map((category) => (
                <option
                  key={category.id}
                  value={JSON.stringify({
                    category_id: category.category_id,
                    subcategory_id: category.subcategory_id,
                  })}>
                  {category.category_name} - {category.subcategory_name}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl id="location" mb="4">
            <FormLabel>Location</FormLabel>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} />
          </FormControl>
          {selectedCategory && (
            <FormControl mb="4">
              <FormLabel>Jadwal</FormLabel>
              <Calendar
                value={selectedDayRange}
                onChange={(value) => {
                  setSelectedSchedule('');
                  setSelectedDayRange(value);
                }}
                shouldHighlightWeekends
                // minimumDate={utils().getToday()}
                maximumDate={maximumDate}
                colorPrimary="#2B6CB0"
                colorPrimaryLight="#BEE3F8"
                locale={myCustomLocale}
              />
            </FormControl>
          )}
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
                onChange={(e) => setSelectedSchedule(e.target.value)}>
                <option>Select Schedule</option>
                {dataSchedules?.data?.map((schedule) => {
                  return (
                    <option
                      key={schedule.id}
                      value={JSON.stringify({
                        id: schedule?.schedule_id,
                        detailId: schedule?.id,
                        date: schedule?.date,
                        employee_id: schedule?.employee?.id,
                        employee_name: schedule?.employee?.name,
                      })}>
                      Dokter: {schedule?.employee?.name} --- Tanggal: {schedule.date} ---
                      Pukul: {schedule.start_time}-{schedule.end_time}
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
            <FormControl mb="4">
              <FormLabel>Time</FormLabel>
              <RadioGroup onChange={setSelectedTime} value={selectedTime}>
                <SimpleGrid columns={4} gap="6">
                  {dataEstimatedTimes &&
                    dataEstimatedTimes?.data?.map((time) => (
                      <Radio
                        id={time.id}
                        disabled={time.status}
                        value={JSON.stringify({
                          id: time.id,
                          value: time.available_time,
                        })}
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
          {selectedSchedule && (
            <FormControl mb="4" id="description">
              <FormLabel>Description</FormLabel>
              <Textarea
                rows="6"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>
          )}
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            colorScheme="green"
            onClick={handleSubmit}
            isLoading={isLoadingRequestLaboratory}>
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
