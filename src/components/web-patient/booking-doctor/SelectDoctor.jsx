import React, { useState } from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  Select,
  SimpleGrid,
  Spinner,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';
import format from 'date-fns/format';
import { GiTicket } from 'react-icons/gi';
import { BiRightArrowAlt, BiLeftArrowAlt } from 'react-icons/bi';
import {
  RiHospitalFill,
  RiCalendarEventFill,
  RiTimerLine,
} from 'react-icons/ri';
import { Helmet } from 'react-helmet-async';
import doctorImg from './doctor.jpg';

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
  // selectedPagination,
  // setSelectedPagination,
  selectedService,
  setSelectedService,
  selectedDayRange,
  setSelectedDayRange,
  selectedTime,
  setSelectedTime,
}) => {
  const [cookies] = useCookies(['token']);
  const selectDoctorGridTemplate = useBreakpointValue({
    base: 'repeat(1, 1fr)',
    md: 'repeat(2, 1fr)',
    lg: 'repeat(4, 1fr)',
  });
  // const doctorScheduleGridColumns = useBreakpointValue({
  //   base: 1,
  //   xl: 2,
  // });
  const timeGridColumns = useBreakpointValue({
    base: 2,
    // sm: 3,
    md: 4,
    lg: 6,
    xl: 8,
    '2xl': 10,
  });
  const buttonSize = useBreakpointValue({ base: 'sm', md: 'md' });

  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);

  const startDate =
    selectedDayRange.from && format(selectedDayRange.from, 'yyyy-MM-dd');
  const endDate =
    selectedDayRange.to && format(selectedDayRange.to, 'yyyy-MM-dd');

  const { data: dataServices, isLoading: isLoadingService } = useQuery(
    'services',
    () => getServices(cookies)
  );
  // console.log({ dataServices });

  const {
    data: dataSchedules,
    isLoading: isLoadingSchedules,
    isSuccess: isSuccessSchedule,
  } = useQuery(
    [
      'patient-booking-schedule',
      {
        selectedService,
        first_date: startDate,
        last_date: endDate,
        limit,
        page,
      },
    ],
    () =>
      getBookingSchedules(cookies, {
        first_date: startDate,
        last_date: endDate,
        serviceId: selectedService,
        limit,
        page,
      }),
    {
      enabled:
        Boolean(selectedService) &&
        Boolean(startDate) &&
        Boolean(endDate) &&
        Boolean(limit) &&
        Boolean(page),
    }
  );

  // console.log({ dataSchedules });

  const {
    data: dataEstimatedTimes,
    isLoading: isLoadingEstimatedTimes,
    isSuccess: isSuccessEstimatedTimes,
  } = useQuery(
    ['patient-booking-estimated-time', selectedSchedule?.id],
    () => getScheduleEstimatedTimes(cookies, selectedSchedule?.id),
    { enabled: Boolean(selectedSchedule?.id) }
  );

  // console.log({ dataEstimatedTimes });

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
      <Helmet>
        <style>{customStyle}</style>
      </Helmet>
      <Grid
        gridTemplateColumns={selectDoctorGridTemplate}
        gap="10"
        pb={{ base: '20', md: '32' }}
      >
        <GridItem>
          <FormControl id="first-name" mb="4">
            <FormLabel>Pilih Layanan</FormLabel>
            <Select
              bg="white"
              value={selectedService}
              onChange={e => {
                setSelectedSchedule(null);
                setSelectedService(e.target.value);
              }}
              disabled={isLoadingService}
            >
              <option>Pilih Layanan</option>
              {dataServices?.data?.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl mb="6">
            <FormLabel>Pilih Rentang Tanggal</FormLabel>
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
        </GridItem>
        <GridItem colSpan={3}>
          {isLoadingSchedules && (
            <Center h="full">
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="secondary.light"
                color="secondary.darker"
                size="xl"
              />
            </Center>
          )}
          {dataSchedules?.data?.length ? (
            <Box w="full" pr={{ base: '6', md: '0' }}>
              <Flex
                justify="space-between"
                align="center"
                mt="-1"
                mb="2"
                direction={{ base: 'column', md: 'row' }}
              >
                <Heading fontWeight="semibold" fontSize="md" mb="2">
                  Jadwal dokter yang tersedia
                </Heading>
                <HStack spacing="5">
                  <FormControl display="flex">
                    <FormLabel mt="1">Show</FormLabel>
                    <Select
                      bg="white"
                      size="sm"
                      rounded="sm"
                      // mt="-1"
                      w="20"
                      value={limit}
                      onChange={e => setLimit(e.target.value)}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </Select>
                  </FormControl>
                  <FormControl display="flex">
                    <FormLabel mt="1">Page</FormLabel>
                    <Select
                      bg="white"
                      size="sm"
                      rounded="sm"
                      // mt="-1"
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
                  <HStack>
                    <IconButton
                      bgColor="white"
                      size="sm"
                      icon={<BiLeftArrowAlt />}
                      onClick={() => setPage(prev => prev - 1)}
                      disabled={dataSchedules?.page === 1}
                    />
                    <IconButton
                      bgColor="white"
                      size="sm"
                      icon={<BiRightArrowAlt />}
                      onClick={() => setPage(prev => prev + 1)}
                      disabled={dataSchedules?.total_page === page}
                    />
                  </HStack>
                </HStack>
              </Flex>
              <Box>
                {dataSchedules?.data?.map(schedule => {
                  const totalData = schedule?.total_available?.total_data;
                  const available = schedule?.total_available?.status_available;

                  return (
                    <Flex
                      cursor="pointer"
                      onClick={() => {
                        setSelectedSchedule(schedule);
                        setSelectedTime('');
                      }}
                      key={schedule.id}
                      bg={
                        selectedSchedule?.id === schedule.id
                          ? 'secondary.light'
                          : 'white'
                      }
                      boxShadow="md"
                      px={{ base: '3', md: '6' }}
                      py={{ base: '2', md: '4' }}
                      rounded="md"
                      border="2px"
                      borderColor={
                        selectedSchedule?.id === schedule.id
                          ? 'secondary.dark'
                          : 'transparent'
                      }
                      mb="4"
                      alignItems={{ base: 'start', md: 'center' }}
                      _hover={{
                        bgColor: 'secondary.light',
                      }}
                    >
                      <Box
                        py={{ base: '2', md: '0' }}
                        w={{ base: '20', md: '28' }}
                        h={{ base: '20', md: '28' }}
                      >
                        <Image
                          rounded="full"
                          src={doctorImg}
                          alt="foto dokter"
                        />
                      </Box>
                      <Box
                        flexGrow="1"
                        pl="6"
                        pr={{ base: '2', md: '6' }}
                        borderRight={{ base: '0', md: '2px' }}
                        mr="6"
                        borderColor="gray.300"
                      >
                        <Flex
                          justify="space-between"
                          mb={{ base: '1', lg: '3' }}
                          direction={{ base: 'column', md: 'row' }}
                        >
                          <Box>
                            <Text
                              fontSize={{ base: 'xl', lg: '2xl' }}
                              fontWeight="bold"
                            >
                              {schedule?.employee?.name}
                            </Text>
                            <Text
                              mt="-1.5"
                              color="secondary.dark"
                              fontWeight="semibold"
                            >
                              {schedule?.employee?.profession === 'Doctor'
                                ? 'Dokter'
                                : schedule?.employee?.profession}
                            </Text>
                          </Box>
                          <Text
                            fontSize={{ base: 'lg', lg: '2xl' }}
                            fontWeight="bold"
                            color="secondary.dark"
                          >
                            Rp.50.000
                          </Text>
                        </Flex>
                        {schedule?.total_available && (
                          <Text mb="2">
                            Tersedia{' '}
                            <Box
                              as="span"
                              fontWeight="bold"
                              color={available !== 0 ? 'green.600' : 'red.600'}
                            >
                              {available}
                            </Box>{' '}
                            slot dari{' '}
                            <Box as="span" fontWeight="bold">
                              {totalData}
                            </Box>
                          </Text>
                        )}
                        <Flex
                          color="gray.600"
                          fontSize="sm"
                          fontWeight="medium"
                          direction={{ base: 'column', lg: 'row' }}
                          mb="1"
                        >
                          <HStack mr="6" spacing="1">
                            <Icon
                              color="secondary.dark"
                              as={RiHospitalFill}
                              w="5"
                              h="5"
                            />
                            <span>{schedule?.institution?.name}</span>
                          </HStack>
                          <HStack mr="6" spacing="1">
                            <Icon
                              color="secondary.dark"
                              as={RiCalendarEventFill}
                              w="5"
                              h="5"
                            />
                            <span>
                              {schedule?.days}, {schedule?.date_name}
                            </span>
                          </HStack>
                          <HStack mr="6" spacing="1">
                            <Icon
                              color="secondary.dark"
                              as={RiTimerLine}
                              w="5"
                              h="5"
                            />
                            <span>
                              {schedule?.start_time} - {schedule?.end_time}
                            </span>
                          </HStack>
                        </Flex>
                      </Box>
                      <Center
                        display={{ base: 'none', md: 'flex' }}
                        w={{ base: '16', lg: '24' }}
                        h={{ base: '16', lg: '24' }}
                        p="4"
                        border="2px"
                        borderColor="secondary.dark"
                        color={
                          selectedSchedule?.id === schedule.id
                            ? 'white'
                            : 'secondary.dark'
                        }
                        bgColor={
                          selectedSchedule?.id === schedule.id
                            ? 'secondary.dark'
                            : 'white'
                        }
                        rounded="lg"
                      >
                        <Box>
                          <Icon
                            as={GiTicket}
                            w={{ base: '12', lg: '14' }}
                            h={{ base: '12', lg: '14' }}
                          />
                          <Text
                            fontSize="sm"
                            fontWeight="semibold"
                            display={{ base: 'none', lg: 'block' }}
                          >
                            Booking
                          </Text>
                        </Box>
                      </Center>
                    </Flex>
                  );
                })}
              </Box>
              {/* {dataSchedules?.pagination?.length > 1 && (
                <Flex align="center" justify="space-between" mt="4">
                  <Text color="gray.600" fontSize="sm">
                    {dataSchedules?.pageLength} pages
                  </Text>
                  <ButtonGroup variant="outline" size="sm">
                    {dataSchedules?.pagination?.map(pag => (
                      <Button
                        key={pag.page}
                        borderColor={
                          pag.page === selectedPagination.page
                            ? 'blue.500'
                            : 'gray.200'
                        }
                        onClick={() => {
                          // setSelectedTime("");
                          // setSelectedSchedule({});
                          setSelectedPagination(pag);
                        }}
                      >
                        {pag.page}
                      </Button>
                    ))}
                  </ButtonGroup>
                </Flex>
              )} */}
            </Box>
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
      </Grid>
      <Box
        py="6"
        bg="primary.500"
        position="fixed"
        bottom="0"
        left="0"
        w="full"
        zIndex="5"
      >
        <Flex
          h="full"
          maxW="7xl"
          mx="auto"
          justify="space-between"
          align="center"
          px="4"
        >
          {isLoadingEstimatedTimes && (
            <Center>
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="secondary.light"
                color="secondary.dark"
                // size="xl"
              />
            </Center>
          )}
          <Box maxH={{ base: '40', md: '60' }} overflowY="auto" px="4">
            {dataEstimatedTimes?.data?.length ? (
              <Box>
                <Text fontWeight="semibold" fontSize="md" mb="2" color="white">
                  Waktu yang tersedia
                </Text>
                <SimpleGrid columns={timeGridColumns} gap="4">
                  {dataEstimatedTimes?.data.map(time => {
                    const timeAvailableStatus = availableStatus(
                      selectedSchedule.date,
                      time.available_time
                    );
                    return (
                      <Center
                        px="2"
                        as="button"
                        disabled={
                          time.status || timeAvailableStatus !== 'available'
                        }
                        cursor={
                          time.status || timeAvailableStatus !== 'available'
                            ? 'not-allowed'
                            : 'pointer'
                        }
                        onClick={() => setSelectedTime(time)}
                        key={time.id}
                        bg={
                          time.status || timeAvailableStatus === 'expired'
                            ? 'red.200'
                            : selectedTime?.id === time.id
                            ? 'secondary.dark'
                            : timeAvailableStatus === 'available-onsite'
                            ? 'orange.200'
                            : 'green.200'
                        }
                        boxShadow="md"
                        rounded="md"
                        border="2px"
                        borderColor={
                          selectedTime?.id === time.id ? 'white' : 'transparent'
                        }
                        color={
                          selectedTime?.id === time.id ? 'primary.500' : null
                        }
                        fontWeight={
                          selectedTime?.id === time.id ? 'bold' : null
                        }
                      >
                        {time.available_time}
                      </Center>
                    );
                  })}
                </SimpleGrid>
                <HStack mt="4" color="white" spacing="4">
                  <HStack>
                    <Box rounded="sm" w="4" h="4" bg="green.200"></Box>
                    <Text>Tersedia</Text>
                  </HStack>
                  <HStack>
                    <Box rounded="sm" w="4" h="4" bg="orange.200"></Box>
                    <Text>Tersedia untuk booking onsite</Text>
                  </HStack>
                  <HStack>
                    <Box rounded="sm" w="4" h="4" bg="red.200"></Box>
                    <Text>Tidak tersedia</Text>
                  </HStack>
                </HStack>
              </Box>
            ) : (
              isSuccessEstimatedTimes && (
                <Box color="white">
                  <Text
                    fontWeight="semibold"
                    fontSize="md"
                    mb="2"
                    color="white"
                  >
                    Waktu yang tersedia
                  </Text>

                  <Text fontSize="lg" fontWeight="bold">
                    Not Available
                  </Text>
                </Box>
              )
            )}
          </Box>
          <Box>
            <Button
              leftIcon={<FaArrowLeft />}
              disabled={currentStep.value === 'Step 1'}
              onClick={() => setCurrentStepIndex(currentStepIndex - 1)}
              size={buttonSize}
            >
              Back
            </Button>
            <Button
              rightIcon={<FaArrowRight />}
              bgColor="secondary.light"
              color="secondary.dark"
              _hover={{
                bgColor: 'secondary.dark',
                color: 'secondary.light',
              }}
              ml="2"
              disabled={!selectedSchedule || !selectedTime}
              onClick={() => setCurrentStepIndex(currentStepIndex + 1)}
              size={buttonSize}
            >
              Next
            </Button>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

const isToday = currentDate => {
  return new Date().toISOString().split('T')[0] !== currentDate;
};

const availableStatus = (currentDate, time) => {
  const HOURS = 2;
  if (isToday(currentDate)) {
    return 'available';
  }

  const availableTime = new Date(`${currentDate}T${time}`).getTime();
  const currentTime = new Date().getTime();

  if (availableTime - currentTime < 0) {
    return 'expired';
  }

  if (availableTime - currentTime > 1000 * 60 * 60 * HOURS) {
    return 'available';
  }

  if (availableTime - currentTime <= 1000 * 60 * 60 * HOURS) {
    return 'available-onsite';
  }
};

const ScheduleDate = ({ range, handleDayClick, handleResetClick }) => {
  return (
    <Box>
      <Center className="RangeExample">
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
      </Center>
      <Flex maxW="60" mx="auto">
        {range.from && range.to && (
          <Button
            mb="2"
            w="full"
            display="block"
            color="secondary.dark"
            size="sm"
            bgColor="white"
            _hover={{
              bgColor: 'secondary.light',
            }}
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
    background-color: #ECFFFF !important;
    color: #006666 !important;
  }
  .Selectable .DayPicker-Day {
    border-radius: 0 !important;
  }
  .Selectable .DayPicker-Day.DayPicker-Day--today {
    background-color: #ECFFFF !important;
    color: #006666;
  }
  .Selectable .DayPicker-Day.DayPicker-Day--start {
    background-color: #006666 !important;
    color: #ECFFFF !important;
  }
  .Selectable .DayPicker-Day.DayPicker-Day--end {
    background-color: #006666 !important;
    color: #ECFFFF !important;
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
    color: #006666 !important;
    background-color: #ECFFFF !important;
  }
`;
