/* eslint-disable react/display-name */
import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Heading,
  Spinner,
  useDisclosure,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  IconButton,
  HStack,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';
import { HiPencilAlt } from 'react-icons/hi';

import {
  getLaboratoryCategories,
  getLaboratorySubCategories,
} from '../../../../api/master-data-services/laboratory-category';
import PaginationTable from '../../../../components/shared/tables/PaginationTable';
import {
  AddLaboratoryCategoryModal,
  EditLaboratoryCategoryDrawer,
  AddLaboratorySubCategoryModal,
  EditLaboratorySubCategoryDrawer,
} from '../../../../components/web-staff/master/laboratory-category';
import { BackButton } from '../../../../components/shared/BackButton';

export const LaboratoryCategoryPage = () => {
  return (
    <Box>
      <BackButton to="/master" text="Back to Master List" />
      <Heading
        mb={{ base: '3', '2xl': '6' }}
        fontSize={{ base: '2xl', '2xl': '3xl' }}
      >
        Laboratory
      </Heading>
      <Tabs size="lg" colorScheme="purple">
        <TabList>
          <Tab fontSize="2xl" fontWeight="semibold">
            Category
          </Tab>
          <Tab fontSize="2xl" fontWeight="semibold">
            Sub Category
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <LaboratoryCategory />
          </TabPanel>
          <TabPanel>
            <LaboratorySubCategory />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

// ================================
// ============ Category===========
// ================================
const LaboratoryCategory = () => {
  const [cookies] = useCookies(['token']);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const {
    onOpen: onModalOpen,
    isOpen: isModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const {
    onOpen: onDrawerOpen,
    isOpen: isDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  const {
    data: res,
    isSuccess,
    isLoading,
    isFetching,
  } = useQuery(
    'master-laboratory-categories',
    () => getLaboratoryCategories(cookies),
    {
      staleTime: Infinity,
    }
  );

  const handleEdit = useCallback(
    categoryId => {
      const category = res?.data.find(category => category.id === categoryId);
      setSelectedCategory(category);
      onDrawerOpen();
    },
    [onDrawerOpen, res?.data]
  );

  const data = React.useMemo(
    () =>
      isSuccess &&
      res?.data?.map(category => {
        return {
          id: category.id,
          name: category.name,
        };
      }),
    [res?.data, isSuccess]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        // Cell: ({ value }) => <Box>{value?.substring(0, 5)}...</Box>,
      },
      {
        Header: 'Name',
        accessor: 'name',
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Action',
        Cell: ({ row }) => (
          <HStack>
            <IconButton
              aria-label="Edit"
              colorScheme="blackAlpha"
              icon={<HiPencilAlt />}
              onClick={() => handleEdit(row.original.id)}
            />
          </HStack>
        ),
      },
    ],
    [handleEdit]
  );

  return (
    <Box>
      {isFetching && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}
      <AddLaboratoryCategoryModal isOpen={isModalOpen} onClose={onModalClose} />
      <EditLaboratoryCategoryDrawer
        isOpen={isDrawerOpen}
        onClose={onDrawerClose}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <PaginationTable
        columns={columns}
        data={data || []}
        isLoading={isLoading}
        skeletonCols={3}
        action={
          <Button onClick={onModalOpen} colorScheme="purple">
            Add New Laboratory Category
          </Button>
        }
      />
    </Box>
  );
};

// ================================
// ==========Sub Category==========
// ================================
const LaboratorySubCategory = () => {
  const [cookies] = useCookies(['token']);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const {
    onOpen: onModalOpen,
    isOpen: isModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const {
    onOpen: onDrawerOpen,
    isOpen: isDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  const {
    data: res,
    isSuccess,
    isLoading,
    isFetching,
  } = useQuery(
    'master-laboratory-subcategories',
    () => getLaboratorySubCategories(cookies),
    { staleTime: Infinity }
  );

  const handleEdit = useCallback(
    subCategoryId => {
      const subCategory = res?.data.find(
        subCategory => subCategory.id === subCategoryId
      );
      setSelectedSubCategory(subCategory);
      onDrawerOpen();
    },
    [onDrawerOpen, res?.data]
  );

  const data = React.useMemo(
    () =>
      isSuccess &&
      res?.data?.map(subCategory => {
        return {
          id: subCategory?.id,
          name: subCategory?.name,
          unit: subCategory?.unit,
          range: subCategory?.range,
          laboratory_category_id: subCategory?.laboratory_category_id,
          laboratory_category_name: subCategory?.laboratory_category?.name,
        };
      }),
    [res?.data, isSuccess]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        // Cell: ({ value }) => <Box>{value?.substring(0, 5)}...</Box>,
      },
      {
        Header: 'Name',
        accessor: 'name',
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
        Header: 'Category',
        accessor: 'laboratory_category_name',
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Action',
        Cell: ({ row }) => (
          <HStack>
            <IconButton
              aria-label="Edit"
              colorScheme="blackAlpha"
              icon={<HiPencilAlt />}
              onClick={() => handleEdit(row.original.id)}
            />
          </HStack>
        ),
      },
    ],
    [handleEdit]
  );

  return (
    <Box>
      {isFetching && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}
      <AddLaboratorySubCategoryModal
        isOpen={isModalOpen}
        onClose={onModalClose}
      />
      <EditLaboratorySubCategoryDrawer
        isOpen={isDrawerOpen}
        onClose={onDrawerClose}
        selectedSubCategory={selectedSubCategory}
        setSelectedSubCategory={setSelectedSubCategory}
      />
      <PaginationTable
        columns={columns}
        data={data || []}
        isLoading={isLoading}
        skeletonCols={6}
        action={
          <Button onClick={onModalOpen} colorScheme="purple">
            Add New Laboratory Sub Category
          </Button>
        }
      />
    </Box>
  );
};
