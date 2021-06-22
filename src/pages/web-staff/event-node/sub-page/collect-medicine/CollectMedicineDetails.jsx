import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  ListItem,
  SimpleGrid,
  Spinner,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';
import { FaPrint } from 'react-icons/fa';
import { useReactToPrint } from 'react-to-print';

import {
  getOrderDrugDetail,
  getOrderDrugQRCode,
} from '../../../../../api/pharmacy-services/receipt';
import { Logo } from '../../../../../components/shared/Logo';
import { BackButton } from '../../../../../components/shared/BackButton';

export const CollectMedicineDetails = () => {
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

  const { data: dataDrugOrderDetail, isLoading: isLoadingDrugOrderDetail } =
    useQuery(
      ['drug-order-detail', params?.id],
      () => getOrderDrugDetail(cookies, params?.id),
      { enabled: Boolean(params?.id) }
    );

  const {
    data: dataDrugOrderQRCode,
    isLoading: isLoadingDrugOrderQRCode,
    isSuccess: isSuccessDrugOrderQRCode,
    isFetching: isFetchingDrugOrderQRCode,
  } = useQuery(
    ['drug-order-qrcode', params?.id],
    () => getOrderDrugQRCode(cookies, params?.id),
    { enabled: Boolean(params?.id) }
  );

  if (isLoadingDrugOrderDetail || isLoadingDrugOrderQRCode) {
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
      <BackButton
        to="/events/collect-medicine"
        text="Back to Collect Medicine List"
      />
      <Flex justify="space-between" align="center" mb="6">
        <Heading fontSize="3xl">Medicine Details</Heading>
        {isSuccessDrugOrderQRCode &&
          !isFetchingDrugOrderQRCode &&
          dataDrugOrderQRCode?.data?.status !== 'delivered' && (
            <Text>
              Status:{' '}
              <Box as="span" fontWeight="semibold">
                Not ready
              </Box>
            </Text>
          )}
        {isSuccessDrugOrderQRCode &&
          dataDrugOrderQRCode?.data?.status === 'delivered' && (
            <Text>
              Status:{' '}
              <Box color="green" as="span" fontWeight="semibold">
                Delivered
              </Box>
            </Text>
          )}
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
              title="Nama pasien"
              value={dataDrugOrderDetail?.data?.patient_name}
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
