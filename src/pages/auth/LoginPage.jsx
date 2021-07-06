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
  Button,
  // Image,
  // Text,
  // VStack,
  // Icon,
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { Helmet } from 'react-helmet-async';
// import LazyLoad from 'react-lazyload';
import Logo from '../../assets/Logo';

import { login } from '../../api/auth-services/auth';
import { getUserProfile } from '../../api/user-services/user-management';
import { LoginForm } from '../../components/auth/LoginForm';
// import { Logo } from '../../components/shared';

const LoginPage = () => {
  const history = useHistory();
  const toast = useToast();
  const [, setCookie] = useCookies(['token']);
  const formColumns = useBreakpointValue({ base: 5, lg: 2 });

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
        gridTemplateColumns="repeat(5,1fr)"
        w="6xl"
        bg="white"
        boxShadow="2xl"
        rounded="2xl"
        overflow="hidden"
      >
        <GridItem
          colSpan={3}
          backgroundImage="url('/images/bg-auth.jpg')"
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
          backgroundSize="cover"
          display={{ base: 'none', lg: 'flex' }}
        ></GridItem>
        <GridItem
          colSpan={formColumns}
          py="8"
          px={{ base: '8', md: '10' }}
          minH="2xl"
        >
          <VStack>
            <Logo width={110} height={110} />
            <Text fontWeight="extrabold" fontSize="xl" color="primary.500">
              SMART-RS
            </Text>
          </VStack>
          <Heading
            mt="6"
            textAlign="center"
            fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
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

            <Button
              variant="link"
              as={Link}
              to="/signup"
              marginStart="1"
              colorScheme="primary"
              display={{ base: 'block', sm: 'revert' }}
            >
              Daftar
            </Button>
          </Box>
        </GridItem>
      </Grid>
    </Center>
  );
};

export default LoginPage;

// const a = () => (
//   <Grid
//         bg="white"
//         shadow="xl"
//         rounded={{ sm: 'lg' }}
//         templateColumns="repeat(5, 1fr)"
//         overflow="hidden"
//         maxW="6xl"
//         minW={minWGrid}
//       >
//         {/* <Logo /> */}
//         <GridItem
//           as={Center}
//           colSpan={3}
//           display={{ base: 'none', lg: 'flex' }}
//         >
//           <Img
//             w="full"
//             h="full"
//             src="/images/bg-auth.jpg"
//             alt="bg-auth"
//             objectFit="cover"
//           />
//         </GridItem>
//         <GridItem colSpan={formColumns} py="8" px={{ base: '8', md: '10' }}>
//           <VStack>
//             <Logo width={110} height={110} />
//             <Text fontWeight="extrabold" fontSize="xl" color="primary.500">
//               SMART-RS
//             </Text>
//           </VStack>
//           <Heading
//             mt="6"
//             textAlign="center"
//             fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
//             fontWeight="extrabold"
//           >
//             Selamat Datang
//           </Heading>
//           <Box mt="2" mb="10" align="center" maxW="md" fontWeight="medium">
//             <span>Silahkan masuk menggunakan akun Anda</span>
//           </Box>
//           <LoginForm onSubmit={onSubmit} />
//           <Box mt="4" align="center" maxW="md" fontWeight="medium">
//             <span>Belum punya akun?</span>

//             <Button
//               variant="link"
//               as={Link}
//               to="/signup"
//               marginStart="1"

//               colorScheme="primary"

//               display={{ base: 'block', sm: 'revert' }}
//             >
//               Daftar
//             </Button>

//           </Box>
//         </GridItem>
//       </Grid>
// )
