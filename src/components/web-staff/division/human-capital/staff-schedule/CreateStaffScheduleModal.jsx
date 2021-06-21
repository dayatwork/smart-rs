import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  useToast,
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm, Controller } from 'react-hook-form';
import ReactSelect from 'react-select';

import {
  getSchedules,
  createEmployeeSchedule,
} from '../../../../../api/human-capital-services/schedule';
import { getRegisteredStaff } from '../../../../../api/human-capital-services/employee';
import { InputDate } from '../../../../../components/shared/input';

export const CreateStaffScheduleModal = ({
  isOpen,
  onClose,
  selectedInstitution,
}) => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [isLoading, setIsLoading] = useState(false);
  const [, setErrMessage] = useState('');
  const { register, handleSubmit, reset, clearErrors, control } = useForm();

  const queryClient = useQueryClient();

  const { data: dataSchedules } = useQuery('schedules', () =>
    getSchedules(cookies)
  );

  const { data: dataEmployees } = useQuery(
    ['accounts', selectedInstitution],
    () => getRegisteredStaff(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution) }
  );

  const { mutate } = useMutation(createEmployeeSchedule(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries('employee-schedules');
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          title: 'Success',
          description: `Schedule Employee berhasil ditambahkan`,
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
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
    const { employees, schedule, start_date } = value;

    const data = employees.map(emp => ({
      schedule_id: schedule,
      employee_id: emp.value,
    }));

    const employeeSchedule = {
      institution_id: selectedInstitution,
      start_date: new Date(start_date).toISOString().split('T')[0],
      data,
    };

    await mutate(employeeSchedule);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Employee Schedule</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="employees" mb="4">
            <FormLabel>Select Employees</FormLabel>
            <Controller
              name="employees"
              control={control}
              defaultValue=""
              render={({ field: { value, onChange } }) => {
                return (
                  <ReactSelect
                    options={dataEmployees?.data.map(emp => ({
                      label: emp.name,
                      value: emp.id,
                    }))}
                    isMulti
                    value={value}
                    onChange={onChange}
                  />
                );
              }}
            />
          </FormControl>
          <FormControl id="schedule" mb="4">
            <FormLabel>Select Schedule</FormLabel>
            <Select {...register('schedule')}>
              <option>Select Schedule</option>
              {dataSchedules?.data.map(schedule => (
                <option key={schedule.id} value={schedule.id}>
                  {schedule.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Start Date</FormLabel>
            <InputDate name="start_date" control={control} />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose} variant="ghost">
            Close
          </Button>
          <Button
            isLoading={isLoading}
            colorScheme="purple"
            onClick={handleSubmit(onSubmit)}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
