import React from 'react';
import { useParams, Redirect } from 'react-router-dom';
import {
  Box,
  Button,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stack,
  HStack,
  Text,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
  Flex,
  Icon,
  Center,
  Spinner,
  // SimpleGrid,
} from '@chakra-ui/react';
import { HiOutlineExclamation } from 'react-icons/hi';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';

import { getSoapById } from '../../../../../api/medical-record-services/soap';
import {
  Appointment,
  PatientProfile,
  Soap,
} from '../../../../../components/web-staff/event-node/examination/examination-detail';
import { BackButton } from '../../../../../components/shared/BackButton';

export const ExaminationDetailPage = () => {
  const params = useParams();
  const [cookies] = useCookies(['token']);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isCritical, setIsCritical] = React.useState(false);

  const {
    data: dataSoap,
    isSuccess: isSuccessSoap,
    isLoading: isLoadingSoap,
    isError: isErrorSoap,
  } = useQuery(
    ['patient-soap', params.soapId],
    () => getSoapById(cookies, params.soapId),
    { enabled: Boolean(params.soapId) },
  );

  return (
    <>
      {isCritical ? (
        <CriticalBar onOpen={onOpen} />
      ) : (
        <Flex justify="space-between" pt="4">
          <BackButton
            to="/events/examination/active"
            text="Back to Active Patient List"
          />
          <Button colorScheme="red" onClick={onOpen}>
            Critical Button
          </Button>
        </Flex>
      )}

      <ChangeCriticalStatus
        isOpen={isOpen}
        onClose={onClose}
        setIsCritical={setIsCritical}
        isCritical={isCritical}
      />
      {isErrorSoap && <Redirect to="/events/examination" />}
      {isSuccessSoap && dataSoap.code === 404 && <Redirect to="/events/examination" />}
      {isLoadingSoap && (
        <Center h="40">
          <Spinner thickness="4px" emptyColor="gray.200" color="purple.500" size="xl" />
        </Center>
      )}
      {dataSoap?.data && (
        <Tabs
          colorScheme="purple"
          py="4"
          // px="10"
          mx="auto"
          overflowX="auto"
          size="lg">
          <TabList>
            <Tab fontSize="2xl" fontWeight="semibold">
              Profile
            </Tab>
            <Tab fontSize="2xl" fontWeight="semibold">
              SOAP
            </Tab>
            <Tab fontSize="2xl" fontWeight="semibold">
              Appointment
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Box py="6">
                <Heading fontSize="3xl" mb="4">
                  Profile Pasien
                </Heading>
                <PatientProfile dataSoap={dataSoap?.data} />
              </Box>
            </TabPanel>
            <TabPanel>
              <Box py="6">
                <Heading fontSize="3xl" mb="4">
                  SOAP
                </Heading>
                <Soap dataSoap={dataSoap?.data} />
              </Box>
            </TabPanel>
            <TabPanel>
              <Box py="6">
                <Heading fontSize="3xl" mb="4">
                  Appointment
                </Heading>
                <Appointment />
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}
    </>
  );
};

const CriticalBar = ({ onOpen }) => {
  return (
    <Box as="section">
      <Stack
        direction={{ base: 'column', sm: 'row' }}
        py="3"
        px={{ base: '3', md: '6', lg: '8' }}
        color="white"
        bg="red.600"
        justifyContent="center"
        alignItems="center">
        <HStack direction="row" spacing="3">
          <Icon as={HiOutlineExclamation} w="10" h="10" />
          <Text fontWeight="medium" marginEnd="2">
            Pasien dalam kondisi kritis!!!
          </Text>
        </HStack>
        <Button
          onClick={onOpen}
          bg="transparent"
          border="1px"
          borderColor="white"
          _hover={{ bg: 'red.500' }}>
          Ubah Status
        </Button>
      </Stack>
    </Box>
  );
};

const ChangeCriticalStatus = ({ isOpen, onClose, setIsCritical, isCritical }) => (
  <AlertDialog isOpen={isOpen} onClose={onClose}>
    <AlertDialogOverlay>
      <AlertDialogContent>
        <AlertDialogHeader fontSize="lg" fontWeight="bold">
          Ubah Status Pasien
        </AlertDialogHeader>

        {isCritical ? (
          <>
            <AlertDialogBody>Apakah pasien sudah melewati masa kritis</AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                colorScheme="green"
                onClick={() => {
                  setIsCritical(false);
                  onClose();
                }}
                ml={3}>
                Sudah
              </Button>
            </AlertDialogFooter>
          </>
        ) : (
          <>
            <AlertDialogBody>Apakah pasien kritis?</AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  setIsCritical(true);
                  onClose();
                }}
                ml={3}>
                Iya
              </Button>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialogOverlay>
  </AlertDialog>
);
