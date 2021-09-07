import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
  VisuallyHidden,
  Input,
  HStack,
  FormLabel,
  Select,
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from 'react-query';

import { getCashiers } from '../../../../api/institution-services/cashier';
import { createNewIncome } from '../../../../api/finance-services/income';

export const CreateNewIncomeModal = ({
  isOpen,
  onClose,
  selectedInstitution,
}) => {
  const toast = useToast();
  const [cookies] = useCookies(['token', 'employee']);
  const [isLoading, setIsLoading] = useState(false);
  const [, setErrMessage] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    control,
    formState: { errors },
  } = useForm();
  const queryClient = useQueryClient();

  const { data: dataCashier, isLoading: isLoadingCashier } = useQuery(
    'cashiers',
    () => getCashiers(cookies, selectedInstitution),
    {
      staleTime: Infinity,
      enabled: Boolean(selectedInstitution),
    }
  );

  const { mutate } = useMutation(createNewIncome(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries([
          'income-list',
          selectedInstitution,
        ]);
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          position: 'top-right',
          title: 'Success',
          description: `Income baru berhasil ditambahkan`,
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

  const onSubmit = async values => {
    const { cashier_id, type, currency, total, date } = values;

    const data = {
      institution_id: selectedInstitution,
      employee_id: cookies?.employee?.employee_id,
      cashier_id,
      type,
      currency,
      total,
      date,
    };

    await mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Income</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl
            mb="4"
            id="cashier_id"
            isInvalid={errors?.cashier_id ? true : false}
          >
            <FormLabel>Cashier</FormLabel>
            <Select
              disabled={isLoadingCashier}
              {...register('cashier_id', { required: true })}
            >
              <option value="">Select Cashier</option>
              {dataCashier?.data?.map(cashier => (
                <option key={cashier.id} value={cashier.id}>
                  {cashier.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl mb="4" id="type" isInvalid={errors?.type ? true : false}>
            <FormLabel>Type</FormLabel>
            <Select {...register('type', { required: true })}>
              <option value="">Select Type</option>
              <option value="daily">Daily</option>
            </Select>
          </FormControl>
          <FormControl
            mb="4"
            id="currency"
            isInvalid={errors?.currency ? true : false}
          >
            <FormLabel>Currency</FormLabel>
            <Select {...register('currency', { required: true })}>
              <option value="">Select Currency</option>
              <option value="IDR">IDR</option>
            </Select>
          </FormControl>
          <FormControl
            mb="4"
            id="total"
            isInvalid={errors?.total ? true : false}
          >
            <FormLabel>Total</FormLabel>
            <Input
              type="number"
              min={0}
              placeholder="Total"
              {...register(`total`, {
                required: true,
              })}
            />
          </FormControl>
          <FormControl mb="4" id="date" isInvalid={errors?.date ? true : false}>
            <FormLabel>Date</FormLabel>
            <Input
              type="date"
              placeholder="Date"
              {...register(`date`, {
                required: true,
              })}
            />
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
