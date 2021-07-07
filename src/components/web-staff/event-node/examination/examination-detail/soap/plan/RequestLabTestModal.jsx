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

import { getLabCategories } from '../../../../../../../api/institution-services/lab-category';
import { createLaboratoryRegistration } from '../../../../../../../api/laboratory-services/register';

const MASTER_LAB = '9fde6ede-38b8-47f7-b080-baa50a1b587c';

export const RequestLabTestModal = ({ isOpen, onClose, dataSoap }) => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [selectedService, setSelectedService] = useState(
    'f0d0b365-ed2a-46cb-a056-8cc589d6e3b5'
  );
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [location, setLocation] = useState('UGD');
  const [selectedDayRange, setSelectedDayRange] = useState({
    from: undefined,
    to: undefined,
  });
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
    ['booking-schedule', { selectedService, startDate, endDate }],
    () =>
      getBookingSchedulesInstitution(cookies, {
        startDate,
        endDate,
        serviceId: selectedService,
        institutionId: dataSoap?.institution_id,
      }),
    {
      enabled:
        Boolean(selectedService) && Boolean(startDate) && Boolean(endDate),
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

  const { data: dataCategories } = useQuery(
    ['laboratory-categories', dataSoap?.institution_id],
    () => getLabCategories(cookies, dataSoap?.institution_id),
    {
      enabled: Boolean(dataSoap?.institution_id),
    }
  );

  const handleSubmit = async e => {
    e.preventDefault();
    const { id: soap_id, patient_id, institution_id } = dataSoap;
    const { employee_id, date } = JSON.parse(selectedSchedule);
    const { value: time } = JSON.parse(selectedTime);
    // const { category_id, subcategory_id } = JSON.parse(selectedCategory);
    const { category_id } = JSON.parse(selectedCategory);

    const data = {
      institution_id,
      patient_id,
      soap_id,
      category_id,
      // subcategory_id,
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
      await queryClient.invalidateQueries([
        'laboratory-list',
        data.institution_id,
      ]);
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
  console.log({ dataCategories });

  const labCategories = dataCategories?.data?.map(
    category => `${category.category_id} ${category.category_name}`
  );
  const categories = [...new Set(labCategories)];
  console.log({ categories });

  return (
    <>
      <Helmet>
        <style>{customStyle}</style>
      </Helmet>
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
                  ?.filter(service => service.master_service_id === MASTER_LAB)
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
              <FormControl mb="4">
                <FormLabel>Time</FormLabel>
                <RadioGroup onChange={setSelectedTime} value={selectedTime}>
                  <SimpleGrid columns={4} gap="6">
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
            {selectedSchedule && (
              <FormControl mb="4" id="description">
                <FormLabel>Description</FormLabel>
                <Textarea
                  rows="6"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </FormControl>
            )}
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              colorScheme="purple"
              onClick={handleSubmit}
              isLoading={isLoadingRequestLaboratory}
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
      <Flex justify="flex-end">
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
