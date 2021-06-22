import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  Heading,
  Spinner,
  Tooltip,
  useClipboard,
  FormLabel,
  Select,
  Badge,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Flex,
  ModalFooter,
  useDisclosure,
  Center,
} from '@chakra-ui/react';
import { useQuery, useQueryClient } from 'react-query';
import { useCookies } from 'react-cookie';
import QRCode from 'qrcode.react';

import { getInstitutions } from '../../../../../api/institution-services/institution';
import {
  getDrugOrders,
  takeOrder,
  getOrderDrugQRCode,
} from '../../../../../api/pharmacy-services/receipt';
import PaginationTable from '../../../../../components/shared/tables/PaginationTable';
import { BackButton } from '../../../../../components/shared/BackButton';

export const CollectMedicineList = () => {
  const [cookies] = useCookies(['token']);
  const [clipboardValue, setClipboardValue] = useState('');
  const { hasCopied, onCopy } = useClipboard(clipboardValue);
  const [selectedInstitution, setSelectedInstitution] = useState(
    '3f026d44-6b43-47ce-ba4b-4d0a8b174286'
  );
  const [selectedOrder, setSelectedOrder] = useState(null);

  const {
    isOpen: isOpenConfirmTakeModal,
    onOpen: onOpenConfirmTakeModal,
    onClose: onCloseConfirmTakeModal,
  } = useDisclosure();

  const { data: resInstitution, isSuccess: isSuccessInstitution } = useQuery(
    'institutions',
    () => getInstitutions(cookies)
  );

  const {
    data: dataDrugOrders,
    isSuccess: isSuccessDrugOrders,
    isLoading: isLoadingDrugOrders,
    isFetching: isFetchingDrugOrders,
  } = useQuery(
    ['drugs-order', selectedInstitution],
    () => getDrugOrders(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution) }
  );

  const handleDeliver = useCallback(
    id => {
      const drugOrder = dataDrugOrders?.data.find(
        drugOrder => drugOrder.id === id
      );
      setSelectedOrder(drugOrder);
      onOpenConfirmTakeModal();
    },
    [dataDrugOrders?.data, onOpenConfirmTakeModal]
  );

  const data = React.useMemo(
    () =>
      isSuccessDrugOrders &&
      dataDrugOrders?.data
        // ?.filter((drugOrder) => drugOrder?.status === "packed")
        ?.map(drugOrder => {
          return {
            id: drugOrder.id,
            employee_name: drugOrder.employee_name,
            comments: drugOrder.comments,
            total_price: drugOrder.total_price,
            status: drugOrder.status,
            patient_id: drugOrder.patient_id,
            patient_name: drugOrder.patient_name,
          };
        }),
    [dataDrugOrders?.data, isSuccessDrugOrders]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        Cell: ({ value }) => (
          <Tooltip label={`${value} - Click to copy`} aria-label="A tooltip">
            <Box display="flex" position="relative">
              <Box
                as="span"
                onClick={() => {
                  setClipboardValue(value);
                  onCopy();
                }}
                _hover={{ cursor: 'pointer' }}
              >
                {value?.substring(0, 5)}
              </Box>
              {hasCopied && clipboardValue === value && (
                <Box
                  as="span"
                  display="inline-block"
                  fontSize="sm"
                  bg="gray.200"
                  color="gray.600"
                  fontStyle="italic"
                  fontWeight="semibold"
                  position="absolute"
                  right="-4"
                  px="1"
                  rounded="md"
                >
                  Copied!
                </Box>
              )}
            </Box>
          </Tooltip>
        ),
      },
      {
        Header: 'Patient Name',
        accessor: 'patient_name',
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Employee Name',
        accessor: 'employee_name',
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Comments',
        accessor: 'comments',
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Total Price',
        accessor: 'total_price',
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => {
          if (value?.toLowerCase() === 'delivered') {
            return <Badge colorScheme="green">{value}</Badge>;
          }
          if (value === 'packed') {
            return <Badge colorScheme="blue">Ready to pick up</Badge>;
          }
          return <Badge colorScheme="gray">Not Ready</Badge>;
        },
      },
      {
        Header: 'Details',
        Cell: ({ row }) => {
          return (
            <Button
              as={Link}
              to={`/events/collect-medicine/${row.original.id}`}
              colorScheme="purple"
              variant="link"
            >
              Details
            </Button>
          );
        },
      },
      {
        Header: 'Action',
        Cell: ({ row }) => {
          if (row.original.status === 'packed') {
            return (
              <Button
                colorScheme="purple"
                size="sm"
                onClick={() => handleDeliver(row.original.id)}
              >
                Deliver / Take
              </Button>
            );
          }
          return null;
        },
      },
    ],
    // [clipboardValue, hasCopied, onCopy, path]
    [clipboardValue, hasCopied, onCopy, handleDeliver]
  );

  return (
    <Box>
      {isFetchingDrugOrders && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}
      <ConfirmTakeModal
        isOpen={isOpenConfirmTakeModal}
        onClose={onCloseConfirmTakeModal}
        selectedInstitution={selectedInstitution}
        selectedOrder={selectedOrder}
      />
      <BackButton to="/events" text="Back to Events List" />
      <Heading mb="6" fontSize="3xl">
        Collect Medicine
      </Heading>
      <FormControl id="name" mb="4" maxW="xs">
        <FormLabel>Institution</FormLabel>
        <Select
          name="institution"
          value={selectedInstitution}
          onChange={e => setSelectedInstitution(e.target.value)}
        >
          <option value="">Select Institution</option>
          {isSuccessInstitution &&
            resInstitution?.data?.map(institution => (
              <option key={institution.id} value={institution.id}>
                {institution.name}
              </option>
            ))}
        </Select>
      </FormControl>

      {selectedInstitution && (
        <PaginationTable
          columns={columns}
          data={data || []}
          isLoading={isLoadingDrugOrders}
          skeletonCols={8}
        />
      )}
    </Box>
  );
};

