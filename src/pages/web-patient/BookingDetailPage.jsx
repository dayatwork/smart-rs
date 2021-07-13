import React, { useState } from 'react';
import { Link, useParams, useHistory, Redirect } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Spinner,
  Text,
  useDisclosure,
  useToast,
  useBreakpointValue,
  Divider,
  Avatar,
  Icon,
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useQuery, useQueryClient } from 'react-query';
import QRCode from 'qrcode.react';
import { BsCaretLeftFill } from 'react-icons/bs';
import { GiTicket } from 'react-icons/gi';

import { WebPatientNav, Wrapper } from '../../components/web-patient/shared';
import {
  getQRCode,
  cancelBooking,
  getBookingDetail,
} from '../../api/booking-services/booking';
import { OrderDetail } from './OrderDetail';
import {
  RiCalendarEventFill,
  RiInformationLine,
  // RiHospitalFill,
  RiTimerLine,
} from 'react-icons/ri';

const BookingDetailPage = () => {
  const history = useHistory();
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const params = useParams();
  const [isLoadingCancel, setIsLoadingCancel] = useState(false);
  const queryClient = useQueryClient();
  const bookingDetailGridTemplate = useBreakpointValue({
    base: 'repeat(1, 1fr)',
    md: 'repeat(3, 1fr)',
  });
  const bookingInfoColumns = useBreakpointValue({
    base: 'repeat(2,1fr)',
    lg: 'repeat(3,1fr)',
  });

  const {
    onClose: onCancelClose,
    onOpen: onCancelOpen,
    isOpen: isCancelOpen,
  } = useDisclosure();

  const {
    data: dataBookingDetail,
    isLoading: isLoadingBookingDetail,
    isSuccess: isSuccessBookingDetail,
  } = useQuery(
    ['booking-detail', params.id],
    () => getBookingDetail(cookies, params.id),
    { enabled: Boolean(params.id) }
  );

  const status = dataBookingDetail?.data?.booking_status?.toLowerCase();

  const { data: dataQR, isLoading: isLoadingQR } = useQuery(
    ['patient-qr', params.id, status],
    () => getQRCode(cookies, params.id),
    {
      enabled: params.id && status !== 'cancel',
    }
  );

  // console.log({ dataQR });

  const handleCancel = async () => {
    if (
      !params.id ||
      dataBookingDetail?.data?.booking_status?.toLowerCase() !== 'booked'
    ) {
      return;
    }

    try {
      setIsLoadingCancel(true);
      await cancelBooking(cookies, params.id);
      await queryClient.invalidateQueries('user-booking-list');
      setIsLoadingCancel(false);
      toast({
        position: 'top-right',
        title: 'Success',
        description: `Cancel booking success`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      onCancelClose();
      history.replace('/doctor');
    } catch (error) {
      setIsLoadingCancel(false);
      toast({
        position: 'top-right',
        title: 'Error',
        description: `Cancel booking gagal`,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  if (
    isSuccessBookingDetail &&
    dataBookingDetail?.data?.patient?.user_id !== cookies.user.id
  ) {
    return <Redirect to="/" />;
  }

  return (
    <Flex direction="column" bg="gray.100" minH="100vh">
      <WebPatientNav active="doctor" />
      <CancelBookingAlert
        isOpen={isCancelOpen}
        onClose={onCancelClose}
        handleCancel={handleCancel}
        isLoadingCancel={isLoadingCancel}
      />
      <Wrapper>
        <Box
          as={Link}
          to="/doctor"
          display="inline-flex"
          alignItems="center"
          color="secondary.dark"
          fontSize="sm"
          fontWeight="semibold"
          mb="4"
          rounded="lg"
          px="2"
          py="1"
          _hover={{ bg: 'gray.50' }}
        >
          <Box as={BsCaretLeftFill} fontSize="xs" marginEnd="1" />
          Back to list
        </Box>

        <Flex justify="space-between" align="center">
          <Heading fontSize="2xl" mb="8">
            Detail Booking
          </Heading>
          {dataBookingDetail?.data?.booking_status?.toLowerCase() ===
            'booked' &&
            dataBookingDetail?.data?.booking_orders[0]?.status !== 'paid' && (
              <Button
                onClick={onCancelOpen}
                colorScheme="red"
                variant="ghost"
                isDisabled={isLoadingBookingDetail || isLoadingQR}
              >
                Cancel Booking
              </Button>
            )}
        </Flex>

        {isLoadingBookingDetail || isLoadingQR ? (
          <Center h="60">
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="secondary.light"
              color="secondary.dark"
              size="xl"
            />
          </Center>
        ) : (
          <Grid templateColumns={bookingDetailGridTemplate} gap="10">
            <GridItem colSpan={2}>
              <Card>
                <CardHeader
                  title={
                    <HStack>
                      <Icon color="secondary.dark" as={GiTicket} w="5" h="5" />
                      <Text>Booking Info</Text>
                    </HStack>
                  }
                  action={
                    <HStack spacing="4">
                      <Text fontWeight="semibold" fontSize="sm">
                        Booking Status{' '}
                      </Text>
                      {status === 'booked' ? (
                        <Box
                          bgColor="orange.200"
                          px="3"
                          py="1"
                          fontWeight="bold"
                          rounded="full"
                          color="orange.800"
                          textTransform="uppercase"
                          fontSize="sm"
                        >
                          {status}
                        </Box>
                      ) : status === 'done' ? (
                        <Box
                          bgColor="blue.200"
                          px="3"
                          py="1"
                          fontWeight="bold"
                          rounded="full"
                          color="blue.800"
                          textTransform="uppercase"
                          fontSize="sm"
                        >
                          Checked In
                        </Box>
                      ) : status === 'cancel' ? (
                        <Box
                          bgColor="red.200"
                          px="3"
                          py="1"
                          fontWeight="bold"
                          rounded="full"
                          color="red.800"
                          textTransform="uppercase"
                          fontSize="sm"
                        >
                          {status}
                        </Box>
                      ) : (
                        <Box
                          bgColor="gray.200"
                          px="3"
                          py="1"
                          fontWeight="bold"
                          rounded="full"
                          color="gray.800"
                          textTransform="uppercase"
                          fontSize="sm"
                        >
                          {status}
                        </Box>
                      )}
                    </HStack>
                  }
                />
                <CardContent>
                  <Grid
                    gridTemplateColumns={bookingInfoColumns}
                    py="4"
                    columnGap={{ base: '2', lg: '4' }}
                  >
                    <GridItem colSpan={{ base: 2, lg: 1 }}>
                      <Flex
                        px="6"
                        py={{ base: '2', lg: '4' }}
                        alignItems="center"
                      >
                        <Avatar
                          rounded="full"
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt="foto pasien"
                          size="lg"
                        />

                        <Box flexGrow="1" ml="4">
                          <Flex justify="space-between">
                            <Box>
                              <Text
                                fontSize="sm"
                                fontWeight="semibold"
                                color="gray.600"
                              >
                                Patient Name
                              </Text>
                              <Text fontWeight="semibold">
                                {dataBookingDetail?.data?.patient?.name}
                              </Text>
                            </Box>
                          </Flex>
                        </Box>
                      </Flex>
                    </GridItem>
                    <GridItem colSpan={{ base: 2, lg: 1 }}>
                      <Flex
                        px="6"
                        py={{ base: '2', lg: '4' }}
                        alignItems="center"
                      >
                        <Avatar
                          rounded="full"
                          src="/images/doctor.jpg"
                          alt="foto dokter"
                          size="lg"
                        />

                        <Box flexGrow="1" ml="4">
                          <Flex justify="space-between">
                            <Box>
                              <Text
                                fontSize="sm"
                                fontWeight="semibold"
                                color="gray.600"
                              >
                                Doctor Name
                              </Text>
                              <Text fontWeight="semibold">
                                {
                                  dataBookingDetail?.data?.schedule
                                    ?.employee_data?.name
                                }
                              </Text>
                            </Box>
                          </Flex>
                        </Box>
                      </Flex>
                    </GridItem>
                    <GridItem colSpan={{ base: 2, lg: 1 }}>
                      <Box
                        px={{ base: '6', lg: '0' }}
                        py={{ base: '3', lg: '0' }}
                      >
                        <Box mb="4">
                          <Text
                            fontSize="sm"
                            color="gray.600"
                            fontWeight="semibold"
                          >
                            Service Name
                          </Text>
                          <Text fontWeight="semibold">
                            {
                              dataBookingDetail?.data?.schedule?.service_data
                                ?.name
                            }
                          </Text>
                        </Box>
                        <Box>
                          <Text
                            fontSize="sm"
                            color="gray.600"
                            fontWeight="semibold"
                          >
                            Transaction Number
                          </Text>
                          <Text fontWeight="semibold">
                            {dataBookingDetail?.data?.transaction_number}
                          </Text>
                        </Box>
                      </Box>
                    </GridItem>
                  </Grid>
                  <Divider />
                  <Flex
                    px="6"
                    py="4"
                    alignItems="center"
                    color="gray.600"
                    fontSize="sm"
                    fontWeight="medium"
                  >
                    <Text mr="8" color="gray.900" fontWeight="bold">
                      Schedule
                    </Text>
                    {/* <HStack mr="6" spacing="1">
                      <Icon as={RiHospitalFill} w="5" h="5" />
                      <span>RS KIC</span>
                    </HStack> */}
                    <HStack mr="6" spacing="1">
                      <Icon
                        color="secondary.dark"
                        as={RiCalendarEventFill}
                        w="5"
                        h="5"
                      />
                      <span>{`${
                        dataBookingDetail?.data?.schedule?.days
                      }, ${new Date(
                        dataBookingDetail?.data?.schedule?.date
                      ).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}`}</span>
                    </HStack>
                    <HStack mr="6" spacing="1">
                      <Icon
                        color="secondary.dark"
                        as={RiTimerLine}
                        w="5"
                        h="5"
                      />
                      <span>
                        {dataBookingDetail?.data?.schedule?.available_time}
                      </span>
                    </HStack>
                  </Flex>
                </CardContent>
              </Card>
            </GridItem>
            {dataQR &&
              dataBookingDetail?.data?.booking_orders[0]?.status === 'paid' && (
                <GridItem colSpan={{ base: 2, md: 1 }}>
                  <Card>
                    <CardHeader title="QR Code Booking" />
                    <Center py="10">
                      <QRCode value={dataQR?.data?.qrcode} />
                    </Center>
                  </Card>
                </GridItem>
              )}
            {dataBookingDetail?.data?.booking_orders[0]?.status ===
              'pending payment' && (
              <GridItem colSpan={{ base: 2, md: 1 }}>
                <Card>
                  <CardHeader
                    title={
                      <HStack>
                        <Icon
                          color="secondary.dark"
                          as={RiInformationLine}
                          w="5"
                          h="5"
                        />
                        <Text>Info</Text>
                      </HStack>
                    }
                  />
                  <Text px="6" py="4">
                    Lakukan pembayaran dan konfirmasi pembayaran untuk
                    mendapatkan QR Code untuk check in
                  </Text>
                </Card>
              </GridItem>
            )}
          </Grid>
        )}

        <Divider my="6" />

        {/* ORDER DETAIL */}
        {dataBookingDetail?.data?.booking_orders[0]?.order_id && (
          <OrderDetail
            bookingStatus={status}
            orderId={dataBookingDetail?.data?.booking_orders[0]?.order_id}
          />
        )}
      </Wrapper>
    </Flex>
  );
};

export default BookingDetailPage;

const CancelBookingAlert = ({
  isOpen,
  onClose,
  handleCancel,
  isLoadingCancel,
}) => {
  return (
    <>
      <AlertDialog isOpen={isOpen} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Cancel Booking
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can not undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onClose}>Close</Button>
              <Button
                colorScheme="red"
                onClick={handleCancel}
                ml={3}
                isLoading={isLoadingCancel}
              >
                Cancel Booking
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export const Card = props => (
  <Box
    bg="white"
    rounded={{
      md: 'lg',
    }}
    shadow="base"
    overflow="hidden"
    {...props}
  />
);

export const CardHeader = props => {
  const { title, action } = props;
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

export const Property = props => {
  const { label, value, ...flexProps } = props;
  return (
    <Flex
      as="dl"
      direction={{
        base: 'column',
        sm: 'row',
      }}
      px="6"
      py="4"
      _even={{
        bg: 'gray.50',
      }}
      {...flexProps}
    >
      <Box as="dt" flexBasis={{ base: '40%', md: '30%' }}>
        {label}
      </Box>
      <Box as="dd" flex="1" fontWeight="semibold">
        {value}
      </Box>
    </Flex>
  );
};
