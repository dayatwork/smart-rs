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
import {
  getRadiologyCategoriesName,
  getRadiologySubCategoriesName,
} from '../../../../../../../api/institution-services/radiology-category';
import { createRadiology } from '../../../../../../../api/radiology-services/radiology';

export const RequestRadiologyTestModal = ({ isOpen, onClose, dataSoap }) => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [selectedService, setSelectedService] = useState(
    'b192973b-70c6-464d-98f2-327184874b5a'
  );
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDayRange, setSelectedDayRange] = useState({
    from: undefined,
    to: undefined,
  });
  const [description, setDescription] = useState('');
  const [isLoadingRequestRadiology, setIsLoadingRequestRadiology] =
    useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
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
    const { employee_id, date } = JSON.parse(selectedSchedule);
    const { value: time } = JSON.parse(selectedTime);

    const data = {
      institution_id,
      patient_id,
      soap_id,
      radiology_type_id: selectedSubcategory,
      booking_id: null,
      employee_id,
      date,
      time,
      description,
    };

    try {
      setIsLoadingRequestRadiology(true);
      await createRadiology(cookies)(data);
      await queryClient.invalidateQueries([
        'radiology-list',
        data.institution_id,
      ]);
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
        title: 'Error',
        description: `Request radiology failed`,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <Helmet>
        <style>{customStyle}</style>
      </Helmet>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Request Radiology Test</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
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
                  service =>
                    service.master_service_id ===
                    '0dcb09ce-cfee-4d6c-bf9c-23048be9c526'
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
                <option key={category.category_id} value={category.category_id}>
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
            isLoading={isLoadingRequestRadiology}
          >
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
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
