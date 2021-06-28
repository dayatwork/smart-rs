import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

export const ForgotPasswordForm = ({ onSubmit }) => {
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
          <Input
            type="email"
            {...register('email', { required: 'Email is required' })}
          />
          <FormErrorMessage>
            {errors.email && errors.email.message}
          </FormErrorMessage>
        </FormControl>
        <Button
          isLoading={isSubmitting}
          type="submit"
          colorScheme="blue"
          size="lg"
          fontSize="md"
          data-testid="forgot-button"
        >
          Send
        </Button>
      </Stack>
    </Box>
  );
};
