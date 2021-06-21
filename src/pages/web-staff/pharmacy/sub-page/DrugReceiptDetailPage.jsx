import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useQuery, useQueryClient } from 'react-query';
import { useCookies } from 'react-cookie';

import { getOrderDrugDetail } from '../../../../api/pharmacy-services/receipt';
import { createPackage } from '../../../../api/pharmacy-services/package';
import { BackButton } from '../../../../components/shared/BackButton';

export const DrugReceiptDetailPage = () => {
  const params = useParams();
  const history = useHistory();
  const toast = useToast();
  const [cookies] = useCookies(['token']);

  const [isLoadingCreatePackage, setIsLoadingCreatePackage] = useState(false);
  const queryClient = useQueryClient();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: dataDrugOrderDetail, isLoading: isLoadingDrugOrderDetail } = useQuery(
    ['drug-order-detail', params?.id],
    () => getOrderDrugDetail(cookies, params?.id),
    { enabled: Boolean(params?.id) },
  );

  const handleCreatePackage = async () => {
    const data = {
      receipt_id: dataDrugOrderDetail?.data?.id,
    };
    try {
      setIsLoadingCreatePackage(true);
      const res = await createPackage(cookies)(data);
      console.log({ res });
      await queryClient.invalidateQueries('drugs-order');
      setIsLoadingCreatePackage(false);
      toast({
        title: 'Success',
        description: 'Package created',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      history.push('/pharmacy/packaging');
    } catch (error) {
      console.log(error);
      setIsLoadingCreatePackage(false);
      toast({
        title: 'Error',
        description: 'Error create package',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  if (isLoadingDrugOrderDetail) {
    return (
      <Center h="60">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="purple.500"
          size="xl"
        />
      </Center>
    );
  }

  return (
    <Box>
      <ConfirmCreatePackageModal
        onClose={onClose}
        isOpen={isOpen}
        handleCreatePackage={handleCreatePackage}
        isLoading={isLoadingCreatePackage}
      />

      <BackButton to="/pharmacy/receipt" text="Back to Receipt List" />
      <Flex justify="space-between" align="center" mb="4">
        <Heading fontSize="3xl">Receipt Details</Heading>
        <Button colorScheme="purple" onClick={onOpen}>
          Process to Packaging
        </Button>
      </Flex>
      <Box boxShadow="md" maxW="5xl" py="4" px="6">
        <Description
          title="Hospital Name"
          value={dataDrugOrderDetail?.data?.institution_name}
        />
        <Description
          title="Patient Name"
          value={dataDrugOrderDetail?.data?.patient_name}
        />
        <Description
          title="Employee Name"
          value={dataDrugOrderDetail?.data?.employee_name}
        />
        <Divider my="2" />
        <Text fontSize="md" fontWeight="semibold" textAlign="center" mb="4">
          Drug Details
        </Text>
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>Drug Name</Th>
              <Th>Quantity</Th>
              <Th>Frequency</Th>
              <Th>Before/After Meals</Th>
              <Th>Description</Th>
            </Tr>
          </Thead>
          <Tbody>
            {dataDrugOrderDetail?.data?.drug_list?.map((drug) => (
              <Tr key={drug.id}>
                <Td>{drug?.drug_name}</Td>
                <Td>
                  {drug?.quantity} {drug?.unit}
                </Td>
                <Td>{drug?.frequency} times a day</Td>
                <Td>
                  {drug?.eat === 'After'
                    ? 'After meals'
                    : drug?.eat === 'Before'
                    ? 'Before meals'
                    : 'Free'}
                </Td>
                <Td>{drug?.description}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

const ConfirmCreatePackageModal = ({
  isOpen,
  onClose,
  handleCreatePackage,
  isLoading,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Package</ModalHeader>
        <ModalCloseButton />
        <ModalBody>Are you sure to package this order?</ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            colorScheme="purple"
            onClick={handleCreatePackage}
            isLoading={isLoading}>
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const Description = ({ title, value, ...props }) => {
  return (
    <Flex as="dl" direction={{ base: 'column', sm: 'row' }} py="2" {...props}>
      <Box as="dt" flexBasis="25%" fontWeight="semibold" color="gray.600" mr="4">
        {title}
      </Box>
      <Box as="dd" flex="1" fontWeight="semibold">
        {value}
      </Box>
    </Flex>
  );
};
