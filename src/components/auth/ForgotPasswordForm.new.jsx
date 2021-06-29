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

import { InputText } from '../shared/input';

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
        {/* <FormControl id="email" isInvalid={errors.email ? true : false}>
          <FormLabel>Email</FormLabel>
          <Input type="email" {...register('email', { required: 'Email is required' })} />
          <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
        </FormControl> */}
        <InputText
          label="Email"
          type="email"
          error={errors.email}
          {...register('email', { required: 'Email is required' })}
        />
        <Button
          isLoading={isSubmitting}
          type="submit"
          colorScheme="brand"
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
