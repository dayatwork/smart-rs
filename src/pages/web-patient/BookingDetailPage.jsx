import React, { useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
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
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useQuery, useQueryClient } from 'react-query';
import QRCode from 'qrcode.react';
import { BsCaretLeftFill } from 'react-icons/bs';

import { WebPatientNav, Wrapper } from '../../components/web-patient/shared';
import {
  getQRCode,
  cancelBooking,
  getBookingDetail,
} from '../../api/booking-services/booking';
import { OrderDetail } from './OrderDetail';

export const BookingDetailPage = () => {
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

  const {
    onClose: onCancelClose,
    onOpen: onCancelOpen,
    isOpen: isCancelOpen,
  } = useDisclosure();

  const { data: dataBookingDetail, isLoading: isLoadingBookingDetail } =
    useQuery(
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
        title: 'Error',
        description: `Cancel booking gagal`,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  console.log({ dataBookingDetail });

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
          color="blue.600"
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
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </Center>
        ) : (
          <Grid templateColumns={bookingDetailGridTemplate} gap="10">
            <GridItem colSpan={2}>
              <Card>
                <CardHeader
                  title="Booking Info"
                  action={
                    <HStack>
                      <Text fontWeight="semibold">Status: </Text>
                      {status === 'booked' ? (
                        <Badge colorScheme="orange">{status}</Badge>
                      ) : status === 'done' ? (
                        <Badge colorScheme="blue">Checked In</Badge>
                      ) : status === 'cancel' ? (
                        <Badge colorScheme="red">{status}</Badge>
                      ) : (
                        <Badge>{status}</Badge>
                      )}
                    </HStack>
                  }
                />
                <CardContent>
                  <Property
                    label="Patient Name"
                    value={dataBookingDetail?.data?.patient?.name}
                  />
                  <Property
                    label="Service Name"
                    value={
                      dataBookingDetail?.data?.schedule?.service_data?.name
                    }
                  />
                  <Property
                    label="Doctor Name"
                    value={
                      dataBookingDetail?.data?.schedule?.employee_data?.name
                    }
                  />
                  <Property
                    label="Date"
                    value={`${
                      dataBookingDetail?.data?.schedule?.days
                    }, ${new Date(
                      dataBookingDetail?.data?.schedule?.date
                    ).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}`}
                  />
                  <Property
                    label="Time"
                    value={dataBookingDetail?.data?.schedule?.available_time}
                  />
                  <Property
                    label="Transaction"
                    value={dataBookingDetail?.data?.transaction_number}
                  />
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
                  <CardHeader title="Info" />
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
            orderId={dataBookingDetail?.data?.booking_orders[0]?.order_id}
          />
        )}
      </Wrapper>
    </Flex>
  );
};

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
      px="6"
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
