import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  Image,
  Spinner,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';
import Lightbox from 'react-image-lightbox';

import { getRadiologyResultDetail } from '../../../../../api/radiology-services/result';
import { getRadiologyDetail } from '../../../../../api/radiology-services/radiology';
import { BackButton } from '../../../../../components/shared/BackButton';

export const ImagingResultDetail = () => {
  const [cookies] = useCookies(['token']);
  const params = useParams();
  const [isOpenImage, setIsOpenImage] = useState(false);

  const {
    data: dataRadiologyResultDetail,
    isLoading: isLoadingRadiologyResultDetail,
  } = useQuery(
    ['radiology-test-result', params?.id],
    () => getRadiologyResultDetail(cookies, params?.id),
    { enabled: Boolean(params?.id) }
  );

  const { data: dataRadiologyDetail, isLoading: isLoadingRadiologyDetail } =
    useQuery(
      ['radiology-list', dataRadiologyResultDetail?.data?.radiology_id],
      () =>
        getRadiologyDetail(
          cookies,
          dataRadiologyResultDetail?.data?.radiology_id
        ),
      { enabled: Boolean(dataRadiologyResultDetail?.data?.radiology_id) }
    );

  if (isLoadingRadiologyResultDetail || isLoadingRadiologyDetail) {
    return (
      <Center h="60">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="purple.500"
          size="xl"
        />
      </Center>
    );
  }

  // console.log({ dataRadiologyResultDetail });
  // console.log({ dataRadiologyDetail });

  return (
    <Box>
      <BackButton to="/events/imaging" text="Back to Imaging" />

      <Heading
        mb={{ base: '3', '2xl': '6' }}
        fontSize={{ base: '2xl', '2xl': '3xl' }}
      >
        Imaging Result
      </Heading>
      <Box p="8" boxShadow="md" rounded="md" maxW="3xl" bg="white">
        <Box mb="4">
          <Heading size="sm" mb="1" mt="2">
            Patient Info
          </Heading>
          <Description
            title="Patient Name"
            value={dataRadiologyDetail?.data?.patient_data?.name}
          />
          <Description
            title="Patient Number"
            value={dataRadiologyDetail?.data?.patient_data?.patient_number}
          />
        </Box>
        <Divider />
        <Box mb="4">
          <Heading size="sm" mb="1" mt="2">
            Employee Info
          </Heading>
          <Description
            title="Employee Name"
            value={dataRadiologyDetail?.data?.employee_data?.name}
          />
          <Description
            title="Employee Number"
            value={dataRadiologyDetail?.data?.employee_data?.employee_number}
          />
          <Description
            title="Profession"
            value={dataRadiologyDetail?.data?.employee_data?.profession}
          />
        </Box>
        <Divider />
        <Box mb="4">
          <Heading size="sm" mb="1" mt="2">
            Test Info
          </Heading>
          <Description
            title="SOAP ID"
            value={
              <Button
                as={Link}
                to={`/events/examination/result/${dataRadiologyDetail?.data?.soap_id}`}
                variant="link"
                colorScheme="purple"
              >
                {dataRadiologyDetail?.data?.soap_id}
              </Button>
            }
          />
          <Description title="Date" value={dataRadiologyDetail?.data?.date} />
          <Description title="Time" value={dataRadiologyDetail?.data?.time} />
          <Description
            title="Status"
            value={
              <Badge colorScheme="green">
                {dataRadiologyDetail?.data?.status}
              </Badge>
            }
          />
        </Box>
        <Divider />
        <Box mb="4">
          <Heading size="sm" mb="1" mt="2">
            Result
          </Heading>
          {isOpenImage && (
            <Lightbox
              mainSrc={`${process.env.REACT_APP_UPLOADED_FILE_URL}/${dataRadiologyResultDetail?.data?.image}`}
              onCloseRequest={() => setIsOpenImage(false)}
            />
          )}
          <Description
            title="Description"
            value={dataRadiologyResultDetail?.data?.description}
          />
          <Description
            title="Image"
            value={
              <Image
                onClick={() => {
                  setIsOpenImage(true);
                }}
                _hover={{ opacity: 0.7 }}
                cursor="pointer"
                boxSize="250px"
                objectFit="cover"
                src={`${process.env.REACT_APP_UPLOADED_FILE_URL}/${dataRadiologyResultDetail?.data?.image}`}
                alt="Imaging Result"
              />
            }
          />
        </Box>
      </Box>
    </Box>
  );
};

const Description = ({ title, value }) => {
  return (
    <Flex as="dl" direction={{ base: 'column', sm: 'row' }} py="2">
      <Box as="dt" flexBasis="40%">
        {title}
      </Box>
      <Box as="dd" flex="1" fontWeight="semibold">
        {value}
      </Box>
    </Flex>
  );
};
