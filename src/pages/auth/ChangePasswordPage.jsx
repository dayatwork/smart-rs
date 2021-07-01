import React, { useState } from 'react';
import { useHistory, useLocation, Redirect } from 'react-router-dom';
import { Box, Heading, Center, useToast, VStack, Text } from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import { Logo } from './Logo';

// import { Logo } from '../../components/shared';
import { ChangePasswordForm } from '../../components/auth/ChangePasswordForm';
import { resetPassword } from '../../api/auth-services/auth';

export const ChangePasswordPage = () => {
  const toast = useToast();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const { search } = useLocation();
  const token = new URLSearchParams(search).get('token');

  const onSubmit = async values => {
    const { password } = values;
    setIsLoading(true);

    try {
      await resetPassword({ token, password });
      setIsLoading(false);
      toast({
        position: 'top-right',
        title: 'Success',
        description: 'Silahkan login dengan password baru',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
      history.push('/login');
    } catch (error) {
      setIsLoading(false);
      toast({
        position: 'top-right',
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  if (!token) {
    return <Redirect to="/login" />;
  }

  return (
    <Center
      minH="100vh"
      minW="100vw"
      p="3"
      backgroundImage={{ base: 'none', lg: "url('/images/bg-image.jpg')" }}
      bgColor={{ base: 'gray.100', lg: 'white' }}
    >
      <Helmet>
        <title>Change Password | SMART-RS</title>
      </Helmet>
      <Box
        bg="white"
        py="8"
        px={{ base: '8', md: '10' }}
        shadow={{ base: 'xl', lg: 'base' }}
        rounded={{ sm: 'lg' }}
        w="md"
      >
        {/* <Logo /> */}
        <VStack>
          <Logo />
          <Text fontWeight="extrabold" fontSize="xl" color="primary.500">
            SMART-RS
          </Text>
        </VStack>
        <Heading mt="6" textAlign="center" size="xl" fontWeight="extrabold">
          Reset Password
        </Heading>
        <Box mt="2" mb="10" align="center" maxW="md" fontWeight="medium">
          <span>Masukkan password baru</span>
        </Box>
        <ChangePasswordForm isLoading={isLoading} onSubmit={onSubmit} />
      </Box>
    </Center>
  );
};
