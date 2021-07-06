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
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import LazyLoad from 'react-lazyload';
// import Logo from './Logo.svg';
import { Logo } from './Logo';

import { signup } from '../../api/auth-services/auth';
import { SignupForm } from '../../components/auth/SignupForm';
// import { Logo } from '../../components/shared';

const SignupPage = () => {
  const history = useHistory();
  const toast = useToast();
  const formColumns = useBreakpointValue({ base: 5, lg: 2 });
  const minWGrid = useBreakpointValue({ base: 'xs', xs: 'sm', sm: 'md' });

  const onSubmit = async value => {
    const { email } = value;

    try {
      await signup({ email });

      toast({
        position: 'top-right',
        title: 'Sukses',
        description:
          'OTP telah terkirim ke email Anda. Mohon cek INBOX atau SPAM di email Anda',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });

      history.push(`/verification?email=${email}`);
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
        <title>Sign up | SMART-RS</title>
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
        <GridItem
          as={Center}
          colSpan={3}
          display={{ base: 'none', lg: 'flex' }}
        >
          <LazyLoad resize height={200}>
            <img src="/images/bg-auth.jpg" alt="bg-auth" />
          </LazyLoad>
        </GridItem>
        <GridItem colSpan={formColumns} py="8" px={{ base: '8', md: '10' }}>
          <VStack>
            <Logo />
            <Text fontWeight="extrabold" fontSize="xl" color="primary.500">
              SMART-RS
            </Text>
          </VStack>
          <Heading
            mt="6"
            mb="10"
            textAlign="center"
            fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
            fontWeight="extrabold"
          >
            Daftar
          </Heading>
          <SignupForm onSubmit={onSubmit} />
          <Box mt="4" align="center" maxW="md" fontWeight="medium">
            <span>Sudah punya akun?</span>
            <Link to="/login">
              <Box
                as="span"
                marginStart="1"
                href="#"
                color="primary.400"
                _hover={{ color: 'primary.600' }}
                display={{ base: 'block', sm: 'revert' }}
              >
                Login
              </Box>
            </Link>
          </Box>
        </GridItem>
        {/* <Logo /> */}
      </Grid>
    </Center>
  );
};

export default SignupPage;
