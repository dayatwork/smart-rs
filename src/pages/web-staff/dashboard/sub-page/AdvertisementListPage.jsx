import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Flex, Heading } from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import { HiSpeakerphone } from 'react-icons/hi';

import { AppShell } from 'components/web-staff/shared/app-shell';
import { ContentWrapper } from 'components/web-staff/shared/sub-menu';
import { BackButton } from 'components/shared/BackButton';

const AdvertisementListPage = () => {
  return (
    <AppShell>
      <Helmet>
        <title>Advertisement | SMART-RS</title>
      </Helmet>
      <Box height="full" overflow="hidden" position="relative" w="full">
        <Flex h="full" direction="column">
          <Flex
            p="6"
            justify="space-between"
            // mb={{ base: '3', '2xl': '6' }}
            bg="white"
            boxShadow="lg"
          >
            <Heading fontSize={{ base: '2xl', '2xl': '3xl' }}>
              Advertisement List
            </Heading>
            <Button
              colorScheme="purple"
              as={Link}
              to="/dashboard/advertisement/create"
              leftIcon={<HiSpeakerphone />}
            >
              New Advertisement
            </Button>
          </Flex>
          <ContentWrapper bg="gray.50">
            <Flex
              justify="space-between"
              align="center"
              py="4"
              // maxW="7xl"
              // mx="auto"
            >
              <BackButton to="/dashboard" text="Back to Dashboard" />
            </Flex>
            <Card pb="8">
              <CardHeader title="Advertisement Form" />
              <CardContent px="12" py="8">
                Advertisement list
              </CardContent>
            </Card>
          </ContentWrapper>
        </Flex>
      </Box>
    </AppShell>
  );
};

export default AdvertisementListPage;

export const Card = props => (
  <Box
    bg="white"
    rounded={{
      md: 'lg',
    }}
    shadow="base"
    // overflow="hidden"
    {...props}
  />
);

export const CardHeader = ({ title, action }) => {
  return (
    <Flex
      align="center"
      justify="space-between"
      px={{ base: '3', md: '6' }}
      py="4"
      borderBottomWidth="1px"
    >
      <Heading as="h2" fontSize="lg">
        {title}
      </Heading>
      {action}
    </Flex>
  );
};

export const CardContent = props => <Box {...props} />;

// export const Property = props => {
//   const { label, value, ...flexProps } = props;
//   return (
//     <Flex
//       as="dl"
//       direction={{
//         base: 'column',
//         sm: 'row',
//       }}
//       px="6"
//       py="4"
//       _even={{
//         bg: 'gray.50',
//       }}
//       {...flexProps}
//     >
//       <Box as="dt" flexBasis={{ base: '40%', md: '30%' }}>
//         {label}
//       </Box>
//       <Box as="dd" flex="1" fontWeight="semibold">
//         {value}
//       </Box>
//     </Flex>
//   );
// };
