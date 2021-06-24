import * as React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Box, Center, Heading, useToast } from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { Helmet } from 'react-helmet-async';

import { login } from '../../api/auth-services/auth';
import { getUserProfile } from '../../api/user-services/user-management';
import { LoginForm } from '../../components/auth/LoginForm';
import { Logo } from '../../components/shared';

export const LoginPage = () => {
  const history = useHistory();
  const toast = useToast();
  const [, setCookie] = useCookies(['token']);

  const fetchUserDetails = async token => {
    const { data } = await getUserProfile(token);

    const details = {
      id: data?.id,
      email: data?.email,
      name: data?.name,
      institution_id: data?.institution_id,
      phone_number: data?.phone_number,
      role: data?.role,
      role_id: data?.role_id,
    };

    setCookie('user', JSON.stringify(details), { path: '/' });
  };

  const onSubmit = async values => {
    const { email, password } = values;

    try {
      const data = await login({ email, password });

      if (data.code !== 200) {
        throw new Error(data.message);
      }

      setCookie('token', data.token, { path: '/' });

      if (data.token) {
        await fetchUserDetails(data.token);
      }

      toast({
        title: data?.title,
        description: data?.message,
        status: 'success',
        duration: 4000,
        isClosable: true,
      });

      history.push('/');
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
      bgColor={{ base: 'gray.100', lg: 'white' }}
    >
      <Helmet>
        <title>Login | SMART-RS</title>
      </Helmet>
      <Box
        bg="white"
        py="8"
        px={{ base: '8', md: '10' }}
        shadow={{ base: 'xl', lg: 'base' }}
        rounded={{ sm: 'lg' }}
        w="md"
      >
        <Logo />
        <Heading mt="6" textAlign="center" size="xl" fontWeight="extrabold">
          Selamat Datang
        </Heading>
        <Box mt="2" mb="10" align="center" maxW="md" fontWeight="medium">
          <span>Silahkan login menggunakan akun anda</span>
        </Box>
        <LoginForm onSubmit={onSubmit} />
        <Box mt="4" align="center" maxW="md" fontWeight="medium">
          <span>Belum punya akun?</span>
          <Link to="/signup">
            <Box
              as="span"
              marginStart="1"
              href="#"
              color="blue.600"
              _hover={{ color: 'blue.600' }}
              display={{ base: 'block', sm: 'revert' }}
            >
              Signup
            </Box>
          </Link>
        </Box>
      </Box>
    </Center>
  );
};
