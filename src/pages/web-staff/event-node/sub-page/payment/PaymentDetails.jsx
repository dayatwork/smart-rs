import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  Box,
  Button,
  Divider,
  Flex,
  Text,
  Heading,
  useToast,
  Badge,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  VStack,
  Icon,
  Center,
  Spinner,
  Image,
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useQuery, useQueryClient } from 'react-query';

import { BackButton } from '../../../../../components/shared/BackButton';
import { getOrderDetail } from '../../../../../api/payment-services/order';
import {
  getPaymentSlipDetail,
  verifyPayment,
} from '../../../../../api/payment-services/manual-verification';
import { ImFileEmpty } from 'react-icons/im';
import { PrivateComponent, Permissions } from '../../../../../access-control';

export const PaymentDetails = ({ fromFinanceMenu }) => {
  const history = useHistory();
  const params = useParams();
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data: dataOrder, isLoading: isLoadingOrder } = useQuery(
    ['payment-order-detail', params?.id],
    () => getOrderDetail(cookies, params?.id),
    { enabled: Boolean(params?.id) }
  );

  const { data: dataPaymentSlip, isLoading: isLoadingPaymentSlip } = useQuery(
    ['payment-slip', dataOrder?.data?.id],
    () => getPaymentSlipDetail(cookies, dataOrder?.data?.id),
    { enabled: Boolean(dataOrder?.data?.id) }
  );

  // console.log({ dataPaymentSlip });

  const handleVerifyPayment = async () => {
    const data = {
      id: dataPaymentSlip?.data?.id,
      order_id: dataPaymentSlip?.data?.order_id,
    };
    try {
      setIsLoading(true);
      await verifyPayment(cookies, data);
      await queryClient.invalidateQueries([
        'institution-order-list',
        dataOrder?.data?.institution_id,
      ]);
      setIsLoading(false);
      toast({
        title: 'Success',
        description: 'Payment Confirmed',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      history.replace('/events/payment');
    } catch (error) {
      setIsLoading(false);
      toast({
        title: 'Error',
        description: 'Error confirm payment',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  if (isLoadingOrder || isLoadingPaymentSlip) {
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
      <ManualVerifyModal
        isOpen={isOpen}
        onClose={onClose}
        handleVerifyPayment={handleVerifyPayment}
        isLoading={isLoading}
      />
      {fromFinanceMenu ? (
        <BackButton
          to="/finance/patient-payment"
          text="Back to Patient Payment List"
        />
      ) : (
        <BackButton to="/events/payment" text="Back to Payment List" />
      )}
      <Heading
        mb={{ base: '3', '2xl': '6' }}
        fontSize={{ base: '2xl', '2xl': '3xl' }}
      >
        Payment Details
      </Heading>
      <Box px="8" py="6" bg="white" boxShadow="md" mb="4">
        <Heading as="h3" size="sm" mb="2">
          Detail Order
        </Heading>
        <Description
          title="Order Number"
          value={dataOrder?.data?.order_number}
        />
        <Description
          title="Transaction Number"
          value={dataOrder?.data?.transaction_number}
        />
        <Description
          title="Total Price"
          value={formatter.format(dataOrder?.data?.total_price)}
        />
        <Description
          title="Status"
          value={
            <Badge
              colorScheme={dataOrder?.data?.status === 'paid' ? 'green' : null}
            >
              {dataOrder?.data?.status}
            </Badge>
          }
        />
        <Description
          title="Invoice Date"
          value={dataOrder?.data?.invoice_date}
        />
        <Description title="Due Date" value={dataOrder?.data?.due_date} />
        <Description
          title="Payment Method"
          value={dataOrder?.data?.method?.name}
        />
        <Divider py="3" />
        <Heading as="h3" size="sm" mt="2" mb="2">
          Detail Items
        </Heading>
        {dataOrder?.data?.items?.map((item, index) => (
          <Box key={item.id}>
            <Text fontWeight="semibold" mb="1">
              Item {index + 1}:
            </Text>
            <Box pl="4" py="1" bg="gray.50">
              <Description title="Service" value={item.service_name} />
              <Description title="Quantity" value={item.quantity} />
              <Description title="Price" value={formatter.format(item.price)} />
            </Box>
          </Box>
        ))}
        <Divider py="3" />
        <Heading as="h3" size="sm" mt="2" mb="2">
          Payment Slip
        </Heading>
        {dataPaymentSlip?.data?.document ? (
          <>
            <Image
              src={`https://local-dev.ejemplo.me/smartrs/${dataPaymentSlip?.data?.document}`}
              alt="payment slip"
              maxH="40"
            />
            <Button
              variant="link"
              colorScheme="purple"
              as="a"
              href={`https://local-dev.ejemplo.me/smartrs/${dataPaymentSlip?.data?.document}`}
              target="_blank"
              download={true}
            >
              {/* Payment Slip */}
              {`https://local-dev.ejemplo.me/smartrs/${dataPaymentSlip?.data?.document}`}
            </Button>
          </>
        ) : (
          <VStack py="2">
            <Icon as={ImFileEmpty} h={6} w={6} color="purple.600" />
            <Text color="purple.600" fontWeight="semibold">
              Empty
            </Text>
          </VStack>
        )}
      </Box>
      {dataOrder?.data?.status !== 'paid' && (
        <PrivateComponent
          permission={Permissions['manual-verificationPayment']}
        >
          <Flex justify="flex-end">
            <Box>
              <Button
                colorScheme="purple"
                onClick={onOpen}
                disabled={dataPaymentSlip?.code === 404}
              >
                Confirm Payment
              </Button>
              {dataPaymentSlip?.code === 404 && (
                <Text fontSize="sm" color="gray.600">
                  Payment slip is required
                </Text>
              )}
            </Box>
          </Flex>
        </PrivateComponent>
      )}
    </Box>
  );
};

const ManualVerifyModal = ({
  isOpen,
  onClose,
  handleVerifyPayment,
  isLoading,
}) => {
  return (
    <>
      <AlertDialog
        motionPreset="slideInBottom"
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Confirm Payment?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure you want to confirm this payment?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button onClick={onClose}>No</Button>
            <Button
              colorScheme="purple"
              ml={3}
              onClick={handleVerifyPayment}
              isLoading={isLoading}
            >
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const Description = ({ title, value }) => {
  return (
    <Flex as="dl" direction={{ base: 'column', md: 'row' }} py="2">
      <Box as="dt" flexBasis="25%" color="gray.600">
        {title}
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
