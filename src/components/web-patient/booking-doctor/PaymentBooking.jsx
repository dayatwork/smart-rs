import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  Grid,
  GridItem,
  Select,
  Text,
  VisuallyHidden,
  useToast,
  Center,
  Spinner,
  useBreakpointValue,
  Image,
  HStack,
  Icon,
} from '@chakra-ui/react';
import {
  FaArrowLeft,
  FaArrowRight,
  FaUserMd,
  FaUserAlt,
  FaMoneyBillAlt,
} from 'react-icons/fa';
import { HiPencilAlt } from 'react-icons/hi';
import { useCookies } from 'react-cookie';
import { useQuery, useQueryClient } from 'react-query';
import QRCode from 'qrcode.react';
import { GiHeartBeats } from 'react-icons/gi';
import {
  RiCalendarEventFill,
  RiHospitalFill,
  RiTimerLine,
  RiContactsBook2Line,
  RiUser3Fill,
} from 'react-icons/ri';
import doctorImg from './doctor.jpg';

import { createBooking } from '../../../api/booking-services/booking';
import { getServicePriceDetails } from '../../../api/finance-services/service-price';
import { getPaymentMethods } from '../../../api/institution-services/payment-method';
import { createOrder } from '../../../api/payment-services/order';

const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
});

export const PaymentBooking = ({
  currentStep,
  currentStepIndex,
  setCurrentStepIndex,
  patient,
  patientData,
  selectedSchedule,
  selectedTime,
  selectedService,
  otherPatientId,
}) => {
  // console.log({ patientData });
  // console.log({ otherPatientId });
  const history = useHistory();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [cookies] = useCookies(['token']);
  const [bookingData, setBookingData] = useState(null);
  const queryClient = useQueryClient();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const paymentBookingGridTemplate = useBreakpointValue({
    base: 'repeat(1, 1fr)',
    md: 'repeat(2, 1fr)',
    xl: 'repeat(3, 1fr)',
  });
  const buttonSize = useBreakpointValue({ base: 'sm', md: 'md' });

  const { data: dataPaymentMethods } = useQuery(
    ['institution-payment-methods', selectedSchedule?.institution?.id],
    () => getPaymentMethods(cookies, selectedSchedule?.institution?.id),
    {
      enabled: Boolean(selectedSchedule?.institution?.id),
    }
  );

  const {
    data: dataServicePrice,
    isLoading: isLoadingServicePrice,
    isSuccess: isSuccessServicePrice,
  } = useQuery(
    [
      'service-price',
      selectedSchedule?.service?.id,
      selectedSchedule?.institution?.id,
    ],
    () =>
      getServicePriceDetails(
        cookies,
        selectedSchedule?.institution?.id,
        selectedSchedule?.service?.id
      ),
    {
      enabled:
        Boolean(selectedSchedule?.service?.id) &&
        Boolean(selectedSchedule?.institution?.id),
    }
  );

  // console.log({ selectedService });
  // console.log({ selectedSchedule });

  const handleBooking = async () => {
    if (!selectedPaymentMethod) return;

    const paymentMethod = JSON.parse(selectedPaymentMethod);

    try {
      if (selectedSchedule && selectedTime) {
        let data;
        if (patient === 'me') {
          data = {
            ourself: 1,
            type: 'appointment',
            institution_id: selectedSchedule?.institution?.id,
            // service_id: selectedSchedule?.service?.id,
            service_id: selectedService,
            schedule_id: selectedSchedule?.schedule_id,
            schedule_detail_id: selectedSchedule?.id,
            estimate_time_id: selectedTime?.id,
          };
        } else {
          data = {
            ourself: 0,
            type: 'appointment',
            institution_id: selectedSchedule?.institution?.id,
            // service_id: selectedSchedule?.service?.id,
            service_id: selectedService,
            schedule_id: selectedSchedule?.schedule_id,
            schedule_detail_id: selectedSchedule?.id,
            estimate_time_id: selectedTime?.id,
            name: patientData?.fullname,
            email: patientData?.email,
            identity_number: patientData?.identity_number,
            phone_number: patientData?.phone_number,
            birth_date: patientData?.birth_date,
            gender: patientData?.gender,
            marital_status: patientData?.marital_status,
            address: patientData?.address,
            responsible_status: patientData?.responsible_status,
          };
        }
        // console.log({ data });
        setIsLoading(true);
        const res = await createBooking(cookies, data);
        // console.log({ resBooking: res });
        const orderData = {
          booking_order_id: res?.data?.booking_order?.id,
          type: '02',
          patient_user_id: otherPatientId ? otherPatientId : null,
          address_id: null,
          event_node: 'Booking',
          estimate_time_id: selectedTime?.id,
          method_id: paymentMethod?.id,
          institution_id: selectedSchedule?.institution?.id,
          method_name: paymentMethod?.name,
          transaction_number: res?.data?.transaction_number,
          transfer_to: paymentMethod?.account_number,
          tax: dataServicePrice?.data?.tax,
          discount: null,
          items: [
            {
              product_id: dataServicePrice?.data?.service_id,
              price: dataServicePrice?.data?.total_price,
              quantity: 1,
              description: null,
            },
          ],
        };
        // console.log({ orderData });
        await createOrder(cookies)(orderData);
        await queryClient.invalidateQueries('user-booking-list');
        setBookingData(res?.data);
        setIsLoading(false);
        toast({
          position: 'top-right',
          title: 'Success',
          description: `Booking success`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        if (res?.data?.id) {
          history.replace(`/doctor/detail/${res?.data?.id}`);
        }
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        position: 'top-right',
        title: 'Failed',
        description: `Booking failed`,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Grid
        templateColumns={paymentBookingGridTemplate}
        gap="10"
        pb={{ base: '20', md: '32' }}
      >
        <GridItem colSpan={2}>
          <DoctorDetails
            setCurrentStepIndex={setCurrentStepIndex}
            selectedSchedule={selectedSchedule}
            selectedTime={selectedTime}
          />
          <PatientDetails
            patient={patient}
            patientData={patientData}
            setCurrentStepIndex={setCurrentStepIndex}
          />
        </GridItem>
        <GridItem colSpan={{ base: 2, xl: 1 }}>
          <Box
            maxW="3xl"
            mx="auto"
            rounded={{ md: 'lg' }}
            bg="white"
            shadow="base"
            overflow="hidden"
            mb="6"
          >
            <Flex
              align="center"
              justify="space-between"
              px="6"
              py="4"
              bg="white"
              borderBottom="2px"
              borderColor="gray.200"
            >
              <HStack spacing={{ base: '2', md: '4' }}>
                <Icon as={FaMoneyBillAlt} w="5" h="5" />
                <Text
                  as="h3"
                  fontWeight="bold"
                  fontSize={{ base: 'md', md: 'lg' }}
                >
                  Registration Deposit
                </Text>
              </HStack>
            </Flex>
            {isLoadingServicePrice && (
              <Center py="4">
                <Spinner />
              </Center>
            )}
            {isSuccessServicePrice && (
              <Box px="6" py="3">
                <Box fontSize="4xl" fontWeight="extrabold" as="span">
                  {formatter.format(
                    Number(dataServicePrice?.data?.total_price)
                  )}
                </Box>
              </Box>
            )}
            <Box px="6" pb="4">
              <Text mt="0" color="gray.500">
                No refund will be issued if no check-in made
              </Text>
              <FormControl id="payment_method" my="4">
                <VisuallyHidden as="label">Metode Pembayaran</VisuallyHidden>
                <Select
                  value={selectedPaymentMethod}
                  onChange={e => setSelectedPaymentMethod(e.target.value)}
                >
                  <option value="">Choose payment method</option>
                  {dataPaymentMethods?.data
                    ?.filter(paymentMethod => paymentMethod.active)
                    .map(paymentMethod => (
                      <option
                        key={paymentMethod.id}
                        value={JSON.stringify(paymentMethod)}
                      >
                        {paymentMethod.name}
                      </option>
                    ))}
                </Select>
              </FormControl>
              <Button
                isLoading={isLoading}
                w="full"
                colorScheme="primary"
                my="2"
                onClick={handleBooking}
                disabled={isLoadingServicePrice || !selectedPaymentMethod}
              >
                Book
              </Button>
            </Box>
          </Box>
          {bookingData && (
            <Center bg="white" boxShadow="md" rounded="md" py="10">
              <QRCode value={bookingData.qrcode} />
            </Center>
          )}
        </GridItem>
      </Grid>
      <Box
        h={{ base: '20', md: '28' }}
        bg="primary.500"
        position="fixed"
        bottom="0"
        left="0"
        w="full"
        zIndex="5"
      >
        <Flex
          h="full"
          maxW="7xl"
          mx="auto"
          justify={{ base: 'center', md: 'flex-end' }}
          align="center"
          px="4"
        >
          <Button
            leftIcon={<FaArrowLeft />}
            disabled={currentStep.value === 'Step 1'}
            onClick={() => setCurrentStepIndex(currentStepIndex - 1)}
            mr="2"
            size={buttonSize}
            bgColor="secondary.light"
            color="secondary.dark"
            _hover={{
              bgColor: 'secondary.dark',
              color: 'secondary.light',
            }}
          >
            Back
          </Button>
          <Button leftIcon={<FaArrowRight />} disabled size={buttonSize}>
            Next
          </Button>
        </Flex>
      </Box>

      {/* <Box mt="14" textAlign="right">
        <Button
          leftIcon={<FaArrowLeft />}
          disabled={currentStep.value === 'Step 1'}
          onClick={() => setCurrentStepIndex(currentStepIndex - 1)}
        >
          Back
        </Button>
        <Button leftIcon={<FaArrowRight />} disabled>
          Next
        </Button>
      </Box> */}
    </>
  );
};

const DoctorDetails = ({
  setCurrentStepIndex,
  selectedSchedule,
  selectedTime,
}) => (
  <Box
    maxW="3xl"
    mx="auto"
    rounded={{ md: 'lg' }}
    bg="white"
    shadow="base"
    overflow="hidden"
    mb="6"
  >
    <Flex
      align="center"
      justify="space-between"
      px="6"
      py="3"
      bg="white"
      borderBottom="2px"
      borderColor="gray.200"
    >
      <HStack spacing={{ base: '2', md: '4' }}>
        <Icon color="secondary.dark" as={FaUserMd} w="5" h="5" />
        <Text as="h3" fontWeight="bold" fontSize={{ base: 'md', md: 'lg' }}>
          Doctor Detail
        </Text>
      </HStack>
      <HStack spacing="4">
        <Box fontWeight="semibold" display={{ base: 'none', md: 'block' }}>
          {selectedSchedule?.service?.name}
        </Box>
        <Button
          onClick={() => setCurrentStepIndex(prev => prev - 3)}
          // variant="outline"
          minW="20"
          leftIcon={<RiCalendarEventFill />}
          colorScheme="primary"
          size="sm"
        >
          Change Schedule
        </Button>
      </HStack>
    </Flex>
    <Flex
      boxShadow="md"
      px="6"
      py="4"
      alignItems="center"
      direction={{ base: 'column', md: 'row' }}
    >
      <Box
        w={{ base: '24', md: '28' }}
        h={{ base: '24', md: '28' }}
        mb={{ base: '4', md: '0' }}
      >
        <Image rounded="full" src={doctorImg} alt="foto dokter" />
      </Box>
      <Box flexGrow="1" pl={{ base: '0', md: '6' }} mt="-3">
        <Flex justify="space-between" mb={{ base: '1.5', md: '3' }}>
          <Box w="full">
            <Text
              fontSize={{ base: 'xl', md: '2xl' }}
              fontWeight="bold"
              textAlign={{ base: 'center', md: 'left' }}
            >
              {selectedSchedule?.employee?.name}
            </Text>
            <Text
              mt="-1.5"
              color="secondary.dark"
              fontWeight="semibold"
              textAlign={{ base: 'center', md: 'left' }}
            >
              {selectedSchedule?.employee?.profession === 'Doctor'
                ? 'Dokter'
                : selectedSchedule?.employee?.profession}
            </Text>
          </Box>
        </Flex>
        <Flex
          color="gray.600"
          fontSize="sm"
          fontWeight="medium"
          direction={{ base: 'column', md: 'row' }}
        >
          <HStack mr="6" spacing="1">
            <Icon color="secondary.dark" as={RiHospitalFill} w="5" h="5" />
            <span>{selectedSchedule?.institution?.name}</span>
          </HStack>
          <HStack mr="6" spacing="1">
            <Icon color="secondary.dark" as={RiCalendarEventFill} w="5" h="5" />
            <span>
              {selectedSchedule?.days}, {selectedSchedule?.date_name}
            </span>
          </HStack>
          <HStack mr="6" spacing="1">
            <Icon color="secondary.dark" as={RiTimerLine} w="5" h="5" />
            <span>{selectedTime?.available_time}</span>
          </HStack>
        </Flex>
      </Box>
    </Flex>
  </Box>
);

const PatientDetails = ({ patientData, setCurrentStepIndex, patient }) => (
  <Box
    maxW="3xl"
    mx="auto"
    rounded={{ md: 'lg' }}
    bg="white"
    shadow="base"
    overflow="hidden"
    mb="6"
  >
    <Flex
      align="center"
      justify="space-between"
      px="6"
      py="3"
      bg="white"
      borderBottom="2px"
      borderColor="gray.200"
    >
      <HStack spacing={{ base: '2', md: '4' }}>
        <Icon color="secondary.dark" as={FaUserAlt} w="5" h="5" />
        <Text as="h3" fontWeight="bold" fontSize={{ base: 'md', md: 'lg' }}>
          Patient Detail
        </Text>
      </HStack>

      <Button
        onClick={() => setCurrentStepIndex(prev => prev - 1)}
        // variant="outline"
        colorScheme="primary"
        size="sm"
        minW="20"
        leftIcon={<HiPencilAlt />}
      >
        Edit Info
      </Button>
    </Flex>
    <Flex px="6" py="4" direction={{ base: 'column', md: 'row' }}>
      <Flex
        w={{ base: '24', md: '28' }}
        h={{ base: '24', md: '28' }}
        alignSelf={{ base: 'center', md: 'start' }}
        mb={{ base: '4', md: '0' }}
      >
        <Image
          rounded="full"
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt="foto dokter"
        />
      </Flex>

      <Box
        flexGrow="1"
        pl={{ base: '0', md: '6' }}
        py={{ base: '0', md: '2' }}
        mt="-3"
      >
        <Box mb="4">
          <HStack
            mt="2"
            mb="1"
            color="gray.600"
            fontSize="sm"
            fontWeight="semibold"
          >
            <Icon color="secondary.dark" as={RiUser3Fill} w="5" h="5" />
            <Text>Profile Information</Text>
          </HStack>
          <Description
            title="Name"
            value={patientData?.fullname}
            py="1"
            px="0"
          />
          <Description
            title="Identity Number"
            value={patientData?.identity_number}
            py="1"
            px="0"
          />
          <Description
            title="Gender"
            value={
              patientData?.gender === 'male'
                ? 'Laki-laki'
                : patientData?.gender === 'female'
                ? 'Perempuan'
                : '-'
            }
            py="1"
            px="0"
          />
          <Description
            title="Birth of Date"
            value={patientData?.birth_date}
            py="1"
            px="0"
          />
        </Box>
        <Divider my="2" />
        <Box mb="4">
          <HStack
            mt="2"
            mb="1"
            color="gray.600"
            fontSize="sm"
            fontWeight="semibold"
          >
            <Icon color="secondary.dark" as={RiContactsBook2Line} w="5" h="5" />
            <Text>Contact Information</Text>
          </HStack>

          <Description title="Email" value={patientData?.email} py="1" px="0" />
          <Description
            title="Phone Number"
            value={patientData?.phone_number}
            py="1"
            px="0"
          />
          <Description
            title="Address"
            value={patientData?.address}
            py="1"
            px="0"
          />
          {patient !== 'me' && (
            <Description
              title="Person Responsible"
              value={patientData?.responsible_status}
              py="1"
              px="0"
            />
          )}
        </Box>
        <Divider my="2" />
        {patient === 'me' && (
          <Box>
            <HStack
              mt="2"
              mb="1"
              color="gray.600"
              fontSize="sm"
              fontWeight="semibold"
            >
              <Icon color="secondary.dark" as={GiHeartBeats} w="5" h="5" />
              <Text>Health Information</Text>
            </HStack>
            <Description
              title="Blood Type"
              value={patientData?.blood_type}
              py="1"
              px="0"
            />
            <Description
              title="Height"
              value={`${patientData?.height} cm`}
              py="1"
              px="0"
            />
            <Description
              title="Weight"
              value={`${patientData?.weight} kg`}
              py="1"
              px="0"
            />
            <Description
              title="Allergy"
              value={patientData.allergies
                .map(alergy => alergy.label)
                .join(', ')}
              py="1"
              px="0"
            />
          </Box>
        )}
      </Box>
    </Flex>
  </Box>
);

const Description = ({ title, value, ...rest }) => (
  <Flex
    as="dl"
    direction={{ base: 'column', sm: 'row' }}
    px="6"
    py={{ base: '2', md: '4' }}
    {...rest}
  >
    <Box as="dt" flexBasis={{ base: '40%', md: '30%' }}>
      {title}:
    </Box>
    <Box as="dd" flex="1" fontWeight="semibold">
      {value}
    </Box>
  </Flex>
);
