import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Input,
  useToast,
  Flex,
  VisuallyHidden,
  IconButton,
  Textarea,
} from '@chakra-ui/react';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';
import { useMutation, useQueryClient } from 'react-query';
import { useCookies } from 'react-cookie';
import { useForm, useFieldArray } from 'react-hook-form';
import slugify from 'slugify';

import { createPaymentMethod } from '../../../../api/master-data-services/payment-method';

export const AddPaymentMethodModal = ({ isOpen, onClose }) => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
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
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'paymentMethods',
  });
  const queryClient = useQueryClient();

  const { mutate } = useMutation(createPaymentMethod(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries('master-payment-methods');
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          title: 'Success',
          description: `Payment method added successfully`,
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

  const onSubmit = async (values) => {
    const data = values.paymentMethods.map((paymentMethod) => ({
      name: paymentMethod.name,
      alias: slugify(paymentMethod.name, { lower: true }),
      description: paymentMethod.description,
    }));
    const paymentMethods = {
      data,
    };
    await mutate(paymentMethods);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Payment Method</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mb="2">
            {fields.map(({ id }, index) => {
              return (
                <Flex key={id}>
                  <FormControl
                    id={`name-${index}`}
                    mb="1"
                    mr="2"
                    isInvalid={errors?.name ? true : false}>
                    <VisuallyHidden as="label">Name</VisuallyHidden>
                    <Input
                      placeholder="Name"
                      {...register(`paymentMethods[${index}].name`, {
                        required: 'Name is required',
                      })}
                    />
                    <FormErrorMessage>
                      {errors.name && errors.name.message}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl id={`description-${index}`} mb="1" mr="2">
                    <VisuallyHidden as="label">Description</VisuallyHidden>
                    <Textarea
                      placeholder="Description"
                      rows={1}
                      {...register(`paymentMethods[${index}].description`)}
                    />
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
          </Box>
          <Box textAlign="center">
            <Button
              leftIcon={<FaPlus />}
              type="button"
              onClick={() => append({})}
              // w="full"
            >
              Add Payment Method
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
            onClick={handleSubmit(onSubmit)}>
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
