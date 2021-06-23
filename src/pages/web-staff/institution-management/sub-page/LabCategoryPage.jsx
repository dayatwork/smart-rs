/* eslint-disable react/display-name */
import React, { useState, useCallback, useContext } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Select,
  IconButton,
  useDisclosure,
  Spinner,
} from '@chakra-ui/react';
import { HiTrash } from 'react-icons/hi';
import { useCookies } from 'react-cookie';
import { useQuery } from 'react-query';

import { AuthContext } from '../../../../contexts/authContext';
import { getInstitutions } from '../../../../api/institution-services/institution';
import { getLabCategories } from '../../../../api/institution-services/lab-category';
import PaginationTable from '../../../../components/shared/tables/PaginationTable';
import {
  AddLabCategoryModal,
  DeleteLabCategoryAlert,
} from '../../../../components/web-staff/institution-management/lab-category';
import { BackButton } from '../../../../components/shared/BackButton';

export const LabCategoryPage = () => {
  const { employeeDetail, user } = useContext(AuthContext);
  const [cookies] = useCookies(['token']);
  const [selectedInstitution, setSelectedInstitution] = useState(
    employeeDetail?.institution_id || ''
  );
  const [selectedCategory, setSelectedCategory] = useState(null);
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const {
    onOpen: onModalOpen,
    isOpen: isModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const { data: dataInstitutions, isSuccess: isSuccessInstitutions } = useQuery(
    'institutions',
    () => getInstitutions(cookies),
    { staleTime: Infinity }
  );

  const {
    data: dataLabCategories,
    isSuccess: isSuccessLabCategories,
    isLoading: isLoadingLabCategories,
    isFetching: isFetchingLabCategories,
  } = useQuery(
    ['insitution-lab-categories', selectedInstitution],
    () => getLabCategories(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution), staleTime: Infinity }
  );

  const onDeleteClick = useCallback(
    id => {
      setSelectedCategory(id);
      onDeleteOpen();
    },
    [onDeleteOpen]
  );

  const data = React.useMemo(
    () =>
      isSuccessLabCategories &&
      dataLabCategories?.data?.map(category => ({
        id: category?.id,
        category_id: category?.category_id,
        category_name: category?.category_name,
        subcategory_id: category?.subcategory_id,
        subcategory_name: category?.subcategory_name,
        unit: category?.unit,
        range: category?.range,
      })),
    [dataLabCategories?.data, isSuccessLabCategories]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        // Cell: ({ value }) => <Box>{value?.substring(0, 5)}...</Box>,
      },
      {
        Header: 'Category',
        accessor: 'category_name',
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Sub Category',
        accessor: 'subcategory_name',
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Unit',
        accessor: 'unit',
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Range',
        accessor: 'range',
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Action',
        Cell: ({ row }) => (
          // <IconButton variant="link" colorScheme="purple">
          //   Details
          // </IconButton>
          <IconButton
            icon={<HiTrash />}
            colorScheme="red"
            onClick={() => onDeleteClick(row.original.id)}
          />
        ),
      },
    ],
    [onDeleteClick]
  );

  return (
    <Box>
      {isFetchingLabCategories && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}
      <AddLabCategoryModal
        isOpen={isModalOpen}
        onClose={onModalClose}
        selectedInstitution={selectedInstitution}
      />
      <DeleteLabCategoryAlert
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        selectedCategory={selectedCategory}
        selectedInstitution={selectedInstitution}
      />

      <BackButton
        to="/institution-management"
        text="Back to Institution Management List"
      />

      <Heading mb="6" fontSize="3xl">
        Lab Category
      </Heading>
      <Box>
        {user?.role?.alias === 'super-admin' && (
          <FormControl id="name" mb="4" maxW="xs">
            <FormLabel>Institution</FormLabel>
            <Select
              name="institution"
              value={selectedInstitution}
              onChange={e => setSelectedInstitution(e.target.value)}
            >
              <option value="">Select Institution</option>
              {isSuccessInstitutions &&
                dataInstitutions?.data?.map(institution => (
                  <option key={institution.id} value={institution.id}>
                    {institution.name}
                  </option>
                ))}
            </Select>
          </FormControl>
        )}
        {selectedInstitution && (
          <>
            <PaginationTable
              columns={columns}
              data={data || []}
              isLoading={isLoadingLabCategories}
              skeletonCols={6}
              action={
                <Button colorScheme="purple" onClick={onModalOpen}>
                  Add New Category
                </Button>
              }
            />
          </>
        )}
      </Box>
    </Box>
  );
};
