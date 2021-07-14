import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Select,
  SimpleGrid,
  Stack,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import { FaListUl } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { useCookies } from 'react-cookie';

import { createAdvertisement } from 'api/institution-services/advertisement';
import { AppShell } from 'components/web-staff/shared/app-shell';
import { ContentWrapper } from 'components/web-staff/shared/sub-menu';
import { BackButton } from 'components/shared/BackButton';
import { InputDate } from 'components/shared/input';

const CreateAdvertisementPage = () => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const { register, handleSubmit, control } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async value => {
    const { title, category, start_date, end_date, image, content } = value;
    const formattedStartDate = new Date(start_date).toISOString().split('T')[0];
    const formattedEndDate = new Date(end_date).toISOString().split('T')[0];

    const data = new FormData();
    data.append('image', image[0]);
    data.append('title', title);
    data.append('category', category);
    data.append('content', content);
    data.append('start_date', formattedStartDate);
    data.append('end_date', formattedEndDate);

    try {
      setIsLoading(true);
      const res = await createAdvertisement(cookies, data);
      setIsLoading(false);
      console.log({ res });
      toast({
        position: 'top-right',
        title: 'Success',
        description: `Advertisement created successfully`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      setIsLoading(false);
      toast({
        position: 'top-right',
        title: 'Success',
        description: `Error, Cannot create new advertisement`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <AppShell>
      <Helmet>
        <title>Create Advertisement | SMART-RS</title>
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
              New Advertisement
            </Heading>
            <Button
              colorScheme="purple"
              as={Link}
              to="/dashboard/advertisement"
              leftIcon={<FaListUl />}
            >
              Advertisement List
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
              <HStack spacing="4">
                <Button
                  colorScheme="green"
                  onClick={handleSubmit(onSubmit)}
                  isLoading={isLoading}
                >
                  Save & Publish
                </Button>
                <Button colorScheme="red" variant="outline">
                  Cancel
                </Button>
              </HStack>
            </Flex>
            <Card pb="8">
              <CardHeader title="Advertisement Form" />
              <CardContent px="12" py="8">
                <SimpleGrid columns={2} gap="12">
                  <Stack spacing="4">
                    <FormControl id="title">
                      <FormLabel>Title</FormLabel>
                      <Input placeholder="Title" {...register('title')} />
                    </FormControl>
                    <FormControl id="category">
                      <FormLabel>Category</FormLabel>
                      <Select {...register('category')}>
                        <option value="">Choose Category</option>
                        <option value="discount">Discount</option>
                        <option value="news">News</option>
                      </Select>
                    </FormControl>
                    <SimpleGrid columns={2} gap="6">
                      <FormControl id="start_date">
                        <FormLabel>Start Date</FormLabel>
                        <InputDate
                          name="start_date"
                          control={control}
                          placeholder="Expired"
                          selectYearMode
                          startYear={new Date().getFullYear()}
                          endYear={new Date().getFullYear() + 30}
                          dayPickerProps={{
                            disabledDays: { before: new Date() },
                          }}
                          defaultValue={new Date()}
                        />
                      </FormControl>
                      <FormControl id="end_date">
                        <FormLabel>End Date</FormLabel>
                        <InputDate
                          name="end_date"
                          control={control}
                          placeholder="Expired"
                          selectYearMode
                          startYear={new Date().getFullYear()}
                          endYear={new Date().getFullYear() + 30}
                          dayPickerProps={{
                            disabledDays: { before: new Date() },
                          }}
                          defaultValue={new Date()}
                        />
                      </FormControl>
                    </SimpleGrid>
                    <FormControl id="feature_image">
                      <FormLabel>Feature Image</FormLabel>
                      <Input type="file" {...register('image')} />
                    </FormControl>
                  </Stack>

                  <FormControl id="content">
                    <FormLabel>Content</FormLabel>
                    <Textarea
                      placeholder="Content"
                      rows={13}
                      {...register('content')}
                    />
                  </FormControl>
                </SimpleGrid>
              </CardContent>
            </Card>
          </ContentWrapper>
        </Flex>
      </Box>
    </AppShell>
  );
};

export default CreateAdvertisementPage;

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
