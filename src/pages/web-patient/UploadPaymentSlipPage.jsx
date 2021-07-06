import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  Text,
  useToast,
  SimpleGrid,
  Center,
  Spinner,
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useQuery, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { AiOutlineFileSearch } from 'react-icons/ai';
import { FaCheckCircle } from 'react-icons/fa';

import { getOrderDetail } from '../../api/payment-services/order';
import {
  uploadOrderReceipt,
  getPaymentSlipDetail,
} from '../../api/payment-services/manual-verification';
import { getPaymentMethodById } from '../../api/institution-services/payment-method';
import { WebPatientNav, Wrapper } from '../../components/web-patient/shared';
import { BsCaretLeftFill } from 'react-icons/bs';

const schema = yup.object().shape({
  payment_slip: yup
    .mixed()
    .required('Payment slip dibutuhkan')
    .test('fileSize', 'Ukuran file terlalu besar (Max 1MB)', value => {
      // console.log({ value });
      return value && value[0].size <= 1000000;
    })
    .test('type', 'Format file harus jpeg/jpg, png, atau pdf', value => {
      return (
        value &&
        (value[0].type === 'image/jpeg' ||
          value[0].type === 'image/jpg' ||
          value[0].type === 'image/png' ||
          value[0].type === 'application/pdf')
      );
    }),
});

