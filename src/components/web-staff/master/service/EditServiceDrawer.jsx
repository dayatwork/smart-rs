import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Select,
} from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useCookies } from 'react-cookie';
import { useForm } from 'react-hook-form';

import {
  getServiceTypes,
  editService,
} from '../../../../api/master-data-services/service';

export const EditServiceDrawer = ({ isOpen, onClose, selectedService }) => {
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
      service_type_id: selectedService?.service_type_id,
      name: selectedService?.name,
      description: selectedService?.description,
    });
  }, [selectedService, reset]);

  const { data: dataServiceTypes } = useQuery(
    'master-service-types',
    () => getServiceTypes(cookies),
    { staleTime: Infinity }
  );

  const { mutate } = useMutation(editService(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);

      if (data) {
        await queryClient.invalidateQueries('master-services');
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          title: 'Success',
          description: `Service edited successfully`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        onClose();
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
    const service = {
      id: selectedService?.id,
      name: values.name,
      service_type_id: values.service_type_id,
      description: values.description,
    };
    await mutate(service);
  };

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={() => {
        reset({});
        clearErrors();
        onClose();
      }}
      size="sm"
      sele
    >
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Edit Service</DrawerHeader>

          <DrawerBody>
            <Box as="form" onSubmit={handleSubmit(onSubmit)}>
              <FormControl
                id="type"
                mb="8"
                isInvalid={errors?.service_type_id ? true : false}
              >
                <FormLabel>Service Type</FormLabel>
                <Select
                  {...register('service_type_id', {
                    required: 'Service type is required',
                  })}
                >
                  <option value="">Select Service Type</option>
                  {dataServiceTypes?.data?.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>
                  {errors.service_type_id && errors.service_type_id.message}
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
