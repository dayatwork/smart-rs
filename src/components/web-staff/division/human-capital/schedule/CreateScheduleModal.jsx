import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useMutation, useQueryClient } from 'react-query';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import TimePicker from 'react-time-picker';
import ReactSelect from 'react-select';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';

import { createSchedule } from '../../../../../api/human-capital-services/schedule';

const defaultOptionDays = [
  { value: 'Senin', label: 'Senin' },
  { value: 'Selasa', label: 'Selasa' },
  { value: 'Rabu', label: 'Rabu' },
  { value: 'Kamis', label: 'Kamis' },
  { value: 'Jumat', label: 'Jumat' },
  { value: 'Sabtu', label: 'Sabtu' },
  { value: 'Minggu', label: 'Minggu' },
];

export const CreateScheduleModal = ({
  isOpen,
  onClose,
  selectedInstitution,
}) => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [isLoading, setIsLoading] = useState(false);
  const [, setErrMessage] = useState('');
  const [optionDays] = useState(defaultOptionDays);
  const { register, handleSubmit, reset, clearErrors, control } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'schedules',
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation(createSchedule(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries('schedules');
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          title: 'Success',
          description: `Schedule berhasil ditambahkan`,
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
    const { name, schedules } = value;
    const schedulesFormatted = schedules.map(schedule => ({
      ...schedule,
      days: schedule.days.map(day => day.value),
    }));
    const data = {
      institution_id: selectedInstitution,
      name,
      data: schedulesFormatted,
    };

    // console.log(data);

    await mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Schedule</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="name" mb="2">
            <FormLabel>Name</FormLabel>
            <Input {...register('name')} />
          </FormControl>
          {fields.map(({ id }, index) => {
            return (
              <Flex key={id} justify="space-between" mb="2">
                <FormControl id={`days-${index}`} maxW="sm">
                  <FormLabel>Days</FormLabel>
                  <Controller
                    name={`schedules[${index}].days`}
                    control={control}
                    defaultValue=""
                    render={({ field: { value, onChange } }) => {
                      return (
                        <ReactSelect
                          options={optionDays}
                          isMulti
                          value={value}
                          onChange={onChange}
                        />
                      );
                    }}
                  />
                </FormControl>
                <HStack>
                  <FormControl id={`start-time-${index}`}>
                    <FormLabel>Start Time</FormLabel>
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
                        />
                      )}
                    />
                  </FormControl>

                  <FormControl id={`end-time-${index}`}>
                    <FormLabel>End Time</FormLabel>
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
                        />
                      )}
                    />
                  </FormControl>
                </HStack>
                <IconButton
                  onClick={() => remove(index)}
                  icon={<FaTrashAlt />}
                  p="3"
                  colorScheme="red"
                  alignSelf="flex-end"
                />
              </Flex>
            );
          })}
          <Box textAlign="center" mt="2">
            <Button
              leftIcon={<FaPlus />}
              type="button"
              onClick={() => append({})}
              // w="full"
            >
              Add schedule
            </Button>
          </Box>
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
