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

import { createFMS } from '../../../../api/institution-services/fms';

export const AddFmsModal = ({ isOpen, onClose, selectedInstitution }) => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [isLoading, setIsLoading] = useState(false);
  const [, setErrMessage] = useState('');
  const { register, handleSubmit, reset, clearErrors, control } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'fms',
  });
  const queryClient = useQueryClient();

  const { mutate } = useMutation(createFMS(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries('fms');
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          title: 'Success',
          description: `SMF berhasil dibuat`,
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
    const fms = {
      institution_id: selectedInstitution,
      data: values.fms,
    };
    await mutate(fms);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New FMS</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mb="2">
            {fields.map(({ id }, index) => {
              return (
                <Flex key={id} mb="2">
                  <HStack>
                    <VisuallyHidden as="label">FMS</VisuallyHidden>
                    <FormControl id={`fms-name-${index}`}>
                      <Input
                        placeholder="name"
                        mr="2"
                        {...register(`fms[${index}].name`)}
                      />
                    </FormControl>
                    <FormControl id={`fms-description-${index}`}>
                      <Input
                        placeholder="description"
                        mr="2"
                        {...register(`fms[${index}].description`)}
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
              Add FMS
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
