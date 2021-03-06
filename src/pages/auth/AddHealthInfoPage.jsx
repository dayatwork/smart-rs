import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Box, Center, Heading, Text, useToast, VStack } from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useQueryClient } from 'react-query';
import Logo from '../../assets/Logo';

// import { Logo } from '../../components/shared';
import { AddHealthInfoForm } from '../../components/auth/AddHealthInfoForm';
import { createUserVitalSign } from '../../api/user-services/user-management';

const AddHealthInfoPage = () => {
  const history = useHistory();
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [isLoading, setIsLoading] = useState();
  const queryClient = useQueryClient();

  const onSubmit = async values => {
    const { blood_type, height, weight } = values;
    const healthInfo = {
      blood_type,
      height,
      weight,
    };

    try {
      setIsLoading(true);
      await createUserVitalSign(cookies, healthInfo);
      await queryClient.invalidateQueries([
        'patient-vital-sign',
        cookies?.user?.id,
      ]);
      setIsLoading(true);
      toast({
        position: 'top-right',
        title: 'Success',
        description: 'Profile berhasil di update',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      history.push('/');
    } catch (error) {
      setIsLoading(false);
      toast({
        position: 'top-right',
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Center
      minH="100vh"
      p="3"
      bgColor="secondary.lighter"
      // backgroundImage={{ base: 'none', lg: "url('/images/bg-image.jpg')" }}
      // bgColor={{ base: 'gray.100', lg: 'white' }}
    >
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
        <Heading
          mt="4"
          mb="8"
          textAlign="center"
          size="xl"
          fontWeight="extrabold"
        >
          Info Kesehatan
        </Heading>
        <AddHealthInfoForm onSubmit={onSubmit} isLoading={isLoading} />
        <Box mt="4" align="center" maxW="md" fontWeight="medium">
          {/* <span>Sudah punya akun?</span> */}
          <Link to="/">
            <Box
              as="span"
              marginStart="1"
              href="#"
              color="primary.400"
              _hover={{ color: 'primary.600' }}
              display={{ base: 'block', sm: 'revert' }}
            >
              Lewati
            </Box>
          </Link>
        </Box>
      </Box>
    </Center>
  );
};

export default AddHealthInfoPage;
