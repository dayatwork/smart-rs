import React, { useState } from 'react';
// import { Calendar, utils } from '@hassanmojab/react-modern-calendar-datepicker';
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

  // console.log({ dataSchedules });
  // console.log({ page });
  // console.log({ selectedSchedule });
  // console.log({ dataSchedules });
  // <Icon as={GiTicket} color="white" w="20" h="20" />

  return (
    <>
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
        </GridItem>
        <GridItem colSpan={3}>
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
            <Box w="full">
              <Flex justify="space-between" align="center" mt="-1" mb="2">
                <Heading fontWeight="semibold" fontSize="md" mb="2">
                  Jadwal dokter yang tersedia
                </Heading>
                <HStack spacing="5">
                  <FormControl display="flex">
                    <FormLabel mt="1">Limit</FormLabel>
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
                          ? 'blue.100'
                          : 'white'
                      }
                      boxShadow="md"
                      px="6"
                      py="4"
                      rounded="md"
                      border="2px"
                      borderColor={
                        selectedSchedule?.id === schedule.id
                          ? 'blue.500'
                          : 'transparent'
                      }
                      mb="4"
                      alignItems="center"
                    >
                      <Box w="28" h="28">
                        <Image
                          rounded="full"
                          src={doctorImg}
                          alt="foto dokter"
                        />
                      </Box>
                      <Box
                        flexGrow="1"
                        pl="6"
                        pr="6"
                        borderRight="2px"
                        mr="6"
                        borderColor="gray.300"
                      >
                        <Flex justify="space-between" mb="3">
                          <Box>
                            <Text fontSize="2xl" fontWeight="bold">
                              {schedule?.employee?.name}
                            </Text>
                            <Text
                              mt="-1.5"
                              color="blue.600"
                              fontWeight="semibold"
                            >
                              {schedule?.employee?.profession}
                            </Text>
                          </Box>
                          <Text
                            fontSize="2xl"
                            fontWeight="bold"
                            color="green.600"
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
                              color={
                                schedule?.total_available?.status_available !==
                                0
                                  ? 'green.600'
                                  : 'red.600'
                              }
                            >
                              {schedule?.total_available?.status_available}
                            </Box>{' '}
                            jadwal dari{' '}
                            <Box as="span" fontWeight="bold">
                              {schedule?.total_available?.total_data}
                            </Box>
                          </Text>
                        )}
                        <Flex
                          color="gray.600"
                          fontSize="sm"
                          fontWeight="medium"
                        >
                          <HStack mr="6" spacing="1">
                            <Icon as={RiHospitalFill} w="5" h="5" />
                            <span>{schedule?.institution?.name}</span>
                          </HStack>
                          <HStack mr="6" spacing="1">
                            <Icon as={RiCalendarEventFill} w="5" h="5" />
                            <span>
                              {schedule?.days}, {schedule?.date_name}
                            </span>
                          </HStack>
                          <HStack mr="6" spacing="1">
                            <Icon as={RiTimerLine} w="5" h="5" />
                            <span>
                              {schedule?.start_time} - {schedule?.end_time}
                            </span>
                          </HStack>
                        </Flex>
                      </Box>
                      <Center
                        w="24"
                        h="24"
                        p="4"
                        border="2px"
                        borderColor="blue.600"
                        color={
                          selectedSchedule?.id === schedule.id
                            ? 'white'
                            : 'blue.600'
                        }
                        bgColor={
                          selectedSchedule?.id === schedule.id
                            ? 'blue.600'
                            : 'white'
                        }
                        rounded="lg"
                      >
                        <Box>
                          <Icon as={GiTicket} w="14" h="14" />
                          <Text fontSize="sm" fontWeight="semibold">
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
        bg="gray.900"
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
                emptyColor="blue.100"
                color="blue.500"
                // size="xl"
              />
            </Center>
          )}
          <Box maxH={{ base: '40', md: '60' }} overflow="auto" px="4">
            {dataEstimatedTimes?.data?.length ? (
              <Box>
                <Text fontWeight="semibold" fontSize="md" mb="2" color="white">
                  Waktu yang tersedia
                </Text>
                <SimpleGrid columns={timeGridColumns} gap="4">
                  {dataEstimatedTimes?.data?.map(time => {
                    return (
                      <Center
                        px="2"
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
                          selectedTime?.id === time.id
                            ? 'blue.500'
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
            >
              Back
            </Button>
            <Button
              rightIcon={<FaArrowRight />}
              colorScheme="blue"
              ml="2"
              disabled={!selectedSchedule || !selectedTime}
              onClick={() => setCurrentStepIndex(currentStepIndex + 1)}
            >
              Next
            </Button>
          </Box>
        </Flex>
      </Box>
    </>
  );
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
            colorScheme="blue"
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
