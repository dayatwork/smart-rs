import React, { useState } from 'react';
import {
  Button,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useQueryClient } from 'react-query';

import { deleteRadiologyCategory } from '../../../../api/institution-services/radiology-category';

export const DeleteRadiologyCategoryAlert = ({
  isOpen,
  onClose,
  selectedCategory,
  selectedInstitution,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [cookies] = useCookies(['token']);
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await deleteRadiologyCategory(cookies, selectedCategory);
      await queryClient.invalidateQueries([
        'insitution-radiology-categories',
        selectedInstitution,
      ]);
      setIsLoading(false);
      onClose();
      toast({
        title: 'Success',
        description: `Radiology category deleted successfully`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      setIsLoading(false);
      toast({
        title: 'Error',
        description: `Error delete radiology category`,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <AlertDialog
      motionPreset="slideInBottom"
      onClose={onClose}
      isOpen={isOpen}
      isCentered>
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogHeader>Delete Category</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>
          Are you sure? You can not undo this action afterwards.
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button onClick={onClose}>No</Button>
          <Button colorScheme="red" ml={3} onClick={handleDelete} isLoading={isLoading}>
            Yes
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
