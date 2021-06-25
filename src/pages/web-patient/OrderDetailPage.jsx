import React, { useState } from 'react';
import { Link, useParams, Redirect } from 'react-router-dom';
import {
  Badge,
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
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useQuery, useQueryClient } from 'react-query';
import { BsCaretLeftFill } from 'react-icons/bs';
import { useForm } from 'react-hook-form';
import { AiOutlineFileSearch } from 'react-icons/ai';

import { WebPatientNav, Wrapper } from '../../components/web-patient/shared';
import { getPaymentMethodById } from '../../api/institution-services/payment-method';
import { getUserOrderDetail } from '../../api/payment-services/user-order';
import { getOrderDetail } from '../../api/payment-services/order';
import {
  uploadOrderReceipt,
  getPaymentSlipDetail,
} from '../../api/payment-services/manual-verification';

export const OrderDetailPage = () => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, watch } = useForm({
    payment_slip: '',
  });
  const paymentSlipWatch = watch('payment_slip');
  const queryClient = useQueryClient();
  const orderDetailGridTemplate = useBreakpointValue({
    base: 'repeat(1, 1fr)',
    xl: 'repeat(3, 1fr)',
  });

  const { data: dataUserOrderDetail, isLoading: isLoadingUserOrderDetail } =
    useQuery(
      ['user-order-detail', params.id],
      () => getUserOrderDetail(cookies, params.id),
      { enabled: Boolean(params.id) }
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
      // await queryClient.invalidateQueries([
      //   'order-detail',
      //   dataUserOrderDetail?.data?.id,
      // ]);
      // await queryClient.invalidateQueries([
      //   'order-detail',
      //   dataUserOrderDetail?.data?.id,
      // ]);
      await queryClient.invalidateQueries([
        'payment-slip-detail',
        dataUserOrderDetail?.data?.id,
      ]);
      setIsLoading(false);
      toast({
        title: 'Success',
        description: `Payment slip uploaded successfully`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      setIsLoading(false);
      toast({
        title: 'Error',
        description: `Error upload payment slip`,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  if (!isLoadingOrderDetail && dataOrderDetail?.code !== 200) {
    return <Redirect to="/doctor" />;
  }

  return (
    <Flex direction="column" bg="gray.100" minH="100vh">
      <WebPatientNav active="doctor" />
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
            Detail Order
          </Heading>
        </Flex>

        {isLoadingUserOrderDetail ||
        isLoadingOrderDetail ||
        isLoadingPaymentMethod ? (
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
          <Grid templateColumns={orderDetailGridTemplate} gap="10">
            <GridItem colSpan={2}>
              <Card>
                <CardHeader title="Order Info" />
                <CardContent>
                  <Property
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
                  />
                </CardContent>
              </Card>
            </GridItem>
            {dataUserOrderDetail?.data?.status !== 'paid' && (
              <GridItem colSpan={{ base: 2, xl: 1 }}>
                <Card>
                  <CardHeader title="Payment Info" />
                  <CardContent>
                    <Property
                      label="Payment Method"
                      value={dataPaymentMethod?.data?.name}
                    />
                    <Property
                      label="Account Number"
                      value={dataPaymentMethod?.data?.account_number}
                    />
                    <Property
                      label="Account Name"
                      value={dataPaymentMethod?.data?.account_name}
                    />
                    <Property
                      label="Total Price"
                      value={formatter.format(
                        dataUserOrderDetail?.data?.total_price
                      )}
                    />
                  </CardContent>
                </Card>

                <Card mt="4">
                  <CardHeader title="Upload Payment Slip" />
                  <CardContent>
                    {!isLoadingPaymentSlip && dataPaymentSlip?.data?.id ? (
                      <Box py="6">
                        <Center fontWeight="semibold" color="blue.500">
                          Payment slip has been uploaded.
                        </Center>
                        <Center color="blue.500" fontSize="sm">
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
                            p="10"
                            borderRadius="5px"
                            textAlign="center"
                            cursor="pointer"
                            m="0"
                            borderColor="blue.500"
                            color="blue.500"
                          >
                            {paymentSlipWatch?.length ? (
                              paymentSlipWatch[0]?.name
                            ) : (
                              <Icon
                                as={AiOutlineFileSearch}
                                h={5}
                                w={5}
                                color="blue.600"
                              />
                            )}
                          </FormLabel>
                          <Input
                            type="file"
                            mb="2"
                            display="none"
                            {...register('payment_slip')}
                          ></Input>
                        </FormControl>
                        <Button
                          type="submit"
                          colorScheme="blue"
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
      </Wrapper>
    </Flex>
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
