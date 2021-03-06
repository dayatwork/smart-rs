import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Center,
  Heading,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { Helmet } from 'react-helmet-async';
import Logo from '../../assets/Logo';

// import { Logo } from '../../components/shared';
import { VerificationOTPForm } from '../../components/auth/VerificationOTPForm';
import { verification, resendOTP } from '../../api/auth-services/auth';

const VerificationPage = () => {
  const [, setCookie] = useCookies(['token']);
  const toast = useToast();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const { search } = useLocation();
  const email = new URLSearchParams(search).get('email');
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      await resendOTP({ email });
      setIsLoading(false);
      toast({
        position: 'top-right',
        title: 'Success',
        description: 'OTP baru sudah dikirimkan ke email anda',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
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

  const onSubmit = async (email, otp) => {
    setIsLoadingSubmit(true);
    try {
      const { data } = await verification({ email, otp });

      setIsLoadingSubmit(false);
      setCookie('token', data, { path: '/' });
      history.push('/set-password');
    } catch (error) {
      setIsLoadingSubmit(false);
      toast({
        position: 'top-right',
        title: 'Error',
        description: 'OTP tidak valid, mohon kirim ulang OTP',
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
        <title>Verification | SMART-RS</title>
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
          <Logo width={110} height={110} />
          <Text fontWeight="extrabold" fontSize="xl" color="primary.500">
            SMART-RS
          </Text>
        </VStack>
        <Heading mt="6" textAlign="center" size="xl" fontWeight="extrabold">
          Verifikasi
        </Heading>
        <VerificationOTPForm onSubmit={onSubmit} isLoading={isLoadingSubmit} />
        <Box mt="4" align="center" maxW="md" fontWeight="medium">
          <Button
            p="2"
            marginStart="1"
            // color="blue.600"
            colorScheme="primary"
            onClick={handleResendOTP}
            variant="link"
            isLoading={isLoading}
          >
            Kirim ulang OTP
          </Button>
        </Box>
      </Box>
    </Center>
  );
};

export default VerificationPage;
