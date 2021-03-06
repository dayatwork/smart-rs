import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  PinInput,
  PinInputField,
  Stack,
  useToast,
} from '@chakra-ui/react';

export const VerificationOTPForm = ({ onSubmit, isLoading }) => {
  const toast = useToast();
  const { search } = useLocation();
  const email = new URLSearchParams(search).get('email');
  const [otp, setOTP] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!email || otp.length !== 6) {
      toast({
        position: 'top-right',
        title: 'Error',
        description: `URL atau OTP tidak valid`,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    onSubmit(email, otp);
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <Stack spacing="6">
        <FormControl id="otp">
          <FormLabel textAlign="center" color="gray.600">
            Masukkan OTP
          </FormLabel>
          <HStack spacing={2} justify="center" mt="6">
            <PinInput
              size="lg"
              variant="filled"
              value={otp}
              onChange={value => setOTP(value)}
              otp
              // colorScheme="primary"
            >
              <PinInputField />
              <PinInputField />
              <PinInputField />
              <PinInputField />
              <PinInputField />
              <PinInputField />
            </PinInput>
          </HStack>
        </FormControl>
        <Button
          isLoading={isLoading}
          type="submit"
          colorScheme="primary"
          size="lg"
          fontSize="md"
          data-testid="verification-button"
        >
          Verifikasi
        </Button>
      </Stack>
    </Box>
  );
};
