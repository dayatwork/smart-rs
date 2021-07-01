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
  Input,
  useToast,
  Flex,
  VisuallyHidden,
  IconButton,
  Select,
} from '@chakra-ui/react';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useCookies } from 'react-cookie';
import { useForm, useFieldArray } from 'react-hook-form';

import {
  getLaboratoryCategories,
  createLaboratorySubCategory,
} from '../../../../api/master-data-services/laboratory-category';

export const AddLaboratorySubCategoryModal = ({ isOpen, onClose }) => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [isLoading, setIsLoading] = useState(false);
  const [, setErrMessage] = useState('');
  const { register, handleSubmit, reset, clearErrors, control } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'subcategories',
  });
  const queryClient = useQueryClient();

  const { data: dataCategories } = useQuery(
    'master-laboratory-categories',
    () => getLaboratoryCategories(cookies)
  );

  const { mutate } = useMutation(createLaboratorySubCategory(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries('master-laboratory-subcategories');
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          position: 'top-right',
          title: 'Success',
          description: `Laboratory Sub Category berhasil ditambahkan`,
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
    const subcategories = {
      data: values.subcategories,
    };
    await mutate(subcategories);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Laboratory Sub Category</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mb="2">
            {fields.map(({ id }, index) => {
              return (
                <Flex key={id}>
                  <FormControl id={`category-${index}`} mb="1" mr="1">
                    <VisuallyHidden as="label">Category</VisuallyHidden>
                    <Select
                      mr="2"
                      {...register(
                        `subcategories[${index}].laboratory_category_id`
                      )}
                    >
                      <option value="">Select Category</option>
                      {dataCategories?.data?.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl id={`name-${index}`} mb="1" mr="1">
                    <VisuallyHidden as="label">Name</VisuallyHidden>
                    <Input
                      placeholder="Name"
                      mr="2"
                      {...register(`subcategories[${index}].name`)}
                    />
                  </FormControl>
                  <FormControl id={`unit-${index}`} mb="1" mr="1">
                    <VisuallyHidden as="label">Unit</VisuallyHidden>
                    <Input
                      placeholder="Unit"
                      mr="2"
                      {...register(`subcategories[${index}].unit`)}
                    />
                  </FormControl>
                  <FormControl id={`range-${index}`} mb="1" mr="1">
                    <VisuallyHidden as="label">Range</VisuallyHidden>
                    <Input
                      placeholder="Range"
                      mr="2"
                      {...register(`subcategories[${index}].range`)}
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
