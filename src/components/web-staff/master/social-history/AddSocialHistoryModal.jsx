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

import { createSocialHistories } from '../../../../api/master-data-services/social-histories';

export const AddSocialHistoryModal = ({ isOpen, onClose }) => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [isLoading, setIsLoading] = useState(false);
  const [, setErrMessage] = useState('');
  const { register, handleSubmit, reset, clearErrors, control } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'socialHistories',
  });
  const queryClient = useQueryClient();

  const { mutate } = useMutation(createSocialHistories(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries('master-social-histories');
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          position: 'top-right',
          title: 'Success',
          description: `Social history berhasil ditambahkan`,
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
    const socialHistories = values.socialHistories.map(val => {
      return {
        name: val.name,
        default_value: val.default_value.split(',').map(dv => dv.trim()),
      };
    });

    const data = {
      data: socialHistories,
    };

    await mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Social Histories</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mb="2">
            {fields.map(({ id }, index) => {
              return (
                <Flex key={id} mb="2">
                  <Box flexGrow="1">
                    <VisuallyHidden as="label">Social History</VisuallyHidden>
                    <HStack>
                      <FormControl
                        id={`social-history-name-${index}`}
                        maxW="52"
                      >
                        <Input
                          placeholder="name"
                          mr="2"
                          {...register(`socialHistories[${index}].name`)}
                        />
                      </FormControl>
                      <FormControl
                        id={`social-history-value-${index}`}
                        flexGrow="1"
                      >
                        <Input
                          placeholder="default value (separate with commas)"
                          mr="2"
                          {...register(
                            `socialHistories[${index}].default_value`
                          )}
                        />
                      </FormControl>
                    </HStack>
                  </Box>
                  <IconButton
                    ml="2"
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
              Add Social History
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
