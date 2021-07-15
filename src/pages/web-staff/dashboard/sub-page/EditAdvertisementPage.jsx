import React, { useState, useCallback, useEffect } from 'react';
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
  Input,
  Select,
  SimpleGrid,
  Stack,
  Textarea,
  useToast,
  Icon,
  Text,
  VStack,
  Spinner,
  FormErrorMessage,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
// import { FaListUl } from 'react-icons/fa';
import { useCookies } from 'react-cookie';
import { useDropzone } from 'react-dropzone';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { useQuery, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  getAdvertisementDetail,
  updateAdvertisement,
} from 'api/institution-services/advertisement';
import { AppShell } from 'components/web-staff/shared/app-shell';
import { ContentWrapper } from 'components/web-staff/shared/sub-menu';
import { BackButton } from 'components/shared/BackButton';
import { InputDate } from 'components/shared/input';

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  category: yup.string().required('Category is required'),
  start_date: yup.string().required('Start date is required'),
  end_date: yup.string().required('End date is required'),
  content: yup.string().required('Content is required'),
});

const EditAdvertisementPage = () => {
  const params = useParams();
  const history = useHistory();
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [image, setImage] = useState('');

  const { data: dataAdvertisement, isLoading: isLoadingAdvertisement } =
    useQuery(
      ['advertisement', params?.id],
      () => getAdvertisementDetail(cookies, params?.id),
      { enabled: Boolean(params?.id) }
    );

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    reset({
      title: dataAdvertisement?.data?.title,
      category: dataAdvertisement?.data?.category,
      start_date: dataAdvertisement?.data?.start_date
        ? new Date(dataAdvertisement?.data?.start_date)
        : new Date(),
      end_date: dataAdvertisement?.data?.end_date
        ? new Date(dataAdvertisement?.data?.end_date)
        : new Date(),
      content: dataAdvertisement?.data?.content,
    });
  }, [dataAdvertisement?.data, reset]);

  const onSubmit = async value => {
    const { title, category, start_date, end_date, content } = value;
    const formattedStartDate = new Date(start_date).toISOString().split('T')[0];
    const formattedEndDate = new Date(end_date).toISOString().split('T')[0];

    const data = new FormData();
    data.append('image', image[0]);
    data.append('title', title);
    data.append('category', category);
    data.append('content', content);
    data.append('start_date', formattedStartDate);
    data.append('end_date', formattedEndDate);
    data.append('enable', true);
    data.append('is_text', true);

    try {
      setIsLoading(true);
      await updateAdvertisement(cookies, params?.id)(data);
      await queryClient.invalidateQueries(['advertisement']);
      await queryClient.invalidateQueries(['advertisement', params?.id]);
      setIsLoading(false);
      // console.log({ res });
      toast({
        position: 'top-right',
        title: 'Success',
        description: `Advertisement edited successfully`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      history.push('/dashboard/advertisement');
    } catch (error) {
      setIsLoading(false);
      toast({
        position: 'top-right',
        title: 'Error',
        description: `Error, Cannot edit advertisement`,
        status: 'error',
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
            py="6"
            px="10"
            justify="space-between"
            // mb={{ base: '3', '2xl': '6' }}
            bg="white"
            boxShadow="lg"
          >
            <Heading fontSize={{ base: '2xl', '2xl': '3xl' }}>
              Edit Advertisement
            </Heading>
            {/* <Button
              colorScheme="purple"
              as={Link}
              to="/dashboard/advertisement"
              leftIcon={<FaListUl />}
            >
              Advertisement List
            </Button> */}
          </Flex>
          <ContentWrapper bg="gray.50">
            <Flex
              justify="space-between"
              align="center"
              py="4"
              // maxW="7xl"
              // mx="auto"
            >
              <BackButton
                to="/dashboard/advertisement"
                text="Back to Advertisement List"
              />
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
            {isLoadingAdvertisement ? (
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
                <CardHeader title="Advertisement Form" />
                <CardContent px="12" py="8">
                  <SimpleGrid columns={2} gap="12">
                    <Stack spacing="4">
                      <FormControl
                        id="title"
                        isInvalid={errors?.title ? true : false}
                      >
                        <FormLabel>Title</FormLabel>
                        <Input placeholder="Title" {...register('title')} />
                        <FormErrorMessage>
                          {errors?.title && errors?.title?.message}
                        </FormErrorMessage>
                      </FormControl>
                      <FormControl
                        id="category"
                        isInvalid={errors?.category ? true : false}
                      >
                        <FormLabel>Category</FormLabel>
                        <Select {...register('category')}>
                          <option value="">Choose Category</option>
                          <option value="discount">Discount</option>
                          <option value="news">News</option>
                        </Select>
                        <FormErrorMessage>
                          {errors?.category && errors?.category?.message}
                        </FormErrorMessage>
                      </FormControl>
                      <SimpleGrid columns={2} gap="6">
                        <FormControl
                          id="start_date"
                          isInvalid={errors?.start_date ? true : false}
                        >
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
                          <FormErrorMessage>
                            {errors?.start_date && errors?.start_date?.message}
                          </FormErrorMessage>
                        </FormControl>
                        <FormControl
                          id="end_date"
                          isInvalid={errors?.end_date ? true : false}
                        >
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
                          <FormErrorMessage>
                            {errors?.end_date && errors?.end_date?.message}
                          </FormErrorMessage>
                        </FormControl>
                      </SimpleGrid>
                      <FormControl id="feature_image">
                        <FormLabel>Feature Image</FormLabel>
                        {/* <Input type="file" {...register('image')} /> */}
                        <InputDropZone
                          selectedFile={image}
                          setSelectedFile={setImage}
                        />
                      </FormControl>
                    </Stack>

                    <FormControl
                      id="content"
                      isInvalid={errors?.content ? true : false}
                    >
                      <FormLabel>Content</FormLabel>
                      <Textarea
                        placeholder="Content"
                        rows={24}
                        {...register('content')}
                      />
                      <FormErrorMessage>
                        {errors?.content && errors?.content?.message}
                      </FormErrorMessage>
                    </FormControl>
                  </SimpleGrid>
                </CardContent>
              </Card>
            )}
          </ContentWrapper>
        </Flex>
      </Box>
    </AppShell>
  );
};

export default EditAdvertisementPage;

const InputDropZone = ({ selectedFile, setSelectedFile }) => {
  // const [selectedFile, setSelectedFile] = useState('');

  const onDrop = useCallback(
    acceptedFiles => {
      setSelectedFile(acceptedFiles);
    },
    [setSelectedFile]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false,
  });

  const previewURL = selectedFile[0] && URL.createObjectURL(selectedFile[0]);

  return (
    <Center
      border="2px"
      borderStyle="dashed"
      borderColor={isDragActive ? 'purple.700' : 'gray.200'}
      bg={isDragActive ? 'purple.200' : 'white'}
      rounded="md"
      py={previewURL && !isDragActive ? '4' : '24'}
      px={previewURL ? '4' : '0'}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <Text>Drop the files here ...</Text>
      ) : (
        <VStack>
          {selectedFile ? (
            <img src={previewURL} alt="preview" />
          ) : (
            <>
              <Icon as={AiOutlineCloudUpload} w="14" h="14" color="gray.500" />
              <Text color="gray.600">
                Drag 'n' drop some files here, or click to select files
              </Text>
            </>
          )}
        </VStack>
      )}
    </Center>
  );
};

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
