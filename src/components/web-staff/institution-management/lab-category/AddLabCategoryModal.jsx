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
  getLaboratorySubCategories,
  getLaboratoryCategories,
} from '../../../../api/master-data-services/laboratory-category';
import {
  getLabCategories,
  createLabCategory,
} from '../../../../api/institution-services/lab-category';

export const AddLabCategoryModal = ({ isOpen, onClose, selectedInstitution }) => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [isLoading, setIsLoading] = useState(false);
  const [, setErrMessage] = useState('');
  const [selectedLabCategory, setSelectedLabCategory] = useState('');
  const [subCategories, setSubCategories] = useState([]);
  const queryClient = useQueryClient();

  const { data: dataLabCatagories, isSuccess: isSuccessLabCatagories } = useQuery(
    'master-laboratory-categories',
    () => getLaboratoryCategories(cookies),
    { staleTime: Infinity },
  );

  const { data: dataLabSubCategories, isFetching: isFetchingLabSubCategories } = useQuery(
    ['master-laboratory-subcategories', selectedLabCategory],
    () => getLaboratorySubCategories(cookies, selectedLabCategory),
    {
      enabled: Boolean(selectedLabCategory),
      staleTime: Infinity,
    },
  );

  const { data: dataCategories } = useQuery(
    ['insitution-lab-categories', selectedInstitution],
    () => getLabCategories(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution), staleTime: Infinity },
  );

  const { mutate } = useMutation(createLabCategory(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries([
          'insitution-lab-categories',
          selectedInstitution,
        ]);
        setErrMessage('');
        setSelectedLabCategory('');
        setSubCategories([]);
        toast({
          title: 'Success',
          description: `Lab category added successfully`,
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
        <ModalHeader>Add Lab Category</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="category" mb="6">
            <FormLabel>Lab Category</FormLabel>
            <Select
              name="labCategory"
              value={selectedLabCategory}
              onChange={(e) => setSelectedLabCategory(e.target.value)}>
              <option value="">Select Lab Category</option>
              {isSuccessLabCatagories &&
                dataLabCatagories?.data?.map((category) => (
                  <option key={category?.id} value={category?.id}>
                    {category?.name}
                  </option>
                ))}
            </Select>
          </FormControl>
          {selectedLabCategory && (
            <FormControl id="subcategory">
              <FormLabel>Lab Sub Category</FormLabel>
              <ReactSelect
                defaultValue={[]}
                isMulti
                name="subcategories"
                options={dataLabSubCategories?.data
                  ?.filter((category) => {
                    const alreadyCategory = dataCategories?.data?.map(
                      (category) => category.subcategory_id,
                    );
                    return !alreadyCategory?.includes(category.id);
                  })
                  ?.map((subcategory) => ({
                    label: subcategory?.name,
                    value: JSON.stringify({
                      category_id: subcategory?.laboratory_category?.id,
                      category_name: subcategory?.laboratory_category?.name,
                      subcategory_id: subcategory?.id,
                      subcategory_name: subcategory?.name,
                      unit: subcategory?.unit,
                      range: subcategory?.range,
                    }),
                  }))}
                value={subCategories}
                onChange={setSubCategories}
                isLoading={isFetchingLabSubCategories}
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
