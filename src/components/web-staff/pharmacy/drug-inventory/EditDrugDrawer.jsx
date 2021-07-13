import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  Input,
  Textarea,
  useToast,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  FormLabel,
  FormErrorMessage,
  DrawerFooter,
  Select,
} from '@chakra-ui/react';
import { useMutation, useQueryClient } from 'react-query';
import { useCookies } from 'react-cookie';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { editDrug } from '../../../../api/pharmacy-services/drug';
import { InputDate } from '../../../../components/shared/input';
import { drugType } from '../../../../data/drugType';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  price: yup
    .number()
    .positive('Price must be greater than 0')
    .required('Price is required')
    .typeError('Price must be a number'),
  expired: yup.string().required('Expired date is required'),
  type: yup.string().required('Type is required'),
  quantity: yup
    .number()
    .min(0)
    .required('Quantity is required')
    .typeError('Quantity must be a number'),
  description: yup.string(),
});

export const EditDrugDrawer = ({ isOpen, onClose, selectedDrug }) => {
  const toast = useToast();
  const [, setErrMessage] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [cookies] = useCookies(['token']);
  const queryClient = useQueryClient();

  useEffect(() => {
    reset({
      name: selectedDrug?.name,
      type: selectedDrug?.type,
      price: selectedDrug?.price,
      expired: new Date(selectedDrug?.expired),
      quantity: selectedDrug?.quantity,
      description: selectedDrug?.description,
    });
  }, [selectedDrug, reset]);

  const { mutate } = useMutation(editDrug(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries('drugs');
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          position: 'top-right',
          title: 'Success',
          description: `Drug edited successfully`,
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
    const drug = {
      id: selectedDrug?.id,
      name: values.name,
      type: values.type,
      price: values.price,
      expired: values.expired,
      quantity: values.quantity,
      description: values.description,
    };
    // console.log({ drug });
    await mutate(drug);
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm" sele>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Edit Drug</DrawerHeader>

          <DrawerBody>
            <Box as="form" onSubmit={handleSubmit(onSubmit)}>
              <FormControl
                id="name"
                mb="4"
                isInvalid={errors?.name ? true : false}
              >
                <FormLabel>Name</FormLabel>
                <Input
                  defaultValue={selectedDrug?.name || ''}
                  {...register('name')}
                />
                <FormErrorMessage>
                  {errors.name && errors.name.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                id="type"
                mb="4"
                isInvalid={errors?.type ? true : false}
              >
                <FormLabel>Type</FormLabel>
                {/* <Input
                  defaultValue={selectedDrug?.type || ''}
                  {...register('type', { required: 'Drug Type is required' })}
                /> */}
                <Select
                  defaultValue={selectedDrug?.type || ''}
                  {...register('type')}
                >
                  <option value="">Select type</option>
                  {Object.entries(drugType).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>
                  {errors.type && errors.type.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                id="price"
                mb="4"
                isInvalid={errors?.price ? true : false}
              >
                <FormLabel>Price</FormLabel>
                <Input
                  type="number"
                  defaultValue={selectedDrug?.price || ''}
                  {...register('price')}
                />
                <FormErrorMessage>
                  {errors.price && errors.price.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                id="expired"
                mb="4"
                isInvalid={errors?.expired ? true : false}
              >
                <FormLabel>Expired</FormLabel>
                {/* <Input
                  defaultValue={selectedDrug?.expired?.split('T')[0] || ''}
                  {...register('expired', { required: 'Expired is required' })}
                /> */}
                <InputDate
                  name="expired"
                  control={control}
                  placeholder="Expired"
                  selectYearMode
                  startYear={2021}
                  endYear={new Date().getFullYear() + 30}
                  dayPickerProps={{
                    disabledDays: { before: new Date() },
                  }}
                  defaultValue={new Date(selectedDrug?.expired)}
                />
                <FormErrorMessage>
                  {errors.expired && errors.expired.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                id="quantity"
                mb="4"
                isInvalid={errors?.quantity ? true : false}
              >
                <FormLabel>Quantity</FormLabel>
                <Input
                  type="number"
                  defaultValue={selectedDrug?.quantity || ''}
                  {...register('quantity')}
                />
                <FormErrorMessage>
                  {errors.quantity && errors.quantity.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl id="description" mb="4">
                <FormLabel>Description</FormLabel>
                <Textarea
                  defaultValue={selectedDrug?.description || ''}
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
