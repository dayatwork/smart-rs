import React from 'react';
import {
  Box,
  Button,
  // FormControl,
  // FormErrorMessage,
  // FormLabel,
  // Input,
  Stack,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import { InputText, InputPassword } from '../shared/input';
// import PasswordField from './PasswordField';

export const SetPasswordForm = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    mode: 'onBlur',
  });

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing="6">
        {/* <FormControl id="name" isInvalid={errors.name ? true : false}>
          <FormLabel>Nama Lengkap</FormLabel>
          <Input {...register('name', { required: 'Name is required' })} />
          <FormErrorMessage>
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>
        <PasswordField
          errors={errors}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'Password min 6 characters' },
          })}
        /> */}
        <InputText
          label="Nama Lengkap Sesuai KTP"
          type="text"
          error={errors.name}
          {...register('name', { required: 'Nama harus diisi' })}
        />
        <InputPassword
          label="Kata sandi"
          error={errors.password}
          {...register('password', {
            required: 'Kata sandi harus diisi',
            minLength: { value: 6, message: 'Kata sandi minimal 6 karakter' },
          })}
        />
        <Button
          isLoading={isSubmitting}
          type="submit"
          colorScheme="primary"
          size="lg"
          fontSize="md"
          data-testid="set-password-button"
        >
          Simpan
        </Button>
      </Stack>
    </Box>
  );
};
