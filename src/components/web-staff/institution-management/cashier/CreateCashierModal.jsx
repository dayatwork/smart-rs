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
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';

import { createCashier } from '../../../../api/institution-services/cashier';

export const CreateCashierModal = ({
  isOpen,
  onClose,
  selectedInstitution,
}) => {
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
    name: 'objectives',
  });
  const queryClient = useQueryClient();

  const { mutate } = useMutation(createCashier(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries('cashiers');
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          position: 'top-right',
          title: 'Success',
          description: `Kasir berhasil ditambahkan`,
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
    const cashiers = {
      institution_id: selectedInstitution,
      data: values.cashiers.map(cashier => ({
        ...cashier,
        user_id: null,
        icon: null,
      })),
    };
    await mutate(cashiers);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Cashier</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mb="2">
            {fields.map(({ id }, index) => {
              return (
                <Flex key={id} mb="2">
                  {/* <HStack> */}
                  <FormControl
                    id={`cashier-name-${index}`}
                    isInvalid={
                      errors?.cashiers && errors?.cashiers[index]?.name
                        ? true
                        : false
                    }
                  >
                    <VisuallyHidden as="label">Name</VisuallyHidden>
                    <Input
                      placeholder="Name"
                      mr="2"
                      {...register(`cashiers[${index}].name`, {
                        required: true,
                      })}
                    />
                  </FormControl>
                  <FormControl
                    id={`cashier-description-${index}`}
                    ml="2"
                    isInvalid={
                      errors?.cashiers && errors?.cashiers[index]?.description
                        ? true
                        : false
                    }
                  >
                    <VisuallyHidden as="label">Description</VisuallyHidden>
                    <Input
                      placeholder="Description"
                      mr="2"
                      {...register(`cashiers[${index}].description`, {
                        required: true,
                      })}
                    />
                  </FormControl>
                  <IconButton
                    ml="2"
                    onClick={() => remove(index)}
                    icon={<FaTrashAlt />}
                    p="3"
                    colorScheme="red"
                  />
                  {/* </HStack> */}
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
              Add Cashier
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
