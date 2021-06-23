/* eslint-disable no-prototype-builtins */
import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  SimpleGrid,
  Text,
  Input,
  Select,
  Heading,
  useToast,
  Spinner,
  Center,
  VisuallyHidden,
  IconButton,
  VStack,
} from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useCookies } from 'react-cookie';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import TimePicker from 'react-time-picker';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';
import DayPicker, { DateUtils } from 'react-day-picker';

import { AuthContext } from '../../../../../../../contexts/authContext';
import {
  getServices,
  createServiceSchedule,
} from '../../../../../../../api/institution-services/service';
import { getInstitutions } from '../../../../../../../api/institution-services/institution';
import { getRegisteredStaff } from '../../../../../../../api/human-capital-services/employee';
import { getEmployeeScheduleById } from '../../../../../../../api/human-capital-services/schedule';
import { BackButton } from '../../../../../../../components/shared/BackButton';

const initialScheduleDate = {
  from: undefined,
  to: undefined,
};

export const AddServiceSchedule = () => {
  const { employeeDetail } = useContext(AuthContext);
  const history = useHistory();
  const [cookies] = useCookies(['token']);
  const [isLoading, setIsLoading] = useState(false);
  const [, setErrMessage] = useState('');
  const [range, setRange] = useState(initialScheduleDate);
  const toast = useToast();
  const [selectedInstitution, setSelectedInstitution] = useState(
    employeeDetail?.institution_id || ''
  );
  const { register, handleSubmit, watch, control, reset, clearErrors } =
    useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'schedules',
  });
  const employeeWatch = watch('employee');
  const schedulesWatch = watch('schedules');
  const queryClient = useQueryClient();

  const { data: resInstitution, isSuccess: isSuccessInstitution } = useQuery(
    'institutions',
    () => getInstitutions(cookies),
    { staleTime: Infinity }
  );

  const { data: resServices, isFetching: isFetchingServices } = useQuery(
    ['services', selectedInstitution],
    () => getServices(cookies, selectedInstitution),
    {
      enabled: Boolean(selectedInstitution),
      staleTime: Infinity,
    }
  );
  const { data: resStaff, isFetching: isFetchingStaff } = useQuery(
    ['employees', selectedInstitution],
    () => getRegisteredStaff(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution), staleTime: Infinity }
  );

  const { data: resEmployeeSchedule, isLoading: isLoadingEmployeeSchedule } =
    useQuery(
      ['employee-schedule', employeeWatch],
      () => getEmployeeScheduleById(cookies, employeeWatch),
      { enabled: Boolean(employeeWatch) }
    );

  const { mutate } = useMutation(createServiceSchedule(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      if (data) {
        await queryClient.invalidateQueries([
          'service-schedule',
          selectedInstitution,
        ]);
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          title: 'Success',
          description: `Jadwal layanan berhasil ditambahkan`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        history.replace('/division/administration/service-schedule');
      }

      if (error) {
        setErrMessage(error.message || 'Error');
      }
    },
    onError: () => {
      // mutation error
    },
    onSuccess: () => {
      // mutation success
    },
  });

  const onSubmit = async value => {
    const { service, employee, schedules } = value;
    const hashSchedule = {};

    schedules.forEach(schedule => {
      if (hashSchedule.hasOwnProperty(schedule.days)) {
        hashSchedule[schedule.days].push({
          start_time: schedule.start_time,
          end_time: schedule.end_time,
          estimation_time: schedule.estimation_time,
        });
      } else {
        hashSchedule[schedule.days] = [
          {
            start_time: schedule.start_time,
            end_time: schedule.end_time,
            estimation_time: schedule.estimation_time,
          },
        ];
      }
    });

    const formattedSchedules = Object.entries(hashSchedule).map(
      ([key, value]) => ({
        days: key,
        time: value,
      })
    );

    const payload = {
      institution_id: selectedInstitution,
      service_id: JSON.parse(service).id,
      master_service_id: JSON.parse(service).master,
      start_date: new Date(range.from).toISOString().split('T')[0],
      end_date: new Date(range.to).toISOString().split('T')[0],
      lang: 'id',
      employee_id: employee,
      data: formattedSchedules,
    };
    await mutate(payload);
  };

  // React Day Pick

  const handleDayClick = day => {
    const selectedRange = DateUtils.addDayToRange(day, range);
    setRange(selectedRange);
  };

  const handleResetClick = () => {
    setRange(initialScheduleDate);
  };

  return (
    <Box>
      <BackButton
        to="/division/administration/service-schedule"
        text="Back to Service Schedule"
      />
      <Heading mb="6" fontSize="3xl">
        Buat Jadwal Layanan
      </Heading>

      <FormControl id="name" mb="4" maxW="xs">
        <FormLabel>Institution</FormLabel>
        <Select
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

      {selectedInstitution && (
        <Box bg="white" shadow="base" py="4" px="6" maxW="4xl">
          <FormControl id="service" mb="6">
            <FormLabel>Pilih Layanan</FormLabel>
            <Select disabled={isFetchingServices} {...register('service')}>
              <option value="">Pilih Layanan</option>
              {resServices?.data?.map(service => {
                return (
                  <option
                    key={service.id}
                    value={JSON.stringify({
                      id: service.id,
                      master: service.master_service_id,
                    })}
                  >
                    {service.name}
                  </option>
                );
              })}
            </Select>
          </FormControl>

          <FormControl id="employee" mb="6">
            <FormLabel>Pilih Staff</FormLabel>
            <Select disabled={isFetchingStaff} {...register('employee')}>
              <option value="">Pilih Staff</option>
              {resStaff?.data?.map(staff => (
                <option key={staff.id} value={staff.id}>
                  {staff.name}
                </option>
              ))}
            </Select>
          </FormControl>

          {isLoadingEmployeeSchedule && (
            <Center py="10">
              <Spinner />
            </Center>
          )}

          {resEmployeeSchedule?.data?.length === 0 ? (
            <VStack pt="8">
              <Text display="block" fontWeight="semibold" color="gray.500">
                Staff belum mengatur jadwal kerja
              </Text>

              <Link to="/division/human-capital/schedule">
                <Text
                  display="block"
                  color="purple.500"
                  _hover={{ color: 'purple.300' }}
                  fontWeight="medium"
                >
                  Atur jadwal kerja
                </Text>
              </Link>
            </VStack>
          ) : null}

          {resEmployeeSchedule?.data?.map(schedule => (
            <Box key={schedule.id}>
              <Box mb="6">
                <Text fontSize="md" fontWeight="semibold" mb="2">
                  Available Time
                </Text>

                <SimpleGrid
                  columns={3}
                  border="1px"
                  borderColor="gray.200"
                  rounded="md"
                  px="4"
                  py="1"
                >
                  {schedule.schedule_detail.map(detail => (
                    <Box
                      key={`${detail.days}-${detail.start_time}-${detail.end_time}`}
                    >
                      <Description
                        title={detail.days}
                        value={`${detail.start_time} - ${detail.end_time}`}
                      />
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>

              <FormControl mb="6">
                <FormLabel>Schedule Day Range</FormLabel>
                <Box
                  border="1px"
                  borderColor="gray.200"
                  px="4"
                  py="2"
                  rounded="md"
                >
                  <ScheduleDate
                    range={range}
                    handleDayClick={handleDayClick}
                    handleResetClick={handleResetClick}
                  />
                </Box>
              </FormControl>

              <Box>
                <Heading fontSize="md" fontWeight="medium" mb="2">
                  Schedule
                </Heading>
                <Box
                  border="1px"
                  borderColor="gray.200"
                  px="4"
                  py="2"
                  rounded="md"
                >
                  <SimpleGrid columns={4} gap="4" mb="2">
                    <Text fontSize="md" fontWeight="semibold" color="gray.500">
                      Days
                    </Text>
                    <Text fontSize="md" fontWeight="semibold" color="gray.500">
                      Start Time
                    </Text>
                    <Text fontSize="md" fontWeight="semibold" color="gray.500">
                      End Time
                    </Text>
                    <Text fontSize="md" fontWeight="semibold" color="gray.500">
                      Estimated time / patient
                    </Text>
                  </SimpleGrid>
                  {fields.map(({ id }, index) => {
                    const findSchedule = schedule?.schedule_detail?.find(
                      item => item?.days === schedulesWatch[index]?.days
                    );

                    return (
                      <Flex key={id} mb="2">
                        <FormControl id="schedules" mb="1" mr="4">
                          <VisuallyHidden as="label">Schedules</VisuallyHidden>

                          <SimpleGrid columns={4} gap="4">
                            <Select {...register(`schedules[${index}].days`)}>
                              <option value="">Select Day</option>
                              {schedule.schedule_detail.map(detail => (
                                <option key={detail.days} value={detail.days}>
                                  {detail.days}
                                </option>
                              ))}
                            </Select>
                            <Controller
                              name={`schedules[${index}].start_time`}
                              control={control}
                              defaultValue="00:00:00"
                              render={({ field: { value, onChange } }) => (
                                <TimePicker
                                  onChange={onChange}
                                  value={value}
                                  format="HH:mm:ss"
                                  disableClock={true}
                                  maxDetail="second"
                                  minTime={findSchedule?.start_time}
                                  maxTime={findSchedule?.end_time}
                                />
                              )}
                            />
                            <Controller
                              name={`schedules[${index}].end_time`}
                              control={control}
                              defaultValue="00:00:00"
                              render={({ field: { value, onChange } }) => (
                                <TimePicker
                                  onChange={onChange}
                                  value={value}
                                  format="HH:mm:ss"
                                  disableClock={true}
                                  maxDetail="second"
                                  minTime={findSchedule?.start_time}
                                  maxTime={findSchedule?.end_time}
                                />
                              )}
                            />

                            <Input
                              {...register(
                                `schedules[${index}].estimation_time`
                              )}
                            />
                          </SimpleGrid>
                        </FormControl>
                        <IconButton
                          onClick={() => remove(index)}
                          icon={<FaTrashAlt />}
                          p="3"
                          colorScheme="red"
                        />
                      </Flex>
                    );
                  })}
                  <Box textAlign="center" mt="4" mb="2">
                    <Button
                      leftIcon={<FaPlus />}
                      type="button"
                      onClick={() => append({})}
                      // w="full"
                      size="sm"
                    >
                      Add Schedule
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
          <Flex justify="flex-end" mt="8">
            <Button
              onClick={handleSubmit(onSubmit)}
              colorScheme="purple"
              isLoading={isLoading}
            >
              Create
            </Button>
          </Flex>
        </Box>
      )}
    </Box>
  );
};

const ScheduleDate = ({ range, handleDayClick, handleResetClick }) => {
  return (
    <Box className="RangeExample">
      {!range.from && !range.to && <Text>Please select the first day.</Text>}
      {range.from && !range.to && <Text>Please select the last day.</Text>}
      {range.from && range.to && (
        <Text as="span">
          {/* Selected from{" "} */}
          Start Date:{' '}
          <Box as="span" color="purple.500">
            {new Date(range.from).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </Box>{' '}
          {/* to{" "} */}
          {' - '}End Date:{' '}
          <Box as="span" color="purple.500">
            {new Date(range.to).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </Box>
        </Text>
      )}

      {range.from && range.to && (
        <Button
          variant="link"
          colorScheme="purple"
          onClick={handleResetClick}
          ml="4"
        >
          Reset
        </Button>
      )}

      <DayPicker
        className="Selectable"
        numberOfMonths={2}
        selectedDays={[range.from, { from: range.from, to: range.to }]}
        modifiers={{ start: range.from, end: range.to }}
        onDayClick={handleDayClick}
        disabledDays={{ before: new Date() }}
      />
    </Box>
  );
};

const Description = ({ title, value, ...props }) => {
  return (
    <Flex as="dl" direction={{ base: 'column', sm: 'row' }} py="1" {...props}>
      <Box as="dt" flexBasis="25%" fontWeight="semibold" color="gray.600">
        {title}
      </Box>
      <Box as="dd" flex="1" fontWeight="semibold">
        {value}
      </Box>
    </Flex>
  );
};
