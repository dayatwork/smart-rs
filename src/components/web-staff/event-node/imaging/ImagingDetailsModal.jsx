import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  Flex,
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';

import { startRadiology } from '../../../../api/radiology-services/radiology';

export const ImagingDetailsModal = ({ isOpen, onClose, selectedRadiology }) => {
  const history = useHistory();
  const [cookies] = useCookies(['token']);
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = async () => {
    try {
      setIsLoading(true);
      await startRadiology(cookies, { id: selectedRadiology?.id });
      setIsLoading(false);
      history.push(`/events/imaging/details/${selectedRadiology?.id}`);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Patient Detail</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box px="4">
            <Description title="Name" value={selectedRadiology?.patient_name} />
            <Description
              title="Patient Number"
              value={selectedRadiology?.patient_number}
            />
            <Description title="Test type" value="" />
            <Description title="Date" value={selectedRadiology?.date} />
            <Description title="Time" value={selectedRadiology?.time} />
            <Description
              title="Description"
              value={selectedRadiology?.description}
            />
            <Description
              title="SOAP ID"
              value={
                <Button
                  as={Link}
                  variant="link"
                  to={`/events/examination/details/${selectedRadiology?.soap_id}`}
                  target="_blank"
                >
                  {selectedRadiology?.soap_id}
                </Button>
              }
            />
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button
            // to="/events/imaging/1234"
            colorScheme="purple"
            onClick={handleStart}
            isLoading={isLoading}
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
    <Flex
      as="dl"
      direction={{ base: 'column', sm: 'row' }}
      // px="6"
      // py="4"
      _even={{ bgColor: 'gray.50' }}
    >
      <Box
        as="dt"
        px="6"
        py="2"
        flexBasis="25%"
        border="1px"
        borderColor="gray.200"
      >
        {title}
      </Box>
      <Box
        as="dd"
        px="6"
        py="2"
        flex="1"
        fontWeight="semibold"
        border="1px"
        borderColor="gray.200"
      >
        {value}
      </Box>
    </Flex>
  );
};
