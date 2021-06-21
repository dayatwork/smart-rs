import React from 'react';
import { Box, Heading, Text, Center, useToast } from '@chakra-ui/react';

import { Logo } from '../../components/shared';
import { ForgotPasswordForm } from '../../components/auth/ForgotPasswordForm';
import { forgotPassword } from '../../api/auth-services/auth';

export const ForgotPasswordPage = () => {
  const toast = useToast();

  const onSubmit = async (value, e) => {
    const { email } = value;

    try {
      await forgotPassword({ email });
      e.target.reset();
      toast({
        title: 'Success',
        description: 'Cek email anda untuk mendapatkan link reset password',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Center
      minH="100vh"
      minW="100vw"
      p="3"
      backgroundImage={{ base: 'none', lg: "url('/images/bg-image.jpg')" }}
      bgColor={{ base: 'gray.100', lg: 'white' }}>
      <Box
        bg="white"
        py="8"
        px={{ base: '8', md: '10' }}
        shadow={{ base: 'xl', lg: 'base' }}
        rounded={{ sm: 'lg' }}
        w="md">
        <Logo />
        <Heading mt="6" textAlign="center" size="xl" fontWeight="extrabold">
          Lupa password?
        </Heading>
        <Text
          mt="4"
          mb="10"
          align="center"
          maxW="sm"
          fontWeight="medium"
          color="gray.600">
          Masukkan alamat email anda dan kami akan mengirimkan link untuk reset password
        </Text>
        <ForgotPasswordForm onSubmit={onSubmit} />
      </Box>
    </Center>
  );
};
