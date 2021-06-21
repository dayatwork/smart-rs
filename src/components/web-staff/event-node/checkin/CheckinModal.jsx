import React, { useState } from 'react';
import {
  Button,
  Box,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast,
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useQueryClient } from 'react-query';

import { createCheckIn } from '../../../../api/checkin-services/checkin';

export const CheckInModal = ({ isOpen, onClose, selectedBooking }) => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [name, setName] = useState('');
  const [isLoadingCheckIn, setIsLoadingCheckIn] = useState(false);
  const queryClient = useQueryClient();

  const handleCheckIn = async () => {
    try {
      setIsLoadingCheckIn(true);
      await createCheckIn(cookies, selectedBooking.id);
      await queryClient.invalidateQueries('booking-list');
      setIsLoadingCheckIn(false);
      toast({
        title: 'Success',
        description: `${name} berhasil checkin`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      setIsLoadingCheckIn(false);
      toast({
        title: 'Error',
        description: `Check in gagal`,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setName('');
        onClose();
      }}
      size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Apakah anda ingin check-in pasien ini?</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <Description title="Nama Pasien" value={selectedBooking?.patient_name} />
            <Description title="Nama Dokter" value={selectedBooking?.doctor_name} />
            <Description title="Layanan" value={selectedBooking?.service_name} />
            <Description
              title="Tanggal"
              value={`${selectedBooking?.days}, ${selectedBooking?.date}`}
            />
            <Description title="Waktu" value={selectedBooking?.time} />
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            colorScheme="purple"
            onClick={handleCheckIn}
            isLoading={isLoadingCheckIn}>
            Check In
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
