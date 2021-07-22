import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  HStack,
  Select,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import { FaListUl } from 'react-icons/fa';
import { useCookies } from 'react-cookie';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQueryClient, useQuery, useMutation } from 'react-query';

import { getFAQCategoryList, createFAQ } from 'api/application-services/faq';
import { AppShell } from 'components/web-staff/shared/app-shell';
import { ContentWrapper } from 'components/web-staff/shared/sub-menu';
import { BackButton } from 'components/shared/BackButton';

const schema = yup.object().shape({
  category_id: yup.string().required('Category is required'),
  question: yup.string().required('Question is required'),
  answer: yup.string().required('Answer is required'),
});

const CreateFAQPage = () => {
  const history = useHistory();
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [, setErrMessage] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data: dataFAQCategory, isLoading: isLoadingFAQCategory } = useQuery(
    ['faq-category'],
    () => getFAQCategoryList(cookies)
  );

  const { mutate } = useMutation(createFAQ(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      if (data) {
        await queryClient.invalidateQueries(['faq']);
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          position: 'top-right',
          title: 'Success',
          description: `FAQ added successfully`,
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
        history.push('/dashboard/faq');
      }

      if (error) {
        setErrMessage(error.message || 'Error');
      }
    },
    onError: () => {
      // mutation error
    },
    onSuccess: () => {
      // mutation success
    },
  });

  const onSubmit = async values => {
    const data = {
      category_id: values.category_id,
      question: values.question,
      answer: values.answer,
    };

    await mutate(data);
  };

  return (
    <AppShell>
      <Helmet>
        <title>Create FAQ | SMART-RS</title>
      </Helmet>
      <Box height="full" overflow="hidden" position="relative" w="full">
        <Flex h="full" direction="column">
          <Flex
            py="6"
            px="10"
            justify="space-between"
            // mb={{ base: '3', '2xl': '6' }}
            bg="white"
            boxShadow="lg"
          >
            <Heading fontSize={{ base: '2xl', '2xl': '3xl' }}>New FAQ</Heading>
            <Button
              colorScheme="purple"
              as={Link}
              to="/dashboard/faq"
              leftIcon={<FaListUl />}
            >
              FAQ List
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
              <CardContent px="8" py="8">
                <Box>
                  <FormControl
                    id="category"
                    mb="4"
                    isInvalid={errors?.category_id ? true : false}
                  >
                    <FormLabel>Category</FormLabel>
                    <Select
                      disabled={isLoadingFAQCategory}
                      {...register('category_id')}
                    >
                      <option value="">Select Category</option>
                      {dataFAQCategory?.data?.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Select>
                    <FormErrorMessage>
                      {errors.category_id && errors.category_id.message}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl id="question" mb="4">
                    <FormLabel>Question</FormLabel>
                    <Textarea {...register('question')} />
                    <FormErrorMessage>
                      {errors.question && errors.question.message}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl id="answer" mb="4">
                    <FormLabel>Answer</FormLabel>
                    <Textarea rows={5} {...register('answer')} />
                  </FormControl>
                </Box>
              </CardContent>
            </Card>
          </ContentWrapper>
        </Flex>
      </Box>
    </AppShell>
  );
};

export default CreateFAQPage;

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
