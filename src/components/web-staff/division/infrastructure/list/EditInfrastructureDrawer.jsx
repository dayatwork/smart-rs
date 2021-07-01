import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Select,
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
import { useQuery, useMutation, useQueryClient } from 'react-query';

import {
  getInfrastructureTypes,
  updateInfrastructure,
} from '../../../../../api/institution-services/infrastructure';
import { getDepartments } from '../../../../../api/institution-services/department';

export const EditInfrastructureDrawer = ({
  isOpen,
  onClose,
  selectedInfrastructure,
  selectedInstitution,
}) => {
  const toast = useToast();
  const [, setErrMessage] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [cookies] = useCookies(['token']);
  const queryClient = useQueryClient();
  const statusWatch = watch('status', selectedInfrastructure?.status);

  useEffect(() => {
    reset({
      infrastructure_type_id: selectedInfrastructure?.infrastructure_type_id,
      department_id: selectedInfrastructure?.department_id,
      name: selectedInfrastructure?.name,
      description: selectedInfrastructure?.description,
      status: selectedInfrastructure?.status,
      status_reason: selectedInfrastructure?.status_reason,
    });
  }, [selectedInfrastructure, reset]);

  const {
    data: dataInfrastructureTypes,
    isSuccess: isSuccessInfrastructureTypes,
  } = useQuery(
    'infrastructure-types',
    () => getInfrastructureTypes(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution) }
  );

  const { data: dataDepartments, isSuccess: isSuccessDepartments } = useQuery(
    'departments',
    () => getDepartments(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution) }
  );

  const { mutate } = useMutation(updateInfrastructure(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries('infrastructures');
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          position: 'top-right',
          title: 'Success',
          description: `Infrastructure updated`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      }

      if (error) {
        setErrMessage(error.message || 'Error');
        toast({
          position: 'top-right',
          title: 'Error',
          description: `Infrastructure updated error`,
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
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
    const {
      infrastructure_type_id,
      department_id,
      name,
      description,
      status,
      status_reason,
    } = values;

    const data = {
      id: selectedInfrastructure.id,
      infrastructure_type_id,
      department_id,
      name,
      description,
      status,
      status_reason: status === 'active' ? '' : status_reason,
    };

    await mutate(data);
  };

  // console.log({ selectedInfrastructure });

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Edit Infrastructure Type</DrawerHeader>

          <DrawerBody>
            <Box as="form" onSubmit={handleSubmit(onSubmit)}>
              <FormControl id="type" mb="4">
                <FormLabel>Type</FormLabel>
                <Select {...register('infrastructure_type_id')}>
                  <option value="">Select Infrastructure Type</option>
                  {isSuccessInfrastructureTypes &&
                    dataInfrastructureTypes?.data?.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                </Select>
              </FormControl>
              <FormControl id="department" mb="4">
                <FormLabel>Deparment</FormLabel>
                <Select {...register('department_id')}>
                  <option value="">Select Deparment</option>
                  {isSuccessDepartments &&
                    dataDepartments?.data?.map(deparment => (
                      <option key={deparment.id} value={deparment.id}>
                        {deparment.name}
                      </option>
                    ))}
                </Select>
              </FormControl>
              <FormControl
                id="name"
                mb="4"
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
              <FormControl id="description" mb="4">
                <FormLabel>Description</FormLabel>
                <Textarea {...register('description')} />
              </FormControl>
              <FormControl id="status" mb="4">
                <FormLabel>Status</FormLabel>
                <Select {...register('status')}>
                  <option value="">Select Status</option>
                  <option value="active">Active</option>
                  <option value="deactivated">Not Active</option>
                </Select>
              </FormControl>
              {statusWatch === 'deactivated' ? (
                <FormControl id="status_reason" mb="4">
                  <FormLabel>Status Reason</FormLabel>
                  <Textarea {...register('status_reason')} />
                </FormControl>
              ) : null}
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
