/* eslint-disable react/display-name */
import React, { useState, useCallback, useContext } from 'react';
import { Link, useRouteMatch, useHistory } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  Heading,
  HStack,
  Spinner,
  Tooltip,
  useClipboard,
  FormLabel,
  Select,
  Badge,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast,
} from '@chakra-ui/react';
import { useQuery, useQueryClient } from 'react-query';
import { useCookies } from 'react-cookie';

import { AuthContext } from '../../../../contexts/authContext';
import { getInstitutions } from '../../../../api/institution-services/institution';
import {
  processPackage,
  getDrugPackages,
} from '../../../../api/pharmacy-services/package';
import PaginationTable from '../../../../components/shared/tables/PaginationTable';
import { BackButton } from '../../../../components/shared/BackButton';
import { PrivateComponent, Permissions } from '../../../../access-control';

export const DrugPackagePage = () => {
  const { employeeDetail, user } = useContext(AuthContext);
  const { path } = useRouteMatch();
  const [cookies] = useCookies(['token']);
  const [clipboardValue, setClipboardValue] = useState('');
  const { hasCopied, onCopy } = useClipboard(clipboardValue);
  const [selectedInstitution, setSelectedInstitution] = useState(
    employeeDetail?.institution_id || ''
  );
  const [selectedDrugOrder, setSelectedDrugOrder] = useState(null);

  const { data: resInstitution, isSuccess: isSuccessInstitution } = useQuery(
    'institutions',
    () => getInstitutions(cookies)
  );

  const {
    onOpen: onProcessPackageOpen,
    isOpen: isProcessPackageOpen,
    onClose: onProcessPackageClose,
  } = useDisclosure();

  const {
    data: dataDrugPackages,
    isSuccess: isSuccessDrugPackages,
    isLoading: isLoadingDrugPackages,
    isFetching: isFetchingDrugPackages,
  } = useQuery(
    ['drugs-packages', selectedInstitution],
    () => getDrugPackages(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution) }
  );

  const handleProcessPackaging = useCallback(
    id => {
      const drug = dataDrugPackages?.data.find(drug => drug.id === id);
      setSelectedDrugOrder(drug);
      onProcessPackageOpen();
    },
    [dataDrugPackages?.data, onProcessPackageOpen]
  );

  const data = React.useMemo(
    () =>
      isSuccessDrugPackages &&
      dataDrugPackages?.data?.map(drugPackages => {
        return {
          id: drugPackages.id,
          receipt_id: drugPackages?.receipt_id,
          patient_id: drugPackages?.patient?.id,
          patient_name: drugPackages?.patient?.name,
          package_date: drugPackages?.package_date,
          status: drugPackages?.status,
        };
      }),
    [dataDrugPackages?.data, isSuccessDrugPackages]
  );

  // console.log({ dataDrugOrders });
  // console.log({ selectedDrugOrder });

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
        Header: 'Receipt ID',
        accessor: 'receipt_id',
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Patient Name',
        accessor: 'patient_name',
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Package Date',
        accessor: 'package_date',
        Cell: ({ value }) => {
          if (value) {
            return new Date(value).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            });
          }
        },
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => {
          // console.log({ value });
          if (value === 'Delivered') {
            return <Badge colorScheme="green">{value}</Badge>;
          }
          if (value === 'process') {
            return <Badge colorScheme="blue">{value}</Badge>;
          }
          if (value === 'completed') {
            return <Badge colorScheme="green">{value}</Badge>;
          }
          return <Badge colorScheme="gray">{value}</Badge>;
        },
      },
      {
        Header: 'Details',
        Cell: ({ row }) => {
          if (row.original.status === 'requested') {
            return null;
          }
          return (
            <PrivateComponent permission={Permissions['read-detailPackaging']}>
              <HStack>
                <Button
                  variant="link"
                  as={Link}
                  colorScheme="purple"
                  // to={`${path}/${row.original.receipt_id}`}
                  to={`${path}/${row.original.id}`}
                >
                  Details
                </Button>
              </HStack>
            </PrivateComponent>
          );
        },
      },
      {
        Header: 'Action',
        Cell: ({ row }) => {
          if (row.original.status === 'requested') {
            return (
              <PrivateComponent permission={Permissions.startPackaging}>
                <Button
                  colorScheme="purple"
                  size="sm"
                  onClick={() => handleProcessPackaging(row.original.id)}
                >
                  Start
                </Button>
              </PrivateComponent>
            );
          }
          return null;
        },
      },
    ],
    [clipboardValue, hasCopied, onCopy, path, handleProcessPackaging]
  );

  return (
    <Box>
      {isFetchingDrugPackages && (
        <Spinner top="10" right="12" position="absolute" colorScheme="purple" />
      )}
      <ConfirmProcessPackageModal
        onClose={onProcessPackageClose}
        isOpen={isProcessPackageOpen}
        selectedDrugPackage={selectedDrugOrder}
        selectedInstitution={selectedInstitution}
      />
      <BackButton to="/pharmacy" text="Back to Pharmacy" />
      <Heading mb="6" fontSize="3xl">
        Packaging
      </Heading>
      {user?.role?.alias === 'super-admin' && (
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
      )}

      {selectedInstitution && (
        <PaginationTable
          columns={columns}
          data={data || []}
          isLoading={isLoadingDrugPackages}
          skeletonCols={7}
        />
      )}
    </Box>
  );
};

const ConfirmProcessPackageModal = ({
  isOpen,
  onClose,
  selectedDrugPackage,
  // selectedInstitution,
}) => {
  const toast = useToast();
  const history = useHistory();
  const [cookies] = useCookies(['token']);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const data = {
    id: selectedDrugPackage?.id,
    status: 'process',
  };

  const handleStartPackaging = async () => {
    try {
      setIsLoading(true);
      await processPackage(cookies)(data);
      await queryClient.invalidateQueries('drugs-order');
      setIsLoading(false);
      toast({
        title: 'Success',
        description: 'Success start packaging',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      history.push(`/pharmacy/packaging/${selectedDrugPackage?.receipt_id}`);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: 'Error',
        description: 'Error start packaging',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Process Packaging</ModalHeader>
        <ModalCloseButton />
        <ModalBody>Start to process this packaging</ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            colorScheme="purple"
            onClick={handleStartPackaging}
            isLoading={isLoading}
          >
            Start
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
