import * as React from 'react';
import { Box, Button, Stack } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import PasswordField from './PasswordField';

export const ChangePasswordForm = ({ onSubmit, isLoading }) => {
  const { register, handleSubmit } = useForm();

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing="6">
        <PasswordField {...register('password')} />
        <Button
          isLoading={isLoading}
          type="submit"
          colorScheme="primary"
          size="lg"
          fontSize="md"
        >
          Reset Password
        </Button>
      </Stack>
    </Box>
  );
};
