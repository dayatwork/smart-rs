import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  useToast,
  Input,
  Textarea,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  FormErrorMessage,
  DrawerFooter,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useCookies } from 'react-cookie';
import { useMutation, useQueryClient } from 'react-query';

import { updateInfrastructureType } from '../../../../../api/institution-services/infrastructure';

export const EditInfrastructureTypeDrawer = ({
  isOpen,
  onClose,
  selectedInfrastructureType,
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

  useEffect(() => {
    reset({
      name: selectedInfrastructureType?.name,
      description: selectedInfrastructureType?.description,
    });
  }, [selectedInfrastructureType, reset]);

  const { mutate } = useMutation(updateInfrastructureType(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries('infrastructure-types');
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          title: 'Success',
          description: `Infrastructure type updated`,
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
    const infraType = {
      id: selectedInfrastructureType?.id,
      name: values.name,
      description: values.description,
    };
    await mutate(infraType);
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm" sele>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Edit Infrastructure Type</DrawerHeader>

          <DrawerBody>
            <Box as="form" onSubmit={handleSubmit(onSubmit)}>
              <FormControl
                id="name"
                mb="8"
                isInvalid={errors?.name ? true : false}
              >
                <FormLabel>Name</FormLabel>
                <Input
                  defaultValue={selectedInfrastructureType?.name || ''}
                  {...register('name', { required: 'Name is required' })}
                />
                <FormErrorMessage>
                  {errors.name && errors.name.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl id="name" mb="8">
                <FormLabel>Description</FormLabel>
                <Textarea
                  defaultValue={selectedInfrastructureType?.description || ''}
                  {...register('description')}
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
