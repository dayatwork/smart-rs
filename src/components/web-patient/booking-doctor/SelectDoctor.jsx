import React from 'react';
// import { Calendar, utils } from '@hassanmojab/react-modern-calendar-datepicker';
import DayPicker, { DateUtils } from 'react-day-picker';
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Select,
  SimpleGrid,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';
import format from 'date-fns/format';

import { getServices } from '../../../api/master-data-services/service';
import {
  getBookingSchedules,
  getScheduleEstimatedTimes,
} from '../../../api/institution-services/service';

export const SelectDoctor = ({
  currentStep,
  currentStepIndex,
  setCurrentStepIndex,
  selectedSchedule,
  setSelectedSchedule,
  selectedPagination,
  setSelectedPagination,
  selectedService,
  setSelectedService,
  selectedDayRange,
  setSelectedDayRange,
  selectedTime,
  setSelectedTime,
}) => {
  const [cookies] = useCookies(['token']);

  const startDate = selectedDayRange.from && format(selectedDayRange.from, 'yyyy-MM-dd');
  const endDate = selectedDayRange.to && format(selectedDayRange.to, 'yyyy-MM-dd');

  const { data: dataServices, isLoading: isLoadingService } = useQuery('services', () =>
    getServices(cookies),
  );

  const {
    data: dataSchedules,
    isLoading: isLoadingSchedules,
    isSuccess: isSuccessSchedule,
  } = useQuery(
    [
      'patient-booking-schedule',
      {
        selectedService,
        startDate,
        endDate,
        selectedPagination,
      },
    ],
    () =>
      getBookingSchedules(cookies, {
        startDate,
        endDate,
        serviceId: selectedService,
        page: selectedPagination?.page,
        first: selectedPagination?.first,
        last: selectedPagination?.last,
      }),
    {
      enabled: Boolean(selectedService) && Boolean(startDate) && Boolean(endDate),
    },
  );

  const {
    data: dataEstimatedTimes,
    isLoading: isLoadingEstimatedTimes,
    isSuccess: isSuccessEstimatedTimes,
  } = useQuery(
    ['patient-booking-estimated-time', selectedSchedule?.id],
    () => getScheduleEstimatedTimes(cookies, selectedSchedule?.id),
    { enabled: Boolean(selectedSchedule?.id) },
  );

  const handleDayClick = (day, modifiers = {}) => {
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
    <>
      <Grid gridTemplateColumns="repeat(4, 1fr)" gap="10">
        <GridItem>
          <FormControl id="first-name" mb="4">
            <FormLabel>Pilih Layanan</FormLabel>
            <Select
              bg="white"
              value={selectedService}
              onChange={(e) => {
                setSelectedSchedule(null);
                setSelectedService(e.target.value);
              }}
              disabled={isLoadingService}>
              <option>Pilih Layanan</option>
              {dataServices?.data?.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl mb="6">
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
        </GridItem>
        <GridItem colSpan={2}>
          {isLoadingSchedules && (
            <Center h="full">
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="blue.100"
                color="blue.500"
                size="xl"
              />
            </Center>
          )}
          {dataSchedules?.data?.length ? (
            <>
              <Heading fontWeight="semibold" fontSize="lg" mb="2">
                Jadwal dokter yang tersedia
              </Heading>

              <SimpleGrid columns={2} gap="4">
                {dataSchedules?.data?.map((schedule) => {
                  return (
                    <Box
                      cursor="pointer"
                      onClick={() => setSelectedSchedule(schedule)}
                      key={schedule.id}
                      bg={selectedSchedule?.id === schedule.id ? 'blue.100' : 'white'}
                      boxShadow="md"
                      px="6"
                      py="4"
                      rounded="md"
                      border="2px"
                      borderColor={
                        selectedSchedule?.id === schedule.id ? 'blue.500' : 'transparent'
                      }>
                      <Box>
                        <Text fontSize="md" color="blue.500" fontWeight="bold">
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
                          color="gray.500">
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
              {dataSchedules?.pagination?.length > 1 && (
                <Flex align="center" justify="space-between" mt="4">
                  <Text color="gray.600" fontSize="sm">
                    {dataSchedules?.pageLength} pages
                  </Text>
                  <ButtonGroup variant="outline" size="sm">
                    {dataSchedules?.pagination?.map((pag) => (
                      <Button
                        key={pag.page}
                        borderColor={
                          pag.page === selectedPagination.page ? 'blue.500' : 'gray.200'
                        }
                        onClick={() => {
                          // setSelectedTime("");
                          // setSelectedSchedule({});
                          setSelectedPagination(pag);
                        }}>
                        {pag.page}
                      </Button>
                    ))}
                  </ButtonGroup>
                </Flex>
              )}
            </>
          ) : (
            isSuccessSchedule && (
              <Center h="full">
                <Text fontSize="2xl" fontWeight="bold">
                  Not Available
                </Text>
              </Center>
            )
          )}
        </GridItem>
        <GridItem colSpan={1}>
          {isLoadingEstimatedTimes && (
            <Center h="60">
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="blue.100"
                color="blue.500"
                size="xl"
              />
            </Center>
          )}
          {dataEstimatedTimes?.data?.length ? (
            <>
              <Heading fontWeight="semibold" fontSize="lg" mb="3">
                Waktu yang tersedia
              </Heading>
              <SimpleGrid columns={3} gap="4">
                {dataEstimatedTimes?.data?.map((time) => {
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
                          ? 'blue.100'
                          : 'green.100'
                      }
                      boxShadow="md"
                      rounded="md"
                      border="2px"
                      borderColor={
                        selectedTime?.id === time.id ? 'blue.500' : 'transparent'
                      }>
                      {time.available_time}
                    </Center>
                  );
                })}
              </SimpleGrid>
            </>
          ) : (
            isSuccessEstimatedTimes && (
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
        </GridItem>
      </Grid>

      <Box mt="14" textAlign="right">
        <Button
          leftIcon={<FaArrowLeft />}
          disabled={currentStep.value === 'Step 1'}
          onClick={() => setCurrentStepIndex(currentStepIndex - 1)}>
          Back
        </Button>
        <Button
          rightIcon={<FaArrowRight />}
          colorScheme="blue"
          ml="2"
          disabled={!selectedSchedule || !selectedTime}
          onClick={() => setCurrentStepIndex(currentStepIndex + 1)}>
          Next
        </Button>
      </Box>
    </>
  );
};

const ScheduleDate = ({ range, handleDayClick, handleResetClick }) => {
  return (
    <Box className="RangeExample">
      <DayPicker
        className="Selectable"
        numberOfMonths={1}
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
            colorScheme="blue"
            size="sm"
            onClick={handleResetClick}>
            Reset
          </Button>
        )}
      </Flex>
    </Box>
  );
};
