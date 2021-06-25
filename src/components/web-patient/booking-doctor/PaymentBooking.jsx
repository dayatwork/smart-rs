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
  Heading,
  Select,
  Text,
  VisuallyHidden,
  useToast,
  Center,
  Spinner,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { HiPencilAlt } from 'react-icons/hi';
import { useCookies } from 'react-cookie';
import { useQuery, useQueryClient } from 'react-query';
import QRCode from 'qrcode.react';

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
}) => {
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
            service_id: selectedSchedule?.service?.id,
            schedule_id: selectedSchedule?.schedule_id,
            schedule_detail_id: selectedSchedule?.id,
            estimate_time_id: selectedTime?.id,
          };
        } else {
          data = {
            ourself: 0,
            type: 'appointment',
            institution_id: selectedSchedule?.institution?.id,
            service_id: selectedSchedule?.service?.id,
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
        setIsLoading(true);
        const res = await createBooking(cookies, data);
        const orderData = {
          booking_order_id: res?.data?.booking_order?.id,
          type: '02',
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
      <Grid templateColumns={paymentBookingGridTemplate} gap="10">
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
            px="6"
            py="4"
            mb="6"
          >
            <Box
              fontSize="sm"
              textTransform="uppercase"
              fontWeight="bold"
              color="gray.500"
            >
              Deposit Pendaftaran
            </Box>
            {isLoadingServicePrice && (
              <Center py="4">
                <Spinner />
              </Center>
            )}
            {isSuccessServicePrice && (
              <Box fontSize="4xl" fontWeight="extrabold" as="span">
                {formatter.format(Number(dataServicePrice?.data?.total_price))}
              </Box>
            )}
            <Text mt="3" color="gray.500">
              Biaya ini akan hangus jika anda tidak melakukan check in
            </Text>
            <FormControl id="payment_method" my="4">
              <VisuallyHidden as="label">Metode Pembayaran</VisuallyHidden>
              <Select
                value={selectedPaymentMethod}
                onChange={e => setSelectedPaymentMethod(e.target.value)}
              >
                <option value="">Pilih Metode Pembayaran</option>
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
              colorScheme="blue"
              my="2"
              onClick={handleBooking}
              disabled={isLoadingServicePrice || !selectedPaymentMethod}
            >
              Booking
            </Button>
          </Box>
          {bookingData && (
            <Center bg="white" boxShadow="md" rounded="md" py="10">
              <QRCode value={bookingData.qrcode} />
            </Center>
          )}
        </GridItem>
      </Grid>

      <Box mt="14" textAlign="right">
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
      </Box>
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
    <Flex align="center" justify="space-between" px="6" py="4" bg="gray.50">
      <Text as="h3" fontWeight="bold" fontSize="lg">
        Detail Dokter
      </Text>
      <Button
        onClick={() => setCurrentStepIndex(prev => prev - 1)}
        variant="outline"
        minW="20"
        leftIcon={<HiPencilAlt />}
      >
        Ubah Jadwal
      </Button>
    </Flex>
    <Divider />
    <Box>
      <Description
        title="Nama Dokter"
        value={selectedSchedule?.employee?.name}
      />
      <Description title="SMF" value={selectedSchedule?.employee?.profession} />
      <Description title="Layanan" value={selectedSchedule?.service?.name} />
      <Description
        title="Jadwal"
        value={`${selectedSchedule?.days}, ${selectedSchedule?.date_name}`}
      />
      <Description title="Jam" value={selectedTime?.available_time} />
    </Box>
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
  >
    <Flex align="center" justify="space-between" px="6" py="4" bg="gray.50">
      <Text as="h3" fontWeight="bold" fontSize="lg">
        Detail Pasien
      </Text>
      <Button
        onClick={() => setCurrentStepIndex(prev => prev - 2)}
        variant="outline"
        minW="20"
        leftIcon={<HiPencilAlt />}
      >
        Edit
      </Button>
    </Flex>
    <Divider />
    <Box py="2">
      <Heading px="6" fontSize="lg" fontWeight="semibold" py="2">
        Profile Info
      </Heading>
      <Description title="Nama Pasien" value={patientData?.fullname} py="3" />
      <Description title="Email" value={patientData?.email} py="3" />
      <Description title="No. Hp" value={patientData?.phone_number} py="3" />
      <Description title="NIK" value={patientData?.identity_number} py="3" />
      <Description
        title="Jenis Kelamin"
        value={
          patientData?.gender === 'male'
            ? 'Laki-laki'
            : patientData?.gender === 'female'
            ? 'Perempuan'
            : '-'
        }
        py="3"
      />
      <Description
        title="Tanggal Lahir"
        value={patientData?.birth_date}
        py="3"
      />
      <Description title="Alamat" value={patientData?.address} py="3" />
      <Divider my="2" />

      {patient === 'me' && (
        <>
          <Heading px="6" fontSize="lg" fontWeight="semibold" py="2">
            Health Info
          </Heading>
          <Description
            title="Golongan Darah"
            value={patientData?.blood_type}
            py="3"
          />
          <Description
            title="Tinggi Badan"
            value={`${patientData?.height} cm`}
            py="3"
          />
          <Description
            title="Berat Badan"
            value={`${patientData?.weight} kg`}
            py="3"
          />
          <Description
            title="Alergi"
            value={patientData.allergies.map(alergy => alergy.label).join(', ')}
            py="3"
          />
        </>
      )}
    </Box>
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
    <Box as="dt" flexBasis={{ base: '40%', md: '25%' }}>
      {title}:
    </Box>
    <Box as="dd" flex="1" fontWeight="semibold">
      {value}
    </Box>
  </Flex>
);
