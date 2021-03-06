import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
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

import { createICD10 } from '../../../../api/master-data-services/icd10';

export const AddICD10Modal = ({ isOpen, onClose }) => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [isLoading, setIsLoading] = useState(false);
  const [, setErrMessage] = useState('');
  const { register, handleSubmit, reset, clearErrors, control } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'icd10',
  });
  const queryClient = useQueryClient();

  const { mutate } = useMutation(createICD10(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries('icd-10');
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          position: 'top-right',
          title: 'Success',
          description: `ICD 10 berhasil ditambahkan`,
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
    const icd10 = {
      data: values.icd10,
    };
    await mutate(icd10);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New ICD 10</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mb="2">
            {fields.map(({ id }, index) => {
              return (
                <Flex key={id}>
                  <FormControl id={`code-${index}`} mb="1" maxW="32" mr="2">
                    <VisuallyHidden as="label">Code</VisuallyHidden>
                    <Input
                      placeholder="Code"
                      {...register(`icd10[${index}].code`)}
                    />
                  </FormControl>
                  <FormControl id={`code-${index}`} mb="1" mr="2">
                    <VisuallyHidden as="label">Name</VisuallyHidden>
                    <Textarea
                      placeholder="Name"
                      rows={2}
                      {...register(`icd10[${index}].name`)}
                    />
                  </FormControl>
                  <FormControl id={`code-${index}`} mb="1" mr="2">
                    <VisuallyHidden as="label">Name - ID</VisuallyHidden>
                    <Textarea
                      placeholder="Name (Indonesia)"
                      rows={2}
                      {...register(`icd10[${index}].name_id`)}
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
              Add ICD 10
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
