import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Center,
  useToast,
  VStack,
  Image,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
// import MapSvg from './Map.svg';
import Logo from './Logo.svg';

// import { Logo } from '../../components/shared';
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
      sx={{ backgroundColor: '#e0f7ff' }}
      // backgroundImage={{ base: 'none', lg: "url('/images/bg-image.jpg')" }}
      // bgColor={{ base: 'gray.100', lg: 'white' }}
    >
      <Helmet>
        <title>Forgot Password | SMART-RS</title>
      </Helmet>
      <Box
        bg="white"
        py="8"
        px={{ base: '8', md: '10' }}
        shadow={{ base: 'xl', lg: 'base' }}
        rounded={{ sm: 'lg' }}
        w="md"
      >
        <VStack>
          <Image src={Logo} alt="Logo" w="20" />
          <Text fontWeight="extrabold" fontSize="xl" color="blue.600">
            SMART-RS
          </Text>
        </VStack>
        {/* <Logo /> */}
        <Heading mt="6" textAlign="center" size="xl" fontWeight="extrabold">
          Forgot Password
        </Heading>

        <Text
          mt="4"
          mb="10"
          align="center"
          maxW="sm"
          fontWeight="medium"
          color="gray.600"
        >
          Enter your email address
        </Text>

        <ForgotPasswordForm onSubmit={onSubmit} />
        <Box mt="4" align="center" maxW="md" fontWeight="medium">
          <Link to="/login">
            <Box
              as="span"
              marginStart="1"
              href="#"
              color="brand.400"
              _hover={{ color: 'brand.600' }}
              display={{ base: 'block', sm: 'revert' }}
            >
              Back to login page
            </Box>
          </Link>
        </Box>
      </Box>
    </Center>
  );
};
