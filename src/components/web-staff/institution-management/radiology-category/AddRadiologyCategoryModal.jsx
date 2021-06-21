import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Select,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import ReactSelect from 'react-select';

import {
  getRadiologyCategories as getRadiologyCategoriesMaster,
  getRadiologySubCategories as getRadiologySubCategoriesMaster,
} from '../../../../api/master-data-services/radiology-category';
import {
  getRadiologyCategories,
  createRadiologyCategory,
} from '../../../../api/institution-services/radiology-category';

export const AddRadiologyCategoryModal = ({ isOpen, onClose, selectedInstitution }) => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [isLoading, setIsLoading] = useState(false);
  const [, setErrMessage] = useState('');
  const [selectedRadiologyCategory, setSelectedRadiologyCategory] = useState('');
  const [subCategories, setSubCategories] = useState([]);
  const queryClient = useQueryClient();

  const {
    data: dataRadiologyCatagoriesMaster,
    isSuccess: isSuccessRadiologyCatagoriesMaster,
  } = useQuery('master-radiology-categories', () =>
    getRadiologyCategoriesMaster(cookies),
  );

  const {
    data: dataLabSubCategoriesMaster,
    isFetching: isFetchingLabSubCategoriesMaster,
  } = useQuery(
    ['master-radiology-subcategories', selectedRadiologyCategory],
    () => getRadiologySubCategoriesMaster(cookies, selectedRadiologyCategory),
    {
      enabled: Boolean(selectedRadiologyCategory),
    },
  );

  const { data: dataCategories } = useQuery(
    ['insitution-radiology-categories', selectedInstitution],
    () => getRadiologyCategories(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution) },
  );

  const { mutate } = useMutation(createRadiologyCategory(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries([
          'insitution-radiology-categories',
          selectedInstitution,
        ]);
        setErrMessage('');
        setSelectedRadiologyCategory('');
        setSubCategories([]);
        toast({
          title: 'Success',
          description: `Radiology category added successfully`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      }

      if (error) {
        setErrMessage(error.message || 'Error');
      }
    },
    onError: () => {
      // mutation error
    },
    onSuccess: () => {
      // mutation success
    },
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = subCategories.map((subcategory) => JSON.parse(subcategory.value));
    const payload = {
      institution_id: selectedInstitution,
      data,
    };
    await mutate(payload);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Radiology Category</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="category" mb="6">
            <FormLabel>Radiology Category</FormLabel>
            <Select
              name="RadiologyCategory"
              value={selectedRadiologyCategory}
              onChange={(e) => setSelectedRadiologyCategory(e.target.value)}>
              <option value="">Select Radiology Category</option>
              {isSuccessRadiologyCatagoriesMaster &&
                dataRadiologyCatagoriesMaster?.data?.map((category) => (
                  <option key={category?.id} value={category?.id}>
                    {category?.name}
                  </option>
                ))}
            </Select>
          </FormControl>
          {selectedRadiologyCategory && (
            <FormControl id="subcategory">
              <FormLabel>Radiology Sub Category</FormLabel>
              <ReactSelect
                defaultValue={[]}
                isMulti
                name="subcategories"
                options={dataLabSubCategoriesMaster?.data
                  ?.filter((category) => {
                    const alreadyCategory = dataCategories?.data?.map(
                      (category) => category.subcategory_id,
                    );
                    return !alreadyCategory?.includes(category.id);
                  })
                  ?.map((subcategory) => {
                    return {
                      label: subcategory?.name,
                      value: JSON.stringify({
                        category_id: subcategory?.radiology_category?.id,
                        category_name: subcategory?.radiology_category?.name,
                        subcategory_id: subcategory?.id,
                        subcategory_name: subcategory?.name,
                      }),
                    };
                  })}
                value={subCategories}
                onChange={setSubCategories}
                isLoading={isFetchingLabSubCategoriesMaster}
              />
            </FormControl>
          )}
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose} variant="ghost">
            Close
          </Button>
          <Button isLoading={isLoading} colorScheme="purple" onClick={onSubmit}>
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
