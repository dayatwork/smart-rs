import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  // ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useToast,
  VisuallyHidden,
  HStack,
  Text,
  SimpleGrid,
  Select,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useMutation, useQueryClient } from 'react-query';
import { useCookies } from 'react-cookie';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';
import { useForm, useFieldArray } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { createDrug } from '../../../../api/pharmacy-services/drug';
import { InputDate } from '../../../../components/shared/input';
import { drugType } from '../../../../data/drugType';

const schema = yup.object().shape({
  drugs: yup.array().of(
    yup.object().shape({
      name: yup.string().required('Name is required'),
      price: yup
        .number()
        .integer('Price must be integer')
        .positive('Price must be greater than 0')
        .required('Price is required')
        .typeError('Price must be a number'),
      expired: yup.string().required('Expired date is required'),
      type: yup.string().required('Type is required'),
      quantity: yup
        .number()
        .integer('Quantity must be integer')
        .positive('Quantity must be greater than 0')
        .required('Quantity is required')
        .typeError('Quantity must be a number'),
      description: yup.string(),
    })
  ),
});

export const AddDrugModal = ({ isOpen, onClose, selectedInstitution }) => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [isLoading, setIsLoading] = useState(false);
  const [, setErrMessage] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'drugs',
  });
  const queryClient = useQueryClient();

  const { mutate } = useMutation(createDrug(cookies), {
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
          description: `Drug added successfully`,
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
    // console.log(values);
    // console.log({ selectedInstitution });
    const drugs = {
      institution_id: selectedInstitution,
      data: values.drugs,
    };

    // console.log({ drugs });
    await mutate(drugs);
  };

  // console.log({ errors });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Drug</ModalHeader>
        {/* <ModalCloseButton /> */}
        <ModalBody>
          <Box mb="2">
            <Flex mb="1">
              <SimpleGrid flexGrow="1" columns={6} fontWeight="bold">
                <Text>Name</Text>
                <Text>Price</Text>
                <Text>Expired</Text>
                <Text>Type</Text>
                <Text>Quantity</Text>
                <Text>Description</Text>
              </SimpleGrid>
              <Box w="10" />
            </Flex>

            {fields.map(({ id }, index) => {
              return (
                <HStack key={id} align="baseline">
                  <FormControl
                    id={`name-${index}`}
                    mb="1"
                    isInvalid={
                      errors?.drugs && errors?.drugs[index]?.name ? true : false
                    }
                  >
                    <VisuallyHidden as="label">Name</VisuallyHidden>
                    <Flex>
                      <Input
                        placeholder="name"
                        // mr="2"
                        {...register(`drugs[${index}].name`)}
                      />
                    </Flex>
                    <FormErrorMessage mt="1">
                      {errors.drugs && errors.drugs[index]?.name?.message}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl
                    id={`price-${index}`}
                    mb="1"
                    isInvalid={
                      errors?.drugs && errors?.drugs[index]?.price
                        ? true
                        : false
                    }
                  >
                    <VisuallyHidden as="label">Price</VisuallyHidden>
                    <Flex>
                      <Input
                        placeholder="price"
                        type="number"
                        // mr="2"
                        {...register(`drugs[${index}].price`)}
                      />
                    </Flex>
                    <FormErrorMessage mt="1">
                      {errors.drugs && errors.drugs[index]?.price?.message}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl
                    id={`expired-${index}`}
                    mb="1"
                    isInvalid={
                      errors?.drugs && errors?.drugs[index]?.expired
                        ? true
                        : false
                    }
                  >
                    <VisuallyHidden as="label">Expired</VisuallyHidden>
                    <Flex>
                      <InputDate
                        name={`drugs[${index}].expired`}
                        control={control}
                        placeholder="Expired"
                        selectYearMode
                        startYear={new Date().getFullYear()}
                        endYear={new Date().getFullYear() + 30}
                        dayPickerProps={{
                          disabledDays: { before: new Date() },
                        }}
                        defaultValue={new Date()}
                      />
                    </Flex>
                    <FormErrorMessage mt="1">
                      {errors.drugs && errors.drugs[index]?.expired?.message}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl
                    id={`type-${index}`}
                    mb="1"
                    isInvalid={
                      errors?.drugs && errors?.drugs[index]?.type ? true : false
                    }
                  >
                    <VisuallyHidden as="label">Type</VisuallyHidden>
                    <Flex>
                      {/* <Input
                        placeholder="type"
                        // mr="2"
                        {...register(`drugs[${index}].type`)}
                      /> */}
                      <Select {...register(`drugs[${index}].type`)}>
                        <option value="">Select type</option>
                        {Object.entries(drugType).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </Select>
                    </Flex>
                    <FormErrorMessage mt="1">
                      {errors.drugs && errors.drugs[index]?.type?.message}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl
                    id={`quantity-${index}`}
                    mb="1"
                    isInvalid={
                      errors?.drugs && errors?.drugs[index]?.quantity
                        ? true
                        : false
                    }
                  >
                    <VisuallyHidden as="label">Quantity</VisuallyHidden>
                    <Flex>
                      <Input
                        placeholder="quantity"
                        type="number"
                        // mr="2"
                        {...register(`drugs[${index}].quantity`)}
                      />
                    </Flex>
                    <FormErrorMessage mt="1">
                      {errors.drugs && errors.drugs[index]?.quantity?.message}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl
                    id={`description-${index}`}
                    mb="1"
                    isInvalid={
                      errors?.drugs && errors?.drugs[index]?.description
                        ? true
                        : false
                    }
                  >
                    <VisuallyHidden as="label">Description</VisuallyHidden>
                    <Flex>
                      <Textarea
                        placeholder="description"
                        // mr="2"
                        rows={1}
                        {...register(`drugs[${index}].description`)}
                      />
                    </Flex>
                    <FormErrorMessage mt="1">
                      {errors.drugs &&
                        errors.drugs[index]?.description?.message}
                    </FormErrorMessage>
                  </FormControl>
                  <IconButton
                    onClick={() => remove(index)}
                    p="3"
                    icon={<FaTrashAlt />}
                    colorScheme="red"
                  />
                </HStack>
              );
            })}
          </Box>
          <Box textAlign="center" mt="4">
            <Button
              leftIcon={<FaPlus />}
              type="button"
              onClick={() => append({})}
              // w="full"
            >
              Add drug
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
            disabled={!getValues('drugs')?.length}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
