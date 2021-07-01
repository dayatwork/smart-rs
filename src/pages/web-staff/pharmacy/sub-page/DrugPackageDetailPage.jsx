import React, { useRef, useState } from 'react';
import { useParams, useHistory, Redirect } from 'react-router-dom';
import {
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  HStack,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Text,
  UnorderedList,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useQuery, useQueryClient } from 'react-query';
import { useCookies } from 'react-cookie';
import { FaPrint } from 'react-icons/fa';
import { useReactToPrint } from 'react-to-print';

import { Logo } from '../../../../components/shared/Logo';
import { getOrderDrugDetail } from '../../../../api/pharmacy-services/receipt';
import {
  completePackage,
  getDrugPackageDetail,
} from '../../../../api/pharmacy-services/package';
import { BackButton } from '../../../../components/shared/BackButton';
import { PrivateComponent, Permissions } from '../../../../access-control';

export const DrugPackageDetailPage = () => {
  const params = useParams();

  const [cookies] = useCookies(['token']);
  const printRef = useRef();
  const printRef2 = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  const handlePrint2 = useReactToPrint({
    content: () => printRef2.current,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    data: dataDrugPackageDetail,

    isLoading: isLoadingDrugPackageDetail,
  } = useQuery(
    ['drugs-package-detail', params?.id],
    () => getDrugPackageDetail(cookies, params?.id),
    { enabled: Boolean(params?.id) }
  );

  const { data: dataDrugOrderDetail, isLoading: isLoadingDrugOrderDetail } =
    useQuery(
      ['drug-order-detail', dataDrugPackageDetail?.data?.receipt_id],
      () =>
        getOrderDrugDetail(cookies, dataDrugPackageDetail?.data?.receipt_id),
      { enabled: Boolean(dataDrugPackageDetail?.data?.receipt_id) }
    );

  if (
    dataDrugPackageDetail?.code === 404 ||
    dataDrugPackageDetail?.code === 400
  ) {
    return <Redirect to="/pharmacy/packaging" />;
  }

  if (isLoadingDrugPackageDetail || isLoadingDrugOrderDetail) {
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
      <ConfirmCompletePackageModal
        onClose={onClose}
        isOpen={isOpen}
        packageDetail={dataDrugPackageDetail?.data}
        orderDetail={dataDrugOrderDetail?.data}
      />

      <BackButton to="/pharmacy" text="Back to Packaging List" />
      <Flex
        justify="space-between"
        align="center"
        mb={{ base: '3', '2xl': '4' }}
      >
        <Heading fontSize={{ base: '2xl', '2xl': '3xl' }}>
          Package Details
        </Heading>
        <HStack>
          {dataDrugPackageDetail?.data?.status === 'process' && (
            <PrivateComponent
              permission={Permissions['make-completePackaging']}
            >
              <Button colorScheme="purple" onClick={onOpen}>
                Complete
              </Button>
            </PrivateComponent>
          )}
          {dataDrugPackageDetail?.data?.status === 'completed' && (
            <Flex align="center">
              <Text mr="2" fontWeight="semibold">
                Status:{' '}
              </Text>
              <Badge colorScheme="green">Completed</Badge>
            </Flex>
          )}
        </HStack>
      </Flex>
      <Divider my="2" />
      <Box>
        <Flex justify="space-between" align="center" mb="2" maxW="2xl">
          <Heading fontSize="xl">Summary</Heading>
          <Box textAlign="right" maxW="md">
            <Button onClick={handlePrint2} leftIcon={<FaPrint />}>
              Cetak
            </Button>
          </Box>
        </Flex>
        <Box
          ref={printRef2}
          bg="white"
          boxShadow="md"
          maxW="2xl"
          px="6"
          py="4"
          // mb="6"
        >
          <Box bgColor="gray.100" py="2">
            <Logo mb="0" />
          </Box>
          <Box p="4">
            <Description
              title="Rumah Sakit"
              value={dataDrugOrderDetail?.data?.institution_name}
              fontSize="md"
            />
            <Description
              title="Nama Pasien"
              value={dataDrugOrderDetail?.data?.patient_name}
              fontSize="md"
            />
            <Description
              title="Nomor Pasien"
              value={dataDrugPackageDetail?.data?.patient_data?.patient_number}
              fontSize="md"
            />
            <Description
              title="Nama Staff RS"
              value={dataDrugOrderDetail?.data?.employee_name}
              fontSize="md"
            />
            <Description
              title="Tanggal"
              value={new Date(
                dataDrugOrderDetail?.data?.created_at
              ).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
              fontSize="md"
            />
            <Description
              title="Catatan"
              value={dataDrugOrderDetail?.data?.comments}
              fontSize="md"
            />
            <Description
              title="Total Harga"
              value={dataDrugOrderDetail?.data?.total_price}
              fontSize="md"
            />
            <Divider my="2" />
            <Text fontWeight="semibold" color="gray.600">
              List Obat
            </Text>
            <UnorderedList pl="4">
              {dataDrugOrderDetail?.data?.drug_list?.map(drug => (
                <ListItem py="1" key={drug.id}>
                  <SimpleGrid columns={3}>
                    <Text>{drug?.drug_name}</Text>
                    <Text>
                      {drug?.quantity} {drug?.unit ? drug?.unit : 'ml'}
                    </Text>
                    <Text>{drug?.frequency} kali sehari</Text>
                  </SimpleGrid>
                </ListItem>
              ))}
            </UnorderedList>
          </Box>
        </Box>
      </Box>
      <Divider mt="8" />
      <Box mt="6">
        <Flex justify="space-between" align="center" mb="2" maxW="md">
          <Heading fontSize="xl">Print Sticker</Heading>
          <Box textAlign="right" maxW="md" mt="3">
            <Button onClick={handlePrint} leftIcon={<FaPrint />}>
              Cetak
            </Button>
          </Box>
        </Flex>
        <Box ref={printRef} bg="white" boxShadow="md" maxW="md" p="4">
          {dataDrugOrderDetail?.data?.drug_list?.map(drug => (
            <Box key={drug.id}>
              <Box mb="6" border="1px" borderColor="gray.200" bgColor="gray.50">
                <Box bg="gray.200" py="2">
                  <Center
                    fontSize="lg"
                    fontWeight="bold"
                    textTransform="uppercase"
                  >
                    {dataDrugOrderDetail?.data?.institution_name}
                  </Center>
                </Box>
                <Box px="3">
                  <Box py="2">
                    <Description
                      title="Nama Pasien"
                      value={dataDrugOrderDetail?.data?.patient_name}
                    />
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      mb="2"
                      color="gray.600"
                    >
                      Dosis Pemakaian
                    </Text>
                    <Flex justify="space-between" align="center">
                      <Text fontSize="sm">
                        <Box
                          as="span"
                          display="inline-block"
                          border="1px"
                          borderColor="gray.500"
                          p="2"
                          fontWeight="semibold"
                        >
                          {drug?.quantity}
                        </Box>{' '}
                        {drug?.unit ? drug?.unit : 'ml'}{' '}
                      </Text>
                      <Text fontSize="sm">
                        <Box
                          as="span"
                          display="inline-block"
                          border="1px"
                          borderColor="gray.500"
                          py="2"
                          px="3"
                          fontWeight="semibold"
                        >
                          {drug?.frequency}
                        </Box>{' '}
                        kali sehari
                      </Text>
                      <Text fontSize="sm">
                        {drug?.eat === 'After'
                          ? 'Sesudah makan'
                          : drug?.eat === 'Before'
                          ? 'Sebelum makan'
                          : 'Sesudah/ sebelum makan'}
                      </Text>
                    </Flex>
                  </Box>
                  <Description title="Nama obat" value={drug.drug_name} />
                  <Description
                    title="Deskripsi"
                    value={drug.description ? drug.description : '-'}
                  />
                </Box>
              </Box>
              <Divider my="2" variant="dashed" />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

const ConfirmCompletePackageModal = ({
  isOpen,
  onClose,
  packageDetail,
  orderDetail,
}) => {
  const toast = useToast();
  const history = useHistory();
  const [cookies] = useCookies(['token']);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleCompletePackaging = async () => {
    const data = {
      id: packageDetail?.id,
      status: 'completed',
    };
    try {
      setIsLoading(true);
      await completePackage(cookies)(data);
      await queryClient.invalidateQueries([
        'drugs-packages',
        packageDetail?.institution_id,
      ]);
      setIsLoading(false);
      toast({
        position: 'top-right',
        title: 'Success',
        description: 'Packaging Completed',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      history.push(`/pharmacy/packaging`);
    } catch (error) {
      setIsLoading(false);
      toast({
        position: 'top-right',
        title: 'Error',
        description: 'Error complete packaging',
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
        <ModalHeader>Complete Packaging</ModalHeader>
        <ModalCloseButton />
        <ModalBody>Finish packaging? </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            colorScheme="purple"
            onClick={handleCompletePackaging}
            isLoading={isLoading}
          >
            Finish
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const Description = ({ title, value, ...props }) => {
  return (
    <Flex
      as="dl"
      direction={{ base: 'column', sm: 'row' }}
      // px="6"
      py="2"
      // _even="gray.50"
      fontSize="sm"
      {...props}
    >
      <Box
        as="dt"
        flexBasis="25%"
        fontWeight="semibold"
        color="gray.600"
        mr="4"
      >
        {title}
      </Box>
      <Box as="dd" flex="1" fontWeight="semibold">
        {value}
      </Box>
    </Flex>
  );
};
