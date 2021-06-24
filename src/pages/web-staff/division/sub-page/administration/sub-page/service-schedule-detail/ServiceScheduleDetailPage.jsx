import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Center,
  Divider,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Text,
  useDisclosure,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';

import {
  getServiceScheduleDetail,
  getScheduleEstimatedTimes,
} from '../../../../../../../api/institution-services/service';
import { BackButton } from '../../../../../../../components/shared/BackButton';

export const ServiceScheduleDetailPage = () => {
  const params = useParams();
  const [cookies] = useCookies(['token']);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDateId, setSelectedDateId] = useState('');
  const scheduleGridColumns = useBreakpointValue({
    base: 2,
    md: 3,
    lg: 4,
    xl: 6,
    '2xl': 7,
  });

  const {
    data: dataServiceDetail,
    isLoading: isLoadingServiceDetail,
    isSuccess: isSuccessServiceDetail,
  } = useQuery(
    ['service-schedule', params.id],
    () => getServiceScheduleDetail(cookies, params.id),
    { enabled: Boolean(params.id) }
  );

  const handleDetailTime = id => {
    setSelectedDateId(id);
    onOpen();
  };

  if (isLoadingServiceDetail) {
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

  return (
    <Box>
      <TimeDetails onClose={onClose} isOpen={isOpen} dateId={selectedDateId} />
      <BackButton
        to="/division/administration/service-schedule"
        text="Back to Service Schedules"
      />
      <Heading mb="6" fontSize="3xl">
        Service Schedule Detail
      </Heading>
      <HStack spacing={20}>
        <Box>
          <Text fontSize="md" fontWeight="medium" color="gray.500">
            Service Name
          </Text>
          <Text mt="-1" fontSize="lg" fontWeight="medium">
            {dataServiceDetail?.data?.service?.name}
          </Text>
        </Box>
        <Box>
          <Text fontSize="md" fontWeight="medium" color="gray.500">
            Employee Name
          </Text>
          <Text mt="-1" fontSize="lg" fontWeight="medium">
            {dataServiceDetail?.data?.employee_name}
          </Text>
        </Box>
      </HStack>
      <Divider mt="4" mb="5" />
      <Heading as="h3" size="md" mb="2">
        Schedule
      </Heading>
      <SimpleGrid columns={scheduleGridColumns} gap="6">
        {isSuccessServiceDetail &&
          Object.entries(dataServiceDetail?.data?.service_schedule_details).map(
            ([key, value]) => (
              <Box
                key={key}
                // as={Link}
                // to={`${url}/${value[0].id}`}
                p="6"
                bg="gray.100"
                rounded="md"
                boxShadow="md"
                _hover={{ bg: 'gray.200', cursor: 'pointer' }}
                onClick={() => handleDetailTime(value[0].id)}
              >
                <Text fontWeight="semibold">{value[0].date}</Text>
                <Text>{value[0].days}</Text>
                <Text>
                  {value[0].start_time} - {value[0].end_time}
                </Text>
              </Box>
            )
          )}
      </SimpleGrid>
    </Box>
  );
};

const TimeDetails = ({ isOpen, onClose, dateId }) => {
  const [cookies] = useCookies(['token']);

  const {
    data: dataEstimationTime,
    isLoading: isLoadingEstimationTime,
    isSuccess: isSuccessEstimationTime,
  } = useQuery(
    ['estimated-time', dateId],
    () => getScheduleEstimatedTimes(cookies, dateId),
    { enabled: Boolean(dateId) }
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Schedule Time</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoadingEstimationTime && (
            <Center h="40">
              <Spinner
                thickness="4px"
                emptyColor="gray.200"
                color="purple.500"
                size="lg"
              />
            </Center>
          )}
          {isSuccessEstimationTime && (
            <SimpleGrid columns={6} gap="2">
              {dataEstimationTime?.data?.map(time => (
                <Center
                  border="1px"
                  p="1"
                  borderColor={time.status ? 'red' : 'green'}
                  color={time.status ? 'red' : 'green'}
                  rounded="md"
                  key={time.id}
                >
                  {time.available_time}
                </Center>
              ))}
            </SimpleGrid>
          )}
          {isSuccessEstimationTime && dataEstimationTime?.code === 404 && (
            <Center h="40">
              <Text>Empty</Text>
            </Center>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
