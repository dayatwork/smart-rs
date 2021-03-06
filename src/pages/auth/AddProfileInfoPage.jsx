import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Center, Heading, Text, useToast, VStack } from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import Logo from '../../assets/Logo';

// import { Logo } from '../../components/shared';
import { AddProfileInfoForm } from '../../components/auth/AddProfileInfoForm';
import { updateUserDetail } from '../../api/user-services/user-management';

const AddProfileInfoPage = () => {
  const history = useHistory();
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async values => {
    const {
      name,
      phone_number,
      identity_number,
      birth_date,
      gender,
      address,
      province,
      city,
      district,
      sub_district,
    } = values;

    const data = {
      name,
      phone_number,
      identity_number,
      birth_date: birth_date && new Date(birth_date),
      gender,
      address,
      province,
      regency: city,
      district,
      subdistrict: sub_district,
    };

    try {
      setIsLoading(true);
      await updateUserDetail(cookies)(data);
      setIsLoading(false);
      toast({
        position: 'top-right',
        title: 'Success',
        description: 'Profile berhasil di update',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      history.push('/add-health-info');
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
    <Box>
      <Center
        minH="100vh"
        py="4"
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
          w="lg"
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
            mb="6"
            textAlign="center"
            size="xl"
            fontWeight="extrabold"
          >
            Info Tambahan
          </Heading>
          <AddProfileInfoForm onSubmit={onSubmit} isLoading={isLoading} />
        </Box>
      </Center>
    </Box>
  );
};

export default AddProfileInfoPage;
