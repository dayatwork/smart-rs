import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Spinner,
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
  Center,
} from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useCookies } from 'react-cookie';
import { useForm } from 'react-hook-form';

import {
  getRadiologyCategories,
  getRadiologySubCategories,
  editRadiologySubCategory,
} from '../../../../api/master-data-services/radiology-category';

export const EditRadiologySubCategoryDrawer = ({
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
    watch,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [cookies] = useCookies(['token']);
  const queryClient = useQueryClient();
  const categoryWatch = watch(
    'category',
    selectedSubCategory?.radiology_category_id
  );

  useEffect(() => {
    reset({
      name: selectedSubCategory?.name,
      category: selectedSubCategory?.radiology_category_id,
      parent: selectedSubCategory?.parent_id,
    });
  }, [selectedSubCategory, reset]);

  const { data: dataCategories } = useQuery('master-radiology-categories', () =>
    getRadiologyCategories(cookies)
  );

  const { data: dataSubCategories, isLoading: isLoadingCategories } = useQuery(
    ['master-radiology-subcategories', categoryWatch],
    () => getRadiologySubCategories(cookies, categoryWatch),
    {
      enabled: Boolean(categoryWatch),
    }
  );

  const { mutate } = useMutation(editRadiologySubCategory(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries('master-radiology-subcategories');
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          position: 'top-right',
          title: 'Success',
          description: `Radiology Sub Category berhasil diedit`,
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
    const radiologySubCategory = {
      id: selectedSubCategory?.id,
      name: values.name,
      radiology_category_id: values.category,
      parent_id: values.parent ? values.parent : null,
    };

    await mutate(radiologySubCategory);
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm" sele>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Edit Radiology Sub Category</DrawerHeader>

          <DrawerBody>
            <Box as="form" onSubmit={handleSubmit(onSubmit)}>
              <FormControl
                id="subcategory"
                mb="8"
                isInvalid={errors?.name ? true : false}
              >
                <FormLabel>Sub Category Name</FormLabel>
                <Input
                  {...register('name', { required: 'Name is required' })}
                />
                <FormErrorMessage>
                  {errors.name && errors.name.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                id="category"
                mb="8"
                isInvalid={errors?.category ? true : false}
              >
                <FormLabel>Category</FormLabel>
                <Select
                  {...register('category', {
                    required: 'Category is required',
                  })}
                  onChange={async () =>
                    await queryClient.invalidateQueries([
                      'master-radiology-subcategories',
                      categoryWatch,
                    ])
                  }
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
              <FormControl id="parent" mb="8">
                <FormLabel>Parent</FormLabel>
                {isLoadingCategories ? (
                  <Center>
                    <Spinner />
                  </Center>
                ) : (
                  <Select {...register('parent')}>
                    <option value="">Select Category</option>
                    {dataSubCategories?.data
                      ?.filter(
                        subCategory => subCategory.id !== selectedSubCategory.id
                      )
                      .map(subCategory => (
                        <option key={subCategory.id} value={subCategory.id}>
                          {subCategory.name}
                        </option>
                      ))}
                  </Select>
                )}
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
