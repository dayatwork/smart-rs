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
} from '@chakra-ui/react';
import { useMutation, useQueryClient } from 'react-query';
import { useCookies } from 'react-cookie';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';
import { useForm, useFieldArray } from 'react-hook-form';

import { createDrug } from '../../../../api/pharmacy-services/drug';
import { InputDate } from '../../../../components/shared/input';

export const AddDrugModal = ({ isOpen, onClose, selectedInstitution }) => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [isLoading, setIsLoading] = useState(false);
  const [, setErrMessage] = useState('');
  const { register, handleSubmit, reset, clearErrors, control } = useForm();
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
                <HStack key={id}>
                  <FormControl id={`name-${index}`} mb="1">
                    <VisuallyHidden as="label">Name</VisuallyHidden>
                    <Flex>
                      <Input
                        placeholder="name"
                        // mr="2"
                        {...register(`drugs[${index}].name`)}
                      />
                    </Flex>
                  </FormControl>
                  <FormControl id={`price-${index}`} mb="1">
                    <VisuallyHidden as="label">Price</VisuallyHidden>
                    <Flex>
                      <Input
                        placeholder="price"
                        type="number"
                        // mr="2"
                        {...register(`drugs[${index}].price`)}
                      />
                    </Flex>
                  </FormControl>
                  <FormControl id={`expired-${index}`} mb="1">
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
                  </FormControl>
                  <FormControl id={`type-${index}`} mb="1">
                    <VisuallyHidden as="label">Type</VisuallyHidden>
                    <Flex>
                      <Input
                        placeholder="type"
                        // mr="2"
                        {...register(`drugs[${index}].type`)}
                      />
                    </Flex>
                  </FormControl>
                  <FormControl id={`quantity-${index}`} mb="1">
                    <VisuallyHidden as="label">Quantity</VisuallyHidden>
                    <Flex>
                      <Input
                        placeholder="quantity"
                        type="number"
                        // mr="2"
                        {...register(`drugs[${index}].quantity`)}
                      />
                    </Flex>
                  </FormControl>
                  <FormControl id={`description-${index}`} mb="1">
                    <VisuallyHidden as="label">Description</VisuallyHidden>
                    <Flex>
                      <Textarea
                        placeholder="description"
                        // mr="2"
                        rows={1}
                        {...register(`drugs[${index}].description`)}
                      />
                    </Flex>
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
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
