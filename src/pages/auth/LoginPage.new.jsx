import * as React from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Box,
  Center,
  Heading,
  useToast,
  Image,
  Text,
  VStack,
  Grid,
  GridItem,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { Helmet } from 'react-helmet-async';
import MapSvg from './Map.svg';
import Logo from './Logo.svg';

import { login } from '../../api/auth-services/auth';
import { getUserProfile } from '../../api/user-services/user-management';
import { LoginForm } from '../../components/auth/LoginForm';
// import { Logo } from '../../components/shared';

export const LoginPage = () => {
  const history = useHistory();
  const toast = useToast();
  const [, setCookie] = useCookies(['token']);
  const formColumns = useBreakpointValue({ base: 5, md: 2 });

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
      // backgroundImage={{ base: 'none', lg: "url('/images/bg-image.jpg')" }}
      // bgColor={{ base: 'gray.100', lg: 'white' }}
      sx={{ backgroundColor: '#e0f7ff' }}
    >
      <Helmet>
        <title>Login | SMART-RS</title>
      </Helmet>

      <Grid
        bg="white"
        shadow={{ base: 'xl', lg: 'base' }}
        rounded={{ sm: 'lg' }}
        templateColumns="repeat(5, 1fr)"
        overflow="hidden"
        w="6xl"
      >
        {/* <Logo /> */}
        <GridItem
          as={Center}
          colSpan={3}
          sx={{ backgroundColor: '#83CDE6' }}
          py="8"
          px={{ base: '8', md: '10' }}
          display={{ base: 'none', md: 'flex' }}
        >
          <Image src={MapSvg} w={{ base: 'md', lg: 'lg' }} />
        </GridItem>
        <GridItem colSpan={formColumns} py="8" px={{ base: '8', md: '10' }}>
          <VStack>
            <Image src={Logo} alt="Logo" w="20" />
            <Text fontWeight="extrabold" fontSize="xl" color="blue.600">
              SMART-RS
            </Text>
          </VStack>
          <Heading
            mt="6"
            textAlign="center"
            size="lg"
            fontWeight="extrabold"
            color="brand.500"
            textTransform="uppercase"
          >
            Welcome back
          </Heading>
          <Box
            mt="2"
            mb="10"
            align="center"
            // maxW="md"
            fontWeight="medium"
            color="brand.500"
          >
            <Box as="span" fontSize="lg">
              Sign in to your account
            </Box>
          </Box>
          <LoginForm onSubmit={onSubmit} />
          <Box mt="4" align="center" maxW="md" fontWeight="medium">
            <Box as="span" color="brand.500">
              Don't have an account?
            </Box>
            <Link to="/signup">
              <Box
                as="span"
                marginStart="1"
                href="#"
                color="brand.400"
                _hover={{ color: 'brand.600' }}
                display={{ base: 'block', sm: 'revert' }}
              >
                Sign up
              </Box>
            </Link>
          </Box>
        </GridItem>
      </Grid>
    </Center>
  );
};
