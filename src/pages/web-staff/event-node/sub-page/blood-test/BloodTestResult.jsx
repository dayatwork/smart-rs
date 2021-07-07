import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  SimpleGrid,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { FaPrint } from 'react-icons/fa';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';
import QRCode from 'qrcode.react';
import { useReactToPrint } from 'react-to-print';

import { getLaboratoryResultDetail } from '../../../../../api/laboratory-services/result';
import { getLaboratoryBloodDetail } from '../../../../../api/laboratory-services/blood';
import { BackButton } from '../../../../../components/shared/BackButton';

export const BloodTestResult = () => {
  const [cookies] = useCookies(['token']);
  const params = useParams();
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const { data: dataLaboratoryResult, isLoading: isLoadingLaboratoryResult } =
    useQuery(
      ['laboratory-test-result', params?.id],
      () => getLaboratoryResultDetail(cookies, params?.id),
      { enabled: Boolean(params?.id) }
    );

  const { data: dataBloodDetail, isLoading: isLoadingBloodDetail } = useQuery(
    ['laboratory-blood-detail', dataLaboratoryResult?.data?.blood_id],
    () =>
      getLaboratoryBloodDetail(cookies, dataLaboratoryResult?.data?.blood_id),
    {
      enabled: Boolean(dataLaboratoryResult?.data?.blood_id),
    }
  );

  if (isLoadingBloodDetail || isLoadingLaboratoryResult) {
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

  console.log({ dataLaboratoryResult });

  return (
    <Box>
      <BackButton to="/events/blood-test" text="Back to Blood Test List" />

      <Flex
        justify="space-between"
        align="center"
        mb={{ base: '3', '2xl': '6' }}
        maxW="3xl"
      >
        <Heading fontSize={{ base: '2xl', '2xl': '3xl' }}>
          Lab Test Result
        </Heading>

        <Button onClick={handlePrint} leftIcon={<FaPrint />}>
          Cetak
        </Button>
      </Flex>
      <Box maxW="3xl" boxShadow="md" pt="4" pb="8" px="6" ref={printRef}>
        <Heading textAlign="center" fontSize="xl" mb="6">
          Hasil Pemeriksaan Laboratorium
        </Heading>
        <Box mb="4">
          <Description
            title="Tempat Ambil Darah"
            value={dataBloodDetail?.data?.location}
          />
          <Description
            title="Waktu Ambil Darah"
            value={dataBloodDetail?.data?.draw_time}
          />
          <Description
            title="Dokter Pengirim"
            value={dataBloodDetail?.data?.employee?.name}
          />
          <Description
            title="Waktu Pemeriksaan"
            value={dataLaboratoryResult?.data?.time}
          />
          <Description
            title="No ID SOAP"
            value={dataBloodDetail?.data?.soap_id}
          />
          <Description
            title="Nama Pasien"
            value={dataLaboratoryResult?.data?.patient?.name}
          />
          <Description title="Alamat" value="..." />
          <Description title="Tanggal Selesai Hasil" value="???" />
        </Box>
        <Table variant="simple" border="1px" borderColor="gray.200" mb="8">
          <Thead>
            <Tr>
              <Th>Pemeriksaan</Th>
              <Th isNumeric>Hasil</Th>
              <Th>Satuan</Th>
              <Th>Nilai Normal</Th>
              <Th>Metode</Th>
            </Tr>
          </Thead>
          <Tbody>
            {dataLaboratoryResult?.data?.blood_result_details?.map(data => (
              <Tr>
                <Td>{data.name}</Td>
                <Td isNumeric>{data.result}</Td>
                <Td>{data.unit}</Td>
                <Td>{data.normal_result}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <SimpleGrid columns={2}>
          <Box>
            <Text fontWeight="semibold">Catatan:</Text>
            <Text>{dataLaboratoryResult?.data?.note}</Text>
          </Box>
          <Box>
            <Text fontWeight="semibold" mb="2">
              Penanggung Jawab
            </Text>
            <QRCode value="http://google.com" />
          </Box>
        </SimpleGrid>
      </Box>
    </Box>
  );
};

const Description = ({ title, value }) => {
  return (
    <Flex as="dl" direction={{ base: 'column', sm: 'row' }} py="2">
      <Box as="dt" flexBasis="40%">
        {title}
      </Box>
      <Box as="dd" flex="1" fontWeight="semibold">
        {value}
      </Box>
    </Flex>
  );
};
