import * as React from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Box,
  Center,
  Grid,
  GridItem,
  Heading,
  Text,
  useToast,
  VStack,
  useBreakpointValue,
  // Image,
  // Text,
  // VStack,
  // Icon,
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { Helmet } from 'react-helmet-async';
// import LazyLoad from 'react-lazyload';
import { Logo } from './Logo';

import { login } from '../../api/auth-services/auth';
import { getUserProfile } from '../../api/user-services/user-management';
import { LoginForm } from '../../components/auth/LoginForm';
// import { Logo } from '../../components/shared';

export const LoginPage = () => {
  const history = useHistory();
  const toast = useToast();
  const [, setCookie] = useCookies(['token']);
  const formColumns = useBreakpointValue({ base: 5, lg: 2 });
  const minWGrid = useBreakpointValue({ base: 'xs', xs: 'sm', sm: 'md' });

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
        position: 'top-right',
        title: data?.title,
        description: data?.message,
        status: 'success',
        duration: 4000,
        isClosable: true,
      });

      history.push('/');
    } catch (error) {
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

  return (
    <Center
      minH="100vh"
      minW="100vw"
      p="3"
      bgColor="secondary.lighter"
      // backgroundImage={{ base: 'none', lg: "url('/images/bg-image.jpg')" }}
      // bgColor={{ base: 'gray.100', lg: 'white' }}
    >
      <Helmet>
        <title>Login | SMART-RS</title>
      </Helmet>
      <Grid
        bg="white"
        shadow="xl"
        rounded={{ sm: 'lg' }}
        templateColumns="repeat(5, 1fr)"
        overflow="hidden"
        maxW="6xl"
        minW={minWGrid}
      >
        {/* <Logo /> */}
        <GridItem
          as={Center}
          colSpan={3}
          display={{ base: 'none', lg: 'flex' }}
        >
          {/* <LazyLoad height={200}> */}
          <img src="/images/bg-auth.jpg" alt="bg-auth" />
          {/* </LazyLoad> */}
        </GridItem>
        <GridItem colSpan={formColumns} py="8" px={{ base: '8', md: '10' }}>
          <VStack>
            {/* <Image src={Logo} alt="Logo" w="20" /> */}
            <Logo />
            <Text fontWeight="extrabold" fontSize="xl" color="primary.500">
              SMART-RS
            </Text>
          </VStack>
          <Heading
            mt="6"
            textAlign="center"
            fontSize={{ base: '2xl', md: null }}
            fontWeight="extrabold"
          >
            Selamat Datang
          </Heading>
          <Box mt="2" mb="10" align="center" maxW="md" fontWeight="medium">
            <span>Silahkan masuk menggunakan akun Anda</span>
          </Box>
          <LoginForm onSubmit={onSubmit} />
          <Box mt="4" align="center" maxW="md" fontWeight="medium">
            <span>Belum punya akun?</span>
            <Link to="/signup">
              <Box
                as="span"
                marginStart="1"
                href="#"
                color="primary.400"
                _hover={{ color: 'primary.600' }}
                display={{ base: 'block', sm: 'revert' }}
              >
                Daftar
              </Box>
            </Link>
          </Box>
        </GridItem>
      </Grid>
    </Center>
  );
};
