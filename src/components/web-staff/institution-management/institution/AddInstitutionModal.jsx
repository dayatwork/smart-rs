import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Input,
  Select,
  useToast,
} from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useCookies } from 'react-cookie';
import { useForm } from 'react-hook-form';

import {
  getInstitutionTypes,
  createInstitution,
} from '../../../../api/institution-services/institution';

export const AddInstitutionModal = ({ isOpen, onClose }) => {
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

  const { data: resType, isSuccess: isSuccessType } = useQuery(
    'institution-types',
    () => getInstitutionTypes(cookies),
    { staleTime: Infinity }
  );

  const { mutate } = useMutation(createInstitution(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries('institutions');
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          position: 'top-right',
          title: 'Success',
          description: `Institution berhasil dibuat`,
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
    const toBase64 = file =>
      new window.Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });

    const {
      institution_type_id,
      name,
      email,
      phone_number,
      identity_number,
      logo,
    } = values;
    const institution = {
      institution_type_id,
      name,
      email,
      phone_number,
      identity_number,
      logo: await toBase64(logo[0]),
    };

    await mutate(institution);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Institution</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box as="form">
            <FormControl
              id="institution_type_id"
              mb="4"
              isInvalid={errors?.institution_type_id ? true : false}
            >
              <FormLabel>Institution Type</FormLabel>
              <Select
                {...register('institution_type_id', {
                  required: 'Institution type Required',
                })}
              >
                <option value="">Select App</option>
                {isSuccessType &&
                  resType?.data?.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
              </Select>
              <FormErrorMessage>
                {errors.institution_type_id &&
                  errors.institution_type_id.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              id="name"
              mb="4"
              isInvalid={errors.name ? true : false}
            >
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                {...register('name', { required: 'Type name is required' })}
              />
              <FormErrorMessage>
                {errors.name && errors.name.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              id="email"
              mb="4"
              isInvalid={errors.email ? true : false}
            >
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                {...register('email', { required: 'Email is required' })}
              />
              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              id="phone_number"
              mb="4"
              isInvalid={errors.phone_number ? true : false}
            >
              <FormLabel>Phone</FormLabel>
              <Input
                type="number"
                {...register('phone_number', { required: 'Phone is required' })}
              />
              <FormErrorMessage>
                {errors.phone_number && errors.phone_number.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              id="identity_number"
              mb="4"
              isInvalid={errors.identity_number ? true : false}
            >
              <FormLabel>Identity Number</FormLabel>
              <Input
                type="text"
                {...register('identity_number', {
                  required: 'Identity number is required',
                })}
              />
              <FormErrorMessage>
                {errors.identity_number && errors.identity_number.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl id="logo" mb="4">
              <FormLabel>Logo</FormLabel>
              <Input type="file" {...register('logo')} />
            </FormControl>
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
