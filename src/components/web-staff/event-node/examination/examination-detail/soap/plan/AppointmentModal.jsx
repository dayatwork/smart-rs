import React from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  Select,
} from '@chakra-ui/react';

import DatePicker from 'react-datepicker';
import 'react-day-picker/lib/style.css';

export const AppointmentModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Appointment</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb="4" id="category">
            <FormLabel>Category</FormLabel>
            <Select>
              <option>Category 1</option>
              <option>Category 2</option>
              <option>Category 3</option>
            </Select>
          </FormControl>
          <FormControl mb="4" id="subCategory">
            <FormLabel>Sub Category</FormLabel>
            <Select>
              <option>Sub Category 1</option>
              <option>Sub Category 2</option>
              <option>Sub Category 3</option>
            </Select>
          </FormControl>
          <FormControl mb="4" id="doctor">
            <FormLabel>Doctor</FormLabel>
            <Select>
              <option>Doctor 1</option>
              <option>Doctor 2</option>
              <option>Doctor 3</option>
            </Select>
          </FormControl>
          <FormControl mb="4" id="date">
            <FormLabel>Date</FormLabel>
            <Input as={DatePicker} />
          </FormControl>
          <FormControl mb="4" id="time">
            <FormLabel>Time</FormLabel>
            <Select>
              <option>time 1</option>
              <option>time 2</option>
              <option>time 3</option>
            </Select>
          </FormControl>
          <FormControl mb="4" id="description">
            <FormLabel>Description</FormLabel>
            <Textarea rows="6" />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Close
          </Button>
          <Button colorScheme="green">Submit</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
