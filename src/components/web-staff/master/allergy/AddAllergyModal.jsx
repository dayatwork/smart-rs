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
  Select,
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';

import { createAllergies } from '../../../../api/master-data-services/allergies';

export const AddAllergyModal = ({ isOpen, onClose }) => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [isLoading, setIsLoading] = useState(false);
  const [, setErrMessage] = useState('');
  const { register, handleSubmit, reset, clearErrors, control } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'allergies',
  });
  const queryClient = useQueryClient();

  const { mutate } = useMutation(createAllergies(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries('master-allergies');
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          title: 'Success',
          description: `Alergi berhasil ditambahkan`,
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
    const allergies = {
      data: values.allergies,
    };
    await mutate(allergies);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Allergies</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mb="2">
            {fields.map(({ id }, index) => {
              return (
                <Flex key={id}>
                  <FormControl id="allergies" mb="1">
                    <VisuallyHidden as="label">Allergies</VisuallyHidden>
                    <Flex>
                      {/* <Input
                        placeholder="type"
                        ref={register()}
                        name={`allergies[${index}].type`}
                        mr="2"
                      /> */}
                      <Select mr="2" {...register(`allergies[${index}].type`)}>
                        <option>Select allergy type</option>
                        <option value="Food">Food</option>
                        <option value="Drugs">Drugs</option>
                        <option value="Others">Others</option>
                      </Select>
                      <Input
                        placeholder="name"
                        mr="2"
                        {...register(`allergies[${index}].name`)}
                      />
                    </Flex>
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
              Add allergy
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
