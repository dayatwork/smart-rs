import * as React from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Box,
  Center,
  Grid,
  GridItem,
  Heading,
  Image,
  Text,
  useToast,
  VStack,
  useBreakpointValue,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import MapSvg from './Map.svg';
import Logo from './Logo.svg';

import { signup } from '../../api/auth-services/auth';
import { SignupForm } from '../../components/auth/SignupForm';
// import { Logo } from '../../components/shared';

export const SignupPage = () => {
  const history = useHistory();
  const toast = useToast();
  const formColumns = useBreakpointValue({ base: 5, md: 2 });

  const onSubmit = async value => {
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
    // <Center
    //   minH="100vh"
    //   minW="100vw"
    //   p="3"
    //   backgroundImage={{ base: 'none', lg: "url('/images/bg-image.jpg')" }}
    //   bgColor={{ base: 'gray.100', lg: 'white' }}
    // >
    //   <Helmet>
    //     <title>Sign up | SMART-RS</title>
    //   </Helmet>
    //   <Box
    //     bg="white"
    //     py="8"
    //     px={{ base: '8', md: '10' }}
    //     shadow={{ base: 'xl', lg: 'base' }}
    //     rounded={{ sm: 'lg' }}
    //     w="md"
    //   >
    //     <Logo />
    //     <Heading
    //       mt="6"
    //       mb="10"
    //       textAlign="center"
    //       size="xl"
    //       fontWeight="extrabold"
    //     >
    //       Registrasi Akun
    //     </Heading>
    //     <SignupForm onSubmit={onSubmit} />
    // <Box mt="4" align="center" maxW="md" fontWeight="medium">
    //   <span>Sudah punya akun?</span>
    //   <Link to="/login">
    //     <Box
    //       as="span"
    //       marginStart="1"
    //       href="#"
    //       color="blue.600"
    //       _hover={{ color: 'blue.600' }}
    //       display={{ base: 'block', sm: 'revert' }}
    //     >
    //       Login
    //     </Box>
    //   </Link>
    // </Box>
    //   </Box>
    // </Center>
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
            Welcome to SMART-RS
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
              Create New Account
            </Box>
          </Box>
          <SignupForm onSubmit={onSubmit} />
          <Box mt="4" align="center" maxW="md" fontWeight="medium">
            <span>Already have an account?</span>
            <Link to="/login">
              <Box
                as="span"
                marginStart="1"
                href="#"
                color="brand.400"
                _hover={{ color: 'brand.600' }}
                display={{ base: 'block', sm: 'revert' }}
              >
                Login
              </Box>
            </Link>
          </Box>
        </GridItem>
      </Grid>
    </Center>
  );
};
