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
  HStack,
} from '@chakra-ui/react';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';
import { useMutation, useQueryClient } from 'react-query';
import { useCookies } from 'react-cookie';
import { useForm, useFieldArray } from 'react-hook-form';

import { createDivision } from '../../../../api/institution-services/division';

export const AddDivisionModal = ({ isOpen, onClose, selectedInstitution }) => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [isLoading, setIsLoading] = useState(false);
  const [, setErrMessage] = useState('');
  const { register, handleSubmit, reset, clearErrors, control } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'divisions',
  });
  const queryClient = useQueryClient();

  const { mutate } = useMutation(createDivision(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries('divisions');
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          title: 'Success',
          description: `Divisi berhasil dibuat`,
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
    const divisions = {
      institution_id: selectedInstitution,
      data: values.divisions,
    };
    await mutate(divisions);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Division</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mb="2">
            {fields.map(({ id }, index) => {
              return (
                <Flex key={id}>
                  <HStack>
                    <VisuallyHidden as="label">Division</VisuallyHidden>
                    <FormControl id={`division-name-${index}`}>
                      <Input
                        placeholder="name"
                        mr="2"
                        {...register(`divisions[${index}].name`)}
                      />
                    </FormControl>
                    <FormControl id={`division-description-${index}`}>
                      <Input
                        placeholder="description"
                        mr="2"
                        {...register(`divisions[${index}].description`)}
                      />
                    </FormControl>
                  </HStack>
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
              Add Division
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
