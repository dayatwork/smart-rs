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
  getLaboratoryCategories,
  editLaboratorySubCategory,
} from '../../../../api/master-data-services/laboratory-category';

export const EditLaboratorySubCategoryDrawer = ({
  isOpen,
  onClose,
  selectedSubCategory,
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
      category: selectedSubCategory?.laboratory_category_id,
      name: selectedSubCategory?.name,
      unit: selectedSubCategory?.unit,
      range: selectedSubCategory?.range,
    });
  }, [selectedSubCategory, reset]);

  const { data: dataCategories } = useQuery(
    'master-laboratory-categories',
    () => getLaboratoryCategories(cookies)
  );

  const { mutate } = useMutation(editLaboratorySubCategory(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);

      if (data) {
        await queryClient.invalidateQueries('master-laboratory-subcategories');
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          title: 'Success',
          description: `Laboratory Sub Category berhasil diedit`,
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
    const laboratorySubCategory = {
      id: selectedSubCategory?.id,
      name: values.name,
      laboratory_category_id: values.category,
      unit: values.unit,
      range: values.range,
    };
    await mutate(laboratorySubCategory);
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
          <DrawerHeader>Edit Laboratory Sub Category</DrawerHeader>

          <DrawerBody>
            <Box as="form" onSubmit={handleSubmit(onSubmit)}>
              <FormControl
                id="type"
                mb="8"
                isInvalid={errors?.category ? true : false}
              >
                <FormLabel>Category</FormLabel>
                <Select
                  {...register('category', {
                    required: 'Category is required',
                  })}
                >
                  <option value="">Select Category</option>
                  {dataCategories?.data?.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>
                  {errors.category && errors.category.message}
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
              <FormControl
                id="unit"
                mb="8"
                isInvalid={errors?.unit ? true : false}
              >
                <FormLabel>Unit</FormLabel>
                <Input
                  {...register('unit', { required: 'Unit is required' })}
                />
                <FormErrorMessage>
                  {errors.unit && errors.unit.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                id="range"
                mb="8"
                isInvalid={errors?.range ? true : false}
              >
                <FormLabel>Range</FormLabel>
                <Input
                  {...register('range', { required: 'Range is required' })}
                />
                <FormErrorMessage>
                  {errors.range && errors.range.message}
                </FormErrorMessage>
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