export const UploadPaymentSlipPage = () => {
  const params = useParams();
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    // payment_slip: '',
    mode: 'onBlur',
    defaultValues: { payment_slip: null },
    resolver: yupResolver(schema),
  });
  const paymentSlipWatch = watch('payment_slip');
  const queryClient = useQueryClient();

  const { data: dataOrderDetail, isLoading: isLoadingOrderDetail } = useQuery(
    ['order-detail', params?.orderId],
    () => getOrderDetail(cookies, params?.orderId),
    { enabled: Boolean(params?.orderId) }
  );

  const { data: dataPaymentMethod, isLoading: isLoadingPaymentMethod } =
    useQuery(
      ['payment-method', dataOrderDetail?.data?.method?.id],
      () => getPaymentMethodById(cookies, dataOrderDetail?.data?.method?.id),
      { enabled: Boolean(dataOrderDetail?.data?.method?.id) }
    );

  const { data: dataPaymentSlip, isLoading: isLoadingPaymentSlip } = useQuery(
    ['payment-slip-detail', params?.orderId],
    () => getPaymentSlipDetail(cookies, params?.orderId),
    { enabled: Boolean(params?.orderId) }
  );

  const onSubmit = async value => {
    const data = new FormData();
    data.append('file', value.payment_slip[0]);
    data.append('order_id', dataOrderDetail?.data?.id);
    try {
      setIsLoading(true);
      await uploadOrderReceipt(cookies, data);
      await queryClient.invalidateQueries([
        'payment-slip-detail',
        params?.orderId,
      ]);
      setIsLoading(false);
      toast({
        position: 'top-right',
        title: 'Success',
        description: `Payment slip uploaded successfully`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      setIsLoading(false);
      toast({
        position: 'top-right',
        title: 'Error',
        description: `Error upload payment slip`,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  console.log({ dataOrderDetail });
  console.log({ dataPaymentSlip });
  console.log({ dataPaymentMethod });

  return (
    <Flex direction="column" bg="gray.100" minH="100vh">
      <WebPatientNav active="doctor" />
      <Wrapper>
        <Box
          maxW="md"
          mx="auto"
          boxShadow="md"
          bg="white"
          px="8"
          py="6"
          rounded="md"
        >
          <Heading size="md" textAlign="center" mb="6">
            Upload Bukti Pembayaran
          </Heading>
          <SimpleGrid mb="4" columns={2} gap="10">
            <Box>
              <Text fontSize="sm" fontWeight="semibold" color="gray.500">
                Invoice Date
              </Text>
              <Text fontSize="sm" fontWeight="semibold">
                {dataOrderDetail?.data?.invoice_date}
              </Text>
            </Box>
            <Box>
              <Text fontSize="sm" fontWeight="semibold" color="gray.500">
                Due Date
              </Text>
              <Text fontSize="sm" fontWeight="semibold">
                {dataOrderDetail?.data?.due_date}
              </Text>
            </Box>
          </SimpleGrid>
          <SimpleGrid mb="4" columns={2} gap="10">
            <Box>
              <Text fontSize="sm" fontWeight="semibold" color="gray.500">
                Payment Method
              </Text>
              <Text fontSize="sm" fontWeight="semibold">
                {dataPaymentMethod?.data?.name}
              </Text>
              <Text fontSize="sm" fontWeight="semibold">
                {dataPaymentMethod?.data?.account_name}
              </Text>
              <Text fontSize="sm" fontWeight="semibold">
                {dataPaymentMethod?.data?.account_number}
              </Text>
            </Box>
            <Box>
              <Text fontSize="sm" fontWeight="semibold" color="gray.500">
                Total Price
              </Text>
              <Text fontSize="sm" fontWeight="semibold">
                {formatter.format(dataOrderDetail?.data?.total_price)}
              </Text>
            </Box>
          </SimpleGrid>
          {isLoadingOrderDetail ||
          isLoadingPaymentMethod ||
          isLoadingPaymentSlip ? (
            <Center h="60">
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="secondary.light"
                color="secondary.dark"
                size="xl"
              />
            </Center>
          ) : dataOrderDetail?.data?.status === 'paid' ? (
            <Box py="6">
              <Center mb="4">
                <Icon as={FaCheckCircle} h={16} w={16} color="green.500" />
              </Center>
              <Center fontWeight="semibold" color="green.500">
                Pembayaran berhasil dan telah dikonfirmasi.
              </Center>
            </Box>
          ) : !isLoadingPaymentSlip && dataPaymentSlip?.data?.id ? (
            <Box py="6">
              <Center fontWeight="semibold" color="secondary.dark">
                Bukti pembayaran sudah diupload.
              </Center>
              <Center color="secondary.dark" fontSize="sm">
                Pembayaran Anda akan segera diproses.
              </Center>
            </Box>
          ) : (
            <Box as="form" py="4" onSubmit={handleSubmit(onSubmit)}>
              <FormControl mb="4">
                <FormLabel
                  border="2px"
                  borderStyle="dashed"
                  p={paymentSlipWatch ? '4' : '10'}
                  borderRadius="5px"
                  textAlign="center"
                  cursor="pointer"
                  m="0"
                  borderColor="primary.500"
                  color="primary.500"
                >
                  {paymentSlipWatch?.length ? (
                    <>
                      {paymentSlipWatch[0] && (
                        <img
                          src={URL.createObjectURL(paymentSlipWatch[0])}
                          alt="payment slip preview"
                        />
                      )}
                      <Text>{paymentSlipWatch[0]?.name}</Text>
                    </>
                  ) : (
                    <Icon
                      as={AiOutlineFileSearch}
                      h={5}
                      w={5}
                      color="primary.500"
                    />
                  )}
                </FormLabel>
                <Input
                  type="file"
                  accept="image/png, application/pdf, image/jpeg"
                  mb="2"
                  display="none"
                  {...register('payment_slip')}
                ></Input>
              </FormControl>
              {errors?.payment_slip && (
                <Box
                  mt="-2"
                  mb="3"
                  fontSize="sm"
                  fontWeight="semibold"
                  color="red.500"
                >
                  {errors?.payment_slip?.message}
                </Box>
              )}

              <Button
                type="submit"
                colorScheme="primary"
                w="full"
                isLoading={isLoading}
                disabled={!paymentSlipWatch?.length}
              >
                Upload
              </Button>
            </Box>
          )}
        </Box>
        <Box
          as={Link}
          to="/"
          display="flex"
          justifyContent="center"
          alignItems="center"
          color="secondary.dark"
          fontSize="sm"
          fontWeight="semibold"
          mb="4"
          rounded="lg"
          px="2"
          py="1"
          _hover={{ color: 'secondary.darker' }}
          mt="6"
          ml="-2.5"
        >
          <Box as={BsCaretLeftFill} fontSize="xs" marginEnd="1" />
          Back to Home
        </Box>
      </Wrapper>
    </Flex>
  );
};

const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
});
