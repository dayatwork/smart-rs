import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
} from '@chakra-ui/react';
import React from 'react';
import { useForm } from 'react-hook-form';

// import { PasswordField } from './PasswordField';
import PasswordField from './PasswordField';

export const LoginForm = ({ onSubmit }) => {
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
        <FormControl id="email" isInvalid={errors.email ? true : false}>
          <FormLabel>Email</FormLabel>
          <Input type="email" {...register('email', { required: 'Email is required' })} />
          <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
        </FormControl>
        <PasswordField
          forgot="true"
          errors={errors}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'Password min 6 characters' },
          })}
        />
        <Button
          isLoading={isSubmitting}
          type="submit"
          colorScheme="blue"
          size="lg"
          fontSize="md"
          data-testid="login-button">
          Login
        </Button>
      </Stack>
    </Box>
  );
};
