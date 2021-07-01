import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  FormControl,
  FormLabel,
  Input,
  HStack,
  Checkbox,
  Textarea,
  useToast,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useCookies } from 'react-cookie';
import { useMutation, useQueryClient } from 'react-query';

import { createApplication } from '../../../../api/application-services/application';

export const AddApplicationModal = ({ isOpen, onClose }) => {
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

  const { mutate } = useMutation(createApplication(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries('master-application');
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          position: 'top-right',
          title: 'Success',
          description: `Applikasi berhasil dibuat`,
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
    const platform = values.platform.filter(plat => plat !== false);
    const application = {
      name: values.name,
      platform,
      description: values.description,
    };

    await mutate(application);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Application</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <FormControl
              id="name"
              mb="8"
              isInvalid={errors?.name ? true : false}
            >
              <FormLabel>Application Name</FormLabel>
              <Input
                {...register('name', { required: 'Application name required' })}
              />
              <FormErrorMessage>
                {errors.name && errors.name.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl id="platform" mb="8">
              <FormLabel>Platform</FormLabel>
              <HStack spacing="10">
                <Checkbox
                  colorScheme="purple"
                  value="website"
                  {...register('platform[0]')}
                >
                  Website
                </Checkbox>
                <Checkbox
                  colorScheme="purple"
                  value="mobile"
                  {...register('platform[1]')}
                >
                  Mobile
                </Checkbox>
                <Checkbox
                  colorScheme="purple"
                  value="desktop"
                  {...register('platform[2]')}
                >
                  Desktop
                </Checkbox>
              </HStack>
              <FormErrorMessage>
                {errors.platform && errors.platform.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl id="description" mb="8">
              <FormLabel>Description</FormLabel>
              <Textarea {...register('description')} />
            </FormControl>
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
