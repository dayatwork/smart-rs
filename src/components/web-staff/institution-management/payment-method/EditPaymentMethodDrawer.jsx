import React, { useState, useEffect } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  Button,
  Box,
  FormControl,
  FormLabel,
  useToast,
  FormErrorMessage,
  Switch,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useCookies } from 'react-cookie';
import { useMutation, useQueryClient } from 'react-query';

import { updatePaymentMethod } from '../../../../api/institution-services/payment-method';

export const EditPaymentMethodDrawer = ({
  isOpen,
  onClose,
  selectedPaymentMethod,
  selectedInstitution,
}) => {
  const toast = useToast();
  const [, setErrMessage] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [cookies] = useCookies(['token']);
  const queryClient = useQueryClient();
  const [active, setActive] = useState(selectedPaymentMethod?.active);

  useEffect(() => {
    reset({
      name: selectedPaymentMethod?.name,
      alias: selectedPaymentMethod?.alias,
      account_number: selectedPaymentMethod?.account_number,
      account_name: selectedPaymentMethod?.account_name,
      description: selectedPaymentMethod?.description,
    });
    setActive(selectedPaymentMethod?.active);
  }, [selectedPaymentMethod, reset]);

  const { mutate } = useMutation(updatePaymentMethod(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries([
          'insitution-payment-methods',
          selectedInstitution,
        ]);
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          position: 'top-right',
          title: 'Success',
          description: `Payment method edited`,
          status: 'success',
          duration: 2000,
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
    const paymentMethod = {
      id: selectedPaymentMethod?.id,
      name: values.name,
      alias: values.alias,
      account_number: values.account_number,
      account_name: values.account_name,
      description: values.description,
      active: active ? 1 : 0,
    };
    // console.log({ paymentMethod });
    await mutate(paymentMethod);
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm" sele>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Edit Payment Method</DrawerHeader>

          <DrawerBody>
            <Box as="form" onSubmit={handleSubmit(onSubmit)}>
              <FormControl
                id="name"
                mb="8"
                isInvalid={errors?.name ? true : false}
              >
                <FormLabel>Name</FormLabel>
                <Input
                  readOnly
                  variant="filled"
                  {...register('name', {
                    required: 'Name is required',
                  })}
                />
                <FormErrorMessage>
                  {errors.name && errors.name.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                id="alias"
                mb="8"
                isInvalid={errors?.alias ? true : false}
              >
                <FormLabel>Alias</FormLabel>
                <Input
                  readOnly
                  variant="filled"
                  {...register('alias', {
                    required: 'Alias is required',
                  })}
                />
                <FormErrorMessage>
                  {errors.alias && errors.alias.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                id="account_number"
                mb="8"
                isInvalid={errors?.account_number ? true : false}
              >
                <FormLabel>Account Number</FormLabel>
                <Input
                  type="number"
                  {...register('account_number', {
                    required: 'Account number is required',
                  })}
                />
                <FormErrorMessage>
                  {errors.account_number && errors.account_number.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                id="account_name"
                mb="8"
                isInvalid={errors?.account_name ? true : false}
              >
                <FormLabel>Account Name</FormLabel>
                <Input
                  {...register('account_name', {
                    required: 'Account number is required',
                  })}
                />
                <FormErrorMessage>
                  {errors.account_name && errors.account_name.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                id="description"
                mb="8"
                isInvalid={errors?.description ? true : false}
              >
                <FormLabel>Description</FormLabel>
                <Input
                  readOnly
                  variant="filled"
                  {...register('description', {
                    required: 'description is required',
                  })}
                />
                <FormErrorMessage>
                  {errors.description && errors.description.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <FormLabel htmlFor="active" mb="0">
                  Active
                </FormLabel>
                <Switch
                  id="active"
                  colorScheme="purple"
                  size="lg"
                  isChecked={active}
                  onChange={e => setActive(e.target.checked)}
                />
              </FormControl>
            </Box>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              isLoading={isLoading}
              colorScheme="purple"
              onClick={handleSubmit(onSubmit)}
            >
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
