import React, { useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  SimpleGrid,
  Text,
  Heading,
  Center,
  Spinner,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useQuery } from 'react-query';
import { useForm } from 'react-hook-form';

import { getRadiologyDetail } from '../../../../../api/radiology-services/radiology';
import {
  createRadiologyResult,
  // getRadiologyResultDetail,
} from '../../../../../api/radiology-services/result';
import { BackButton } from '../../../../../components/shared/BackButton';
import { PrivateComponent, Permissions } from '../../../../../access-control';
// import { createRadiologyResult } from "query/radiology/result";

export const ImagingDetails = () => {
  const toast = useToast();
  const history = useHistory();
  const params = useParams();
  const [cookies] = useCookies(['token']);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit } = useForm();

  const { data: dataRadiologyDetails, isLoading: isLoadingRadiologyDetails } =
    useQuery(
      ['radiology-details', params?.id],
      () => getRadiologyDetail(cookies, params?.id),
      { enabled: Boolean(params?.id) }
    );
  // console.log({ dataRadiologyDetails });

  // const { data: dataResultDetail, isLoading: isLoadingResultDetail } = useQuery(
  //   ['radiology-result', dataRadiologyDetails?.data?.id],
  //   () => getRadiologyResultDetail(cookies, dataRadiologyDetails?.data?.id),
  //   { enabled: Boolean(dataRadiologyDetails?.data?.id) }
  // );
  // console.log({ dataResultDetail });

  const onSubmit = async value => {
    const data = new FormData();
    data.append('image', value.image[0]);
    data.append('patient_id', dataRadiologyDetails?.data?.patient_id);
    data.append('institution_id', dataRadiologyDetails?.data?.institution_id);
    data.append('radiology_id', dataRadiologyDetails?.data?.id);
    data.append('description', value.description);

    try {
      setIsLoading(true);
      await createRadiologyResult(
        cookies,
        data,
        dataRadiologyDetails?.data?.patient_id
      );
      // console.log({ res });
      setIsLoading(false);
      toast({
        position: 'top-right',
        title: 'Success',
        description: 'Imaging result uploaded successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      history.push('/events/imaging');
    } catch (error) {
      setIsLoading(false);
      toast({
        position: 'top-right',
        title: 'Error',
        description: 'Error upload imaging result',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  if (isLoadingRadiologyDetails) {
    return (
      <Center h="48">
        <Spinner
          thickness="4px"
          emptyColor="gray.200"
          color="purple.500"
          size="xl"
        />
      </Center>
    );
  }

  return (
    <Box>
      <BackButton to="/events/imaging" text="Back to Imaging List" />
      <Heading
        mb={{ base: '3', '2xl': '6' }}
        fontSize={{ base: '2xl', '2xl': '3xl' }}
      >
        Imaging Details
      </Heading>
      {/* <Text mb="4">Booking ID: {dataRadiologyDetails?.data?.id}</Text> */}

      <SimpleGrid columns={{ base: 1, xl: 2 }} gap="10" mb="8">
        <Box>
          <Flex
            p="4"
            align={{ base: 'baseline', md: 'center' }}
            justify="space-between"
            bg="white"
            boxShadow="md"
            direction={{ base: 'column', md: 'row' }}
          >
            <Flex align="center" px="4" mb={{ base: '4', lg: '0' }}>
              <Avatar
                size="xl"
                name="Segun Adebayo"
                src="https://bit.ly/broken-link"
                mr="6"
              />
              <Box>
                <Text fontSize="2xl" fontWeight="bold">
                  {dataRadiologyDetails?.data?.patient_data?.name}
                </Text>
                <Text fontWeight="semibold" color="gray.600">
                  Patient Number:{' '}
                  {dataRadiologyDetails?.data?.patient_data?.patient_number}
                </Text>
              </Box>
            </Flex>
            {/* <Box px="4">
            <Text fontWeight="semibold">Patient Type</Text>
            <Text fontSize="lg" fontWeight="bold" color="purple.500">
              Private
            </Text>
          </Box> */}
          </Flex>
          <Divider />
          <Flex
            p="4"
            align={{ base: 'baseline', md: 'center' }}
            justify="space-between"
            bg="white"
            boxShadow="md"
            direction={{ base: 'column', md: 'row' }}
          >
            <Flex align="center" px="4" mb={{ base: '4', lg: '0' }}>
              <Avatar
                size="xl"
                name="Segun Adebayo"
                src="https://bit.ly/broken-link"
                mr="6"
              />
              <Box>
                <Text fontSize="2xl" fontWeight="bold">
                  {dataRadiologyDetails?.data?.employee_data?.name}
                </Text>
                <Text fontWeight="semibold" color="gray.600">
                  Employee Number:{' '}
                  {dataRadiologyDetails?.data?.employee_data?.employee_number}
                </Text>
              </Box>
            </Flex>
            {/* <Box px="4">
            <Text fontWeight="semibold">Patient Type</Text>
            <Text fontSize="lg" fontWeight="bold" color="purple.500">
              Private
            </Text>
          </Box> */}
          </Flex>
        </Box>

        <Box p="4" bg="white" boxShadow="md">
          <Description title="Test Type" value="" />
          <Description title="Date" value={dataRadiologyDetails?.data?.date} />
          <Description title="Time" value={dataRadiologyDetails?.data?.time} />
          <Description
            title="Description"
            value={dataRadiologyDetails?.data?.description}
          />
          <Description
            title="SOAP ID"
            value={
              <Button
                as={Link}
                variant="link"
                colorScheme="purple"
                to={`/events/examination/details/${dataRadiologyDetails?.data?.soap_id}`}
                target="_blank"
              >
                {dataRadiologyDetails?.data?.soap_id}
              </Button>
            }
          />
        </Box>
      </SimpleGrid>
      {dataRadiologyDetails?.data?.status === 'process' && (
        <>
          <Box rounded={{ md: 'lg' }} bg="white" shadow="base">
            <Flex align="center" justify="space-between" px="6" py="4">
              <Text as="h3" fontWeight="bold" fontSize="lg">
                Upload Result
              </Text>
            </Flex>
            <Divider />
            <Box px="6" py="4">
              <Flex as="dl" direction={{ base: 'column', md: 'row' }} py="2">
                <Box as="dt" flexBasis="25%" color="gray.600">
                  Image
                </Box>
                <Box as="dd" flex="1" fontWeight="semibold">
                  <input
                    type="file"
                    border="none"
                    accept="image/png, application/pdf, image/jpeg"
                    p="0"
                    pl="1"
                    {...register('image')}
                  />
                </Box>
              </Flex>
              <Flex as="dl" direction={{ base: 'column', md: 'row' }} py="2">
                <Box as="dt" flexBasis="25%" color="gray.600">
                  Description
                </Box>
                <Box as="dd" flex="1" fontWeight="semibold" maxW="xl">
                  <Textarea rows={5} {...register('description')} />
                </Box>
              </Flex>
            </Box>
          </Box>
          <PrivateComponent permission={Permissions.updateImaging}>
            <Box textAlign="right" mt="4">
              <Button
                colorScheme="purple"
                size="lg"
                onClick={handleSubmit(onSubmit)}
                isLoading={isLoading}
              >
                Submit
              </Button>
            </Box>
          </PrivateComponent>
        </>
      )}
      {/* {dataRadiologyDetails?.data?.status === 'completed' && (
        <Box rounded={{ md: 'lg' }} bg="white" shadow="base">
          <Flex align="center" justify="space-between" px="6" py="4">
            <Text as="h3" fontWeight="bold" fontSize="lg">
              Result
            </Text>
          </Flex>
          <Divider />
          <Box px="6" py="4">
            <Flex as="dl" direction={{ base: 'column', md: 'row' }} py="2">
              <Box as="dt" flexBasis="25%" color="gray.600">
                Image
              </Box>
              <Box as="dd" flex="1" fontWeight="semibold">
                <input
                  type="file"
                  border="none"
                  accept="image/png, application/pdf, image/jpeg"
                  p="0"
                  pl="1"
                  {...register('image')}
                />
              </Box>
            </Flex>
            <Flex as="dl" direction={{ base: 'column', md: 'row' }} py="2">
              <Box as="dt" flexBasis="25%" color="gray.600">
                Description
              </Box>
              <Box as="dd" flex="1" fontWeight="semibold" maxW="xl">
                <Textarea rows={5} {...register('description')} />
              </Box>
            </Flex>
          </Box>
        </Box>
      )} */}
    </Box>
  );
};

const Description = ({ title, value }) => {
  return (
    <Flex
      as="dl"
      direction={{ base: 'column', md: 'row' }}
      // px="6"
      py="2"
      // _even={{ bgColor: "gray.50" }}
    >
      <Box as="dt" flexBasis="25%" color="gray.600">
        {title}
      </Box>
      <Box as="dd" flex="1" fontWeight="semibold">
        {value}
      </Box>
    </Flex>
  );
};
