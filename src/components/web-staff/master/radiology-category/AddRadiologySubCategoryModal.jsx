import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Input,
  useToast,
  Flex,
  VisuallyHidden,
  IconButton,
  Select,
  Center,
} from '@chakra-ui/react';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useCookies } from 'react-cookie';
import { useForm, useFieldArray } from 'react-hook-form';

import {
  getRadiologyCategories,
  getRadiologySubCategories,
  createRadiologySubCategory,
} from '../../../../api/master-data-services/radiology-category';

export const AddRadiologySubCategoryModal = ({ isOpen, onClose }) => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [isLoading, setIsLoading] = useState(false);
  const [, setErrMessage] = useState('');
  const { register, handleSubmit, reset, clearErrors, control, watch } =
    useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'subcategories',
  });
  const queryClient = useQueryClient();

  const { data: dataCategories, isLoading: isLoadingCategories } = useQuery(
    'master-radiology-categories',
    () => getRadiologyCategories(cookies)
  );

  const { mutate } = useMutation(createRadiologySubCategory(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries('radiology-subcategories');
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          position: 'top-right',
          title: 'Success',
          description: `Radiology Sub Category berhasil ditambahkan`,
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
    const subcategories = values.subcategories.map(sub => {
      if (!sub.parent_id) {
        return { ...sub, parent_id: null };
      }
      return sub;
    });

    await mutate({ data: subcategories });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Radiology Sub Category</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mb="2">
            {fields.map(({ id }, index) => {
              return (
                <AddSubCategoryField
                  key={id}
                  dataCategories={dataCategories}
                  index={index}
                  register={register}
                  remove={remove}
                  watch={watch}
                  isLoadingCategories={isLoadingCategories}
                />
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
              Add Sub Category
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

const AddSubCategoryField = ({
  register,
  dataCategories,
  index,
  remove,
  watch,
}) => {
  const [cookies] = useCookies(['token']);
  const categoryWatch = watch('subcategories');

  const {
    data: dataSubCategories,
    isSuccess,
    isLoading,
  } = useQuery(
    [
      'master-radiology-subcategories',
      categoryWatch[index]?.radiology_category_id,
    ],
    () =>
      getRadiologySubCategories(
        cookies,
        categoryWatch[index]?.radiology_category_id
      ),
    {
      enabled: Boolean(categoryWatch[index]?.radiology_category_id),
    }
  );

  return (
    <Flex>
      <FormControl id={`category-${index}`} mb="1" mr="1">
        <VisuallyHidden as="label">Category</VisuallyHidden>
        <Select
          mr="2"
          {...register(`subcategories[${index}].radiology_category_id`)}
        >
          <option value="">Select Category</option>
          {dataCategories?.data?.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </FormControl>

      <FormControl id={`parent-${index}`} mb="1" mr="1">
        <VisuallyHidden as="label">Parent</VisuallyHidden>
        {isLoading && (
          <Center>
            <Spinner />
          </Center>
        )}
        {isSuccess && (
          <Select mr="2" {...register(`subcategories[${index}].parent_id`)}>
            <option value="">Select Parent Sub Category</option>
            {dataSubCategories?.data?.map(subcategory => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </Select>
        )}
      </FormControl>
      <FormControl id={`name-${index}`} mb="1" mr="1">
        <VisuallyHidden as="label">Name</VisuallyHidden>
        <Input
          mr="2"
          placeholder="Name"
          {...register(`subcategories[${index}].name`)}
        />
      </FormControl>
      <IconButton
        onClick={() => remove(index)}
        icon={<FaTrashAlt />}
        p="3"
        colorScheme="red"
      />
    </Flex>
  );
};
