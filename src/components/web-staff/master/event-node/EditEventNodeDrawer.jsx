import React, { useState, useEffect } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Box,
  FormControl,
  FormLabel,
  Select,
  Input,
  FormErrorMessage,
  useToast,
} from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useCookies } from 'react-cookie';
import { useForm } from 'react-hook-form';

import { getApplications } from '../../../../api/application-services/application';
import { editEventNode } from '../../../../api/application-services/event-node';

export const EditEventNodeDrawer = ({ isOpen, onClose, selectedEventNode }) => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [isLoading, setIsLoading] = useState(false);
  const [, setErrMessage] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm();
  const queryClient = useQueryClient();

  useEffect(() => {
    reset({
      app_id: selectedEventNode?.app_id,
      name: selectedEventNode?.name,
      description: selectedEventNode?.description,
      path: selectedEventNode?.path,
    });
  }, [selectedEventNode, reset]);

  const { data: dataApp } = useQuery('master-application', () =>
    getApplications(cookies)
  );

  const { mutate } = useMutation(editEventNode(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries('master-event-nodes');
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          title: 'Success',
          description: `Event node berhasil diedit`,
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
    const { app_id, name, description, path } = values;
    const data = {
      id: selectedEventNode?.id,
      app_id,
      name,
      description,
      path,
    };
    await mutate(data);
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Edit Event Node</DrawerHeader>

          <DrawerBody>
            <Box as="form">
              <FormControl
                id="application"
                mb="4"
                isInvalid={errors?.app_id ? true : false}
              >
                <FormLabel>Application</FormLabel>
                <Select
                  {...register('app_id', { required: 'Application required' })}
                >
                  <option value="">Select Application</option>
                  {dataApp?.data?.map(app => (
                    <option key={app.id} value={app.id}>
                      {app.name}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>
                  {errors.app_id && errors.app_id.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                id="name"
                mb="8"
                isInvalid={errors?.name ? true : false}
              >
                <FormLabel>Name</FormLabel>
                <Input
                  {...register('name', { required: 'Name is required' })}
                />
                <FormErrorMessage>
                  {errors.name && errors.name.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl id="description" mb="8">
                <FormLabel>Description</FormLabel>
                <Input {...register('description')} />
              </FormControl>
              <FormControl id="path" mb="8">
                <FormLabel>Path</FormLabel>
                <Input {...register('path')} />
              </FormControl>
            </Box>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="purple"
              isLoading={isLoading}
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
