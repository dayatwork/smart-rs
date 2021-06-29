import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Heading,
  Center,
  useToast,
  VStack,
  Image,
  Text,
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { Helmet } from 'react-helmet-async';
import Logo from './Logo.svg';

// import { Logo } from '../../components/shared';
import { SetPasswordForm } from '../../components/auth/SetPasswordForm';
import {
  getUserProfile,
  updateUserInfo,
} from '../../api/user-services/user-management';

export const SetPasswordPage = () => {
  const history = useHistory();
  const toast = useToast();
  const [cookies, setCookie] = useCookies(['token']);

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
    // setUserDetails(details);
    setCookie('user', JSON.stringify(details), { path: '/' });
  };

  const onSubmit = async values => {
    const { name, password } = values;

    try {
      const data = await updateUserInfo(cookies, { name, password });

      if (cookies.token) {
        await fetchUserDetails(cookies.token);
      }

      toast({
        title: data.title,
        description: data.message,
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
      history.push(`/add-profile-info`);
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
        <title>Set Password | SMART-RS</title>
      </Helmet>
      <Box
        bg="white"
        py="8"
        px={{ base: '4', md: '10' }}
        shadow="base"
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
        <Heading
          mt="6"
          mb="10"
          textAlign="center"
          size="xl"
          fontWeight="extrabold"
        >
          Set Nama Lengkap dan Password
        </Heading>
        <SetPasswordForm onSubmit={onSubmit} />
      </Box>
    </Center>
  );
};
