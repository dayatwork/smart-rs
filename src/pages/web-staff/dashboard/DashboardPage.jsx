import React, { useState, useContext, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Select,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  VStack,
  Center,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useQuery } from 'react-query';
import { Helmet } from 'react-helmet-async';
import { HiSpeakerphone } from 'react-icons/hi';
import { MdQuestionAnswer } from 'react-icons/md';
import QRCode from 'qrcode.react';
import { exportComponentAsPNG } from 'react-component-export-image';

import Logo from '../../../assets/Logo';
import { AuthContext } from '../../../contexts/authContext';
import { AppShell } from '../../../components/web-staff/shared/app-shell';
import { ContentWrapper } from '../../../components/web-staff/shared/sub-menu';
import {
  InstitutionStatistics,
  BookingStatistics,
  IncomeChart,
  BookingChart,
  TotalIncome,
} from './components';

import {
  getInstitutions,
  getInstitutionQRCode,
} from '../../../api/institution-services/institution';

const DashboardPage = () => {
  const { employeeDetail, user } = useContext(AuthContext);
  const [cookies] = useCookies(['token']);
  const [selectedInstitution, setSelectedInstitution] = useState(
    employeeDetail?.institution_id || ''
  );
  const { onOpen: onOpen, isOpen: isOpen, onClose: onClose } = useDisclosure();

  const { data: resInstitution, isSuccess: isSuccessInstitution } = useQuery(
    'institutions',
    () => getInstitutions(cookies),
    { staleTime: Infinity }
  );

  return (
    <AppShell>
      <Helmet>
        <title>Dashboard | SMART-RS</title>
      </Helmet>
      <CheckInModal
        selectedInstitution={selectedInstitution}
        isOpen={isOpen}
        onClose={onClose}
      />
      <Box height="full" overflow="hidden" position="relative" w="full">
        <Flex h="full">
          <ContentWrapper>
            <Flex justify="space-between" mb={{ base: '3', '2xl': '6' }}>
              <Heading fontSize={{ base: '3xl', '2xl': '4xl' }}>
                Dashboard
              </Heading>
              <HStack>
                <Button colorScheme="purple" onClick={onOpen}>
                  Generate QR Code
                </Button>
                <Button
                  colorScheme="purple"
                  as={Link}
                  to="/dashboard/faq/create"
                  leftIcon={<MdQuestionAnswer />}
                >
                  New FAQ
                </Button>
                <Button
                  colorScheme="purple"
                  as={Link}
                  to="/dashboard/advertisement/create"
                  leftIcon={<HiSpeakerphone />}
                >
                  New Advertisement
                </Button>
              </HStack>
            </Flex>
            <Divider mb="6" />
            {user?.role?.alias === 'super-admin' && (
              <FormControl id="name" mb="6" maxW="xs">
                <FormLabel>Institution</FormLabel>
                <Select
                  bgColor="white"
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

            <InstitutionStatistics
              selectedInstitution={selectedInstitution}
              cookies={cookies}
            />

            <SimpleGrid
              columns={{ base: 1, lg: 2 }}
              gap={{ base: '4', lg: '6' }}
              mb="6"
            >
              <BookingStatistics
                selectedInstitution={selectedInstitution}
                cookies={cookies}
              />
              <TotalIncome
                selectedInstitution={selectedInstitution}
                cookies={cookies}
              />
            </SimpleGrid>

            <SimpleGrid
              columns={{ base: 1, lg: 2 }}
              gap={{ base: '4', lg: '6' }}
            >
              <BookingChart
                selectedInstitution={selectedInstitution}
                cookies={cookies}
              />
              <IncomeChart
                selectedInstitution={selectedInstitution}
                cookies={cookies}
              />
            </SimpleGrid>
          </ContentWrapper>
        </Flex>
      </Box>
    </AppShell>
  );
};

export default DashboardPage;

export const CheckInModal = ({ isOpen, onClose, selectedInstitution }) => {
  const [qr, setQr] = useState('');
  const [cookies] = useCookies(['token']);
  const qrRef = useRef();

  useEffect(() => {
    const fetchQr = async () => {
      try {
        const res = await getInstitutionQRCode(cookies, selectedInstitution);
        setQr(res?.data?.qr);
      } catch (error) {
        console.log({ error });
      }
    };

    fetchQr();
  }, [cookies, selectedInstitution]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Print Institution QR Code</ModalHeader>
        {/* <ModalCloseButton /> */}
        <ModalBody>
          <VStack spacing="0">
            <Box bg="white" p="6" ref={qrRef}>
              <Box bg="purple.500" boxShadow="md" py="4" px="6">
                <Center pb="1" w="full">
                  <Logo width={60} height={60} />
                </Center>
                <Box p="5" bg="white" borderRadius="lg">
                  <QRCode value={qr} />
                </Box>
                <Center fontSize="3xl" fontWeight="bold" color="white" p="0">
                  Scan Me
                </Center>
              </Box>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>

            <Button onClick={() => exportComponentAsPNG(qrRef)}>
              Download
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
