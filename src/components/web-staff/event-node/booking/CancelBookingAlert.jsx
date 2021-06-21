import React from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react';

export const CancelBookingAlert = ({
  isOpen,
  onClose,
  selectedBooking,
  handleCancel,
  isLoadingCancel,
}) => {
  return (
    <>
      <AlertDialog isOpen={isOpen} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Cancel Booking
            </AlertDialogHeader>

            <AlertDialogBody>
              <Description title="Patient Name" value={selectedBooking?.patient_name} />
              <Description title="Service" value={selectedBooking?.service_name} />
              <Description
                title="Date"
                value={`${selectedBooking?.days}, ${selectedBooking?.date}`}
              />
              <Description title="Time" value={selectedBooking?.time} />
              <Text mt="4">Are you sure? You can not undo this action afterwards.</Text>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onClose}>Close</Button>
              <Button
                colorScheme="red"
                onClick={() => handleCancel(selectedBooking?.id)}
                ml={3}
                isLoading={isLoadingCancel}>
                Cancel Booking
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
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