const ConfirmTakeModal = ({
  isOpen,
  onClose,
  selectedOrder,
  selectedInstitution,
}) => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: dataQrCode,
    isLoading: isLoadingQrCode,
    isSuccess: isSuccessQrCode,
  } = useQuery(
    ['receipt-qr-code', selectedOrder?.id],
    () => getOrderDrugQRCode(cookies, selectedOrder?.id),
    {
      enabled: Boolean(selectedOrder?.id),
    }
  );

  const handleSubmit = async () => {
    const data = {
      qr: dataQrCode?.data?.qrcode,
    };
    try {
      setIsLoading(true);
      await takeOrder(cookies)(data);
      await queryClient.invalidateQueries(['drugs-order', selectedInstitution]);
      setIsLoading(false);
      toast({
        title: 'Success',
        description: 'Order delivered',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      setIsLoading(false);
      toast({
        title: 'Error',
        description: 'Failed to deliver order',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Deliver Order</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoadingQrCode && (
            <Center>
              <Spinner
                thickness="4px"
                emptyColor="gray.200"
                color="purple.500"
                size="lg"
              />
            </Center>
          )}
          {isSuccessQrCode && (
            <Flex w="full">
              <Box flexBasis="20%">
                <QRCode value={'A'} />
              </Box>
              <Box ml="10" flex="1">
                <Description
                  title="Patient Name"
                  value={selectedOrder?.patient_name}
                />
                <Description
                  title="Employee Name"
                  value={selectedOrder?.employee_name}
                />
                <Description
                  title="Total Price"
                  value={selectedOrder?.total_price}
                />
              </Box>
            </Flex>
          )}
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            colorScheme="purple"
            isLoading={isLoading}
            onClick={handleSubmit}
            isDisabled={isLoadingQrCode}
          >
            Deliver
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const Description = ({ title, value }) => {
  return (
    <Flex w="full" as="dl" direction={{ base: 'column', sm: 'row' }} py="1">
      <Box as="dt" flexBasis="40%">
        {title}
      </Box>
      <Box as="dd" flex="1" fontWeight="semibold">
        {value}
      </Box>
    </Flex>
  );
};
