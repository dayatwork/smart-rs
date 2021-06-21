import * as React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Box, Center, Heading, useToast } from '@chakra-ui/react';

import { signup } from '../../api/auth-services/auth';
import { SignupForm } from '../../components/auth/SignupForm';
import { Logo } from '../../components/shared';

export const SignupPage = () => {
  const history = useHistory();
  const toast = useToast();

  const onSubmit = async (value) => {
    const { email } = value;

    try {
      const data = await signup({ email });

      toast({
        title: data.title,
        description: data.message,
        status: 'success',
        duration: 4000,
        isClosable: true,
      });

      history.push(`/verification?email=${email}`);
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
        <Heading mt="6" mb="10" textAlign="center" size="xl" fontWeight="extrabold">
          Registrasi Akun
        </Heading>
        <SignupForm onSubmit={onSubmit} />
        <Box mt="4" align="center" maxW="md" fontWeight="medium">
          <span>Sudah punya akun?</span>
          <Link to="/login">
            <Box
              as="span"
              marginStart="1"
              href="#"
              color="blue.600"
              _hover={{ color: 'blue.600' }}
              display={{ base: 'block', sm: 'revert' }}>
              Login
            </Box>
          </Link>
        </Box>
      </Box>
    </Center>
  );
};
