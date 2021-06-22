import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  useToast,
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useQueryClient } from 'react-query';
import QRCode from 'qrcode.react';

import { scanQRCodeLaboratoryRegistration } from '../../../../api/laboratory-services/register';
import { createLaboratoryBlood } from '../../../../api/laboratory-services/blood';

export const StartLabTestModal = ({
  isOpen,
  onClose,
  currentQR,
  selectedPatient,
}) => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    const data = {
      qr: currentQR,
      // qr: "",
    };
    try {
      setIsLoading(true);
      const res = await scanQRCodeLaboratoryRegistration(cookies)(data);
      if (res.code === 200) {
        const payload = {
          registration_id: selectedPatient?.id,
          institution_id: selectedPatient?.institution_id,
          laboratory_id: null,
          patient_id: selectedPatient?.patient_id,
        };
        await createLaboratoryBlood(cookies)(payload);
        await queryClient.invalidateQueries([
          'laboratory-registration-list',
          selectedPatient?.institution_id,
        ]);
        setIsLoading(false);
        toast({
          title: 'Success',
          description: 'Blood test created',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        onClose();
      } else {
        throw new Error('Patient not found');
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: 'Error',
        description: 'Patient not found',
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
        <ModalHeader>Start Lab Test</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {currentQR && (
            <Flex w="full">
              <Box flexBasis="20%">
                <QRCode value={currentQR} />
              </Box>
              <Box ml="10" flex="1">
                <Description
                  title="Patient Name"
                  value={selectedPatient?.patient_data?.name}
                />
                <Description
                  title="Patient Number"
                  value={selectedPatient?.patient_data?.patient_number}
                />
                <Description title="Date" value={selectedPatient?.date} />
                <Description title="Time" value={selectedPatient?.time} />
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
          >
            Start
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
