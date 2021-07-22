import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Select,
  Textarea,
  useToast,
  Spinner,
  FormErrorMessage,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';

import { useCookies } from 'react-cookie';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  getFAQDetail,
  updateFAQ,
  getFAQCategoryList,
} from 'api/application-services/faq';
import { AppShell } from 'components/web-staff/shared/app-shell';
import { ContentWrapper } from 'components/web-staff/shared/sub-menu';
import { BackButton } from 'components/shared/BackButton';

const schema = yup.object().shape({
  category_id: yup.string().required('Category is required'),
  question: yup.string().required('Question is required'),
  answer: yup.string().required('Answer is required'),
});

const EditFAQPage = () => {
  const params = useParams();
  const history = useHistory();
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [, setErrMessage] = useState('');

  const { data: dataFAQ, isLoading: isLoadingFAQ } = useQuery(
    ['faq', params?.id],
    () => getFAQDetail(cookies, params?.id),
    { enabled: Boolean(params?.id) }
  );

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

  useEffect(() => {
    reset({
      category_id: dataFAQ?.data?.category_id,
      question: dataFAQ?.data?.question,
      answer: dataFAQ?.data?.answer,
    });
  }, [dataFAQ?.data, reset]);

  const { mutate } = useMutation(updateFAQ(cookies, params?.id), {
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
          description: `FAQ edited successfully`,
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
        <title>Edit FAQ | SMART-RS</title>
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
            <Heading fontSize={{ base: '2xl', '2xl': '3xl' }}>Edit FAQ</Heading>
          </Flex>
          <ContentWrapper bg="gray.50">
            <Flex
              justify="space-between"
              align="center"
              py="4"
              // maxW="7xl"
              // mx="auto"
            >
              <BackButton to="/dashboard/faq" text="Back to FAQ List" />
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
            {isLoadingFAQ ? (
              <Center py="10">
                <Spinner
                  thickness="4px"
                  emptyColor="gray.200"
                  color="purple.500"
                  size="xl"
                />
              </Center>
            ) : (
              <Card pb="8">
                <CardHeader title="FAQ Form" />
                <CardContent px="12" py="8">
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
            )}
          </ContentWrapper>
        </Flex>
      </Box>
    </AppShell>
  );
};

export default EditFAQPage;

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
