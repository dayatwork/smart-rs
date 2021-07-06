import React, { useState } from 'react';
// import { Redirect } from 'react-router-dom';
import {
  Box,
  Center,
  Flex,
  Grid,
  GridItem,
  Heading,
  Spinner,
  Input,
  Button,
  FormControl,
  FormLabel,
  Icon,
  useToast,
  useBreakpointValue,
  HStack,
  Text,
  SimpleGrid,
  Divider,
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useQuery, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import { AiOutlineFileSearch } from 'react-icons/ai';
import { RiFileList2Line, RiBillLine } from 'react-icons/ri';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { getPaymentMethodById } from '../../api/institution-services/payment-method';
import { getUserOrderDetail } from '../../api/payment-services/user-order';
import { getOrderDetail } from '../../api/payment-services/order';
import {
  uploadOrderReceipt,
  getPaymentSlipDetail,
} from '../../api/payment-services/manual-verification';

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

export const OrderDetail = ({ orderId, bookingStatus }) => {
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
  const orderDetailGridTemplate = useBreakpointValue({
    base: 'repeat(1, 1fr)',
    xl: 'repeat(3, 1fr)',
  });
  const orderInfoColumns = useBreakpointValue({
    base: 1,
    md: 2,
  });

  const orderPaymentInfoColumns = useBreakpointValue({
    base: 1,
    md: 2,
    lg: 3,
  });

  const orderPaymentInfoColumnsPaid = useBreakpointValue({
    base: 1,
    md: 2,
  });

  const { data: dataUserOrderDetail, isLoading: isLoadingUserOrderDetail } =
    useQuery(
      ['user-order-detail', orderId],
      () => getUserOrderDetail(cookies, orderId),
      { enabled: Boolean(orderId) }
    );

  const { data: dataOrderDetail, isLoading: isLoadingOrderDetail } = useQuery(
    ['order-detail', dataUserOrderDetail?.data?.id],
    () => getOrderDetail(cookies, dataUserOrderDetail?.data?.id),
    { enabled: Boolean(dataUserOrderDetail?.data?.id) }
  );

  const { data: dataPaymentMethod, isLoading: isLoadingPaymentMethod } =
    useQuery(
      ['payment-method', dataUserOrderDetail?.data?.method_id],
      () => getPaymentMethodById(cookies, dataUserOrderDetail?.data?.method_id),
      { enabled: Boolean(dataUserOrderDetail?.data?.method_id) }
    );

  const { data: dataPaymentSlip, isLoading: isLoadingPaymentSlip } = useQuery(
    ['payment-slip-detail', dataUserOrderDetail?.data?.id],
    () => getPaymentSlipDetail(cookies, dataUserOrderDetail?.data?.id),
    { enabled: Boolean(dataUserOrderDetail?.data?.id) }
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
        dataUserOrderDetail?.data?.id,
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

  // if (!isLoadingOrderDetail && dataOrderDetail?.code !== 200) {
  //   console.log({ isLoadingOrderDetail, dataOrderDetail });
  //   return <Redirect to="/doctor" />;
  // }
  if (bookingStatus === 'cancel') {
    return null;
  }

  // console.log({ paymentSlipWatch });
  // console.log({ errors });
  console.log({ orderId });

  return (
    <>
      {isLoadingUserOrderDetail ||
      isLoadingOrderDetail ||
      isLoadingPaymentMethod ? (
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
        <Grid templateColumns={orderDetailGridTemplate} gap="10">
          <GridItem colSpan={2}>
            <Card>
              <CardHeader
                title={
                  <HStack>
                    <Icon
                      color="secondary.dark"
                      as={RiFileList2Line}
                      w="5"
                      h="5"
                    />
                    <Text>Order Info</Text>
                  </HStack>
                }
                action={
                  <HStack spacing="4">
                    <Text fontSize="sm" fontWeight="semibold">
                      Payment Status
                    </Text>
                    {dataUserOrderDetail?.data?.status === 'paid' ? (
                      <Box
                        bgColor="green.200"
                        px="3"
                        py="1"
                        fontWeight="bold"
                        rounded="full"
                        color="green.800"
                        textTransform="uppercase"
                        fontSize="sm"
                      >
                        {dataUserOrderDetail?.data?.status}
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
                        {dataUserOrderDetail?.data?.status}
                      </Box>
                    )}
                  </HStack>
                }
              />
              <CardContent>
                <SimpleGrid columns={orderInfoColumns} px="6" py="4" gap="6">
                  <Box>
                    <Text fontSize="sm" color="gray.600" fontWeight="semibold">
                      Order Number
                    </Text>
                    <Text fontWeight="semibold">
                      {dataOrderDetail?.data?.order_number}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.600" fontWeight="semibold">
                      Service Name
                    </Text>
                    <Text fontWeight="semibold">
                      {dataOrderDetail?.data?.items[0].service_name}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.600" fontWeight="semibold">
                      Invoice Date
                    </Text>
                    <Text fontWeight="semibold">
                      {dataOrderDetail?.data?.invoice_date}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.600" fontWeight="semibold">
                      Transaction Number
                    </Text>
                    <Text fontWeight="semibold">
                      {dataUserOrderDetail?.data?.transaction_number}
                    </Text>
                  </Box>
                </SimpleGrid>
                <Divider py="4" />
                <SimpleGrid
                  columns={
                    dataUserOrderDetail?.data?.status === 'paid'
                      ? orderPaymentInfoColumnsPaid
                      : orderPaymentInfoColumns
                  }
                  px="6"
                  py="4"
                  gap="6"
                >
                  <Box>
                    <Box mb="6">
                      <Text
                        fontSize="sm"
                        color="gray.600"
                        fontWeight="semibold"
                      >
                        Account Name
                      </Text>

                      <Text fontWeight="semibold">
                        {dataPaymentMethod?.data?.account_name}
                      </Text>
                    </Box>
                    <Box mb="6">
                      <Text
                        fontSize="sm"
                        color="gray.600"
                        fontWeight="semibold"
                      >
                        Account Number
                      </Text>
                      <Text fontWeight="semibold">
                        {dataPaymentMethod?.data?.account_number}
                      </Text>
                    </Box>
                    {/* <Box>
                      <Text
                        fontSize="sm"
                        color="gray.600"
                        fontWeight="semibold"
                      >
                        Payment Method
                      </Text>
                      <Text fontWeight="semibold">
                        {dataPaymentMethod?.data?.name}
                      </Text>
                    </Box> */}
                  </Box>

                  <Box>
                    <Box mb="6">
                      <Text
                        fontSize="sm"
                        color="gray.600"
                        fontWeight="semibold"
                      >
                        Payment Method
                      </Text>
                      <Text fontWeight="semibold">
                        {dataPaymentMethod?.data?.name}
                      </Text>
                    </Box>
                    <Box mb="6">
                      <Text
                        fontSize="sm"
                        color="gray.600"
                        fontWeight="semibold"
                      >
                        Total Amount
                      </Text>
                      <Text fontWeight="semibold">
                        {formatter.format(
                          dataUserOrderDetail?.data?.total_price
                        )}
                      </Text>
                    </Box>
                    {/* <Box mb="6">
                      <Text
                        fontSize="sm"
                        color="gray.600"
                        fontWeight="semibold"
                      >
                        Total Paid
                      </Text>
                      <Text fontWeight="semibold">
                        {dataUserOrderDetail?.data?.status === 'paid'
                          ? formatter.format(
                              dataUserOrderDetail?.data?.total_price
                            )
                          : formatter.format(0)}
                      </Text>
                    </Box> */}
                  </Box>
                  {dataUserOrderDetail?.data?.status !== 'paid' &&
                    dataUserOrderDetail?.data?.status !== 'over due' && (
                      <Box>
                        <Text
                          fontSize="sm"
                          color="gray.600"
                          fontWeight="semibold"
                        >
                          Balance Due
                        </Text>
                        <Text fontWeight="semibold" fontSize="3xl" mb="1">
                          {formatter.format(
                            dataUserOrderDetail?.data?.total_price
                          )}
                        </Text>
                        <Text
                          fontSize="sm"
                          fontWeight="medium"
                          bgColor="primary.500"
                          as="span"
                          px="2"
                          py="1"
                          color="secondary.light"
                          borderRadius="full"
                        >
                          Due date: {dataOrderDetail?.data?.due_date}
                        </Text>
                      </Box>
                    )}
                </SimpleGrid>
                {/* <Property
                  label="Order Number"
                  value={dataOrderDetail?.data?.order_number}
                />
                <Property
                  label="Transaction Number"
                  value={dataUserOrderDetail?.data?.transaction_number}
                />
                <Property
                  label="Invoice Date"
                  value={dataOrderDetail?.data?.invoice_date}
                />
                <Property
                  label="Due Date"
                  value={dataOrderDetail?.data?.due_date}
                />
                <Property
                  label="Total Price"
                  value={formatter.format(
                    dataUserOrderDetail?.data?.total_price
                  )}
                />
                <Property
                  label="Status"
                  value={
                    <Badge
                      colorScheme={
                        dataUserOrderDetail?.data?.status === 'paid'
                          ? 'green'
                          : null
                      }
                    >
                      {dataUserOrderDetail?.data?.status}
                    </Badge>
                  }
                />
                {dataUserOrderDetail?.data?.status === 'paid' && (
                  <Property
                    label="Paid Date"
                    value={dataUserOrderDetail?.data?.paid_date}
                  />
                )}
                <Property
                  label="Payment Method"
                  value={dataOrderDetail?.data?.method?.name}
                />
                <Property
                  label="Service"
                  value={dataOrderDetail?.data?.items[0].service_name}
                /> */}
              </CardContent>
            </Card>
          </GridItem>
          {dataUserOrderDetail?.data?.status !== 'paid' &&
            dataUserOrderDetail?.data?.status !== 'over due' && (
              <GridItem colSpan={{ base: 2, xl: 1 }}>
                <Card>
                  <CardHeader
                    title={
                      <HStack>
                        <Icon
                          color="secondary.dark"
                          as={RiBillLine}
                          w="5"
                          h="5"
                        />
                        <Text>Upload Payment Slip</Text>
                      </HStack>
                    }
                  />
                  <CardContent>
                    {!isLoadingPaymentSlip && dataPaymentSlip?.data?.id ? (
                      <Box py="6">
                        <Center fontWeight="semibold" color="secondary.dark">
                          Payment slip has been uploaded.
                        </Center>
                        <Center color="secondary.dark" fontSize="sm">
                          Your payment will be processed
                        </Center>
                      </Box>
                    ) : (
                      <Box
                        as="form"
                        px="6"
                        py="4"
                        onSubmit={handleSubmit(onSubmit)}
                      >
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
                                    src={URL.createObjectURL(
                                      paymentSlipWatch[0]
                                    )}
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
                  </CardContent>
                </Card>
              </GridItem>
            )}
        </Grid>
      )}
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
      <Box as="dt" minWidth="180px">
        {label}
      </Box>
      <Box as="dd" flex="1" fontWeight="semibold">
        {value}
      </Box>
    </Flex>
  );
};

const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
});
