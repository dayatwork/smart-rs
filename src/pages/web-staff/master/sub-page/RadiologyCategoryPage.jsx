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
  Skeleton,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';
import { HiPencilAlt } from 'react-icons/hi';

import {
  getRadiologyCategories,
  getRadiologySubCategories,
  getRadiologySubCategoryById,
} from '../../../../api/master-data-services/radiology-category';
import PaginationTable from '../../../../components/shared/tables/PaginationTable';
import {
  AddRadiologyCategoryModal,
  EditRadiologyCategoryDrawer,
  AddRadiologySubCategoryModal,
  EditRadiologySubCategoryDrawer,
} from '../../../../components/web-staff/master/radiology-category';
import { BackButton } from '../../../../components/shared/BackButton';

export const RadiologyCategoryPage = () => {
  return (
    <Box>
      <BackButton to="/master" text="Back to Master List" />
      <Heading
        mb={{ base: '3', '2xl': '6' }}
        fontSize={{ base: '2xl', '2xl': '3xl' }}
      >
        Radiology
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
            <RadiologyCategory />
          </TabPanel>
          <TabPanel>
            <RadiologySubCategory />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

// ================================
// =========== Category============
// ================================
const RadiologyCategory = () => {
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
    'master-radiology-categories',
    () => getRadiologyCategories(cookies),
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

      <AddRadiologyCategoryModal isOpen={isModalOpen} onClose={onModalClose} />
      <EditRadiologyCategoryDrawer
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
            Add New Radiology Category
          </Button>
        }
      />
    </Box>
  );
};

// ================================
// ==========Sub Category==========
// ================================
const RadiologySubCategory = () => {
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
    'master-radiology-subcategories',
    () => getRadiologySubCategories(cookies),
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
          radiology_category_id: subCategory?.radiology_category_id,
          radiology_category_name: subCategory?.radiology_category?.name,
          parent_id: subCategory.parent_id,
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
        Header: 'Category',
        accessor: 'radiology_category_name',
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Parent',
        accessor: 'parent_id',
        // Cell: ({ value }) => (value ? value : "-"),
        Cell: ({ value }) => {
          const { data: res, isLoading } = useQuery(
            ['radiology-subcategories', value],
            () => getRadiologySubCategoryById(cookies, value),
            { enabled: Boolean(value), staleTime: 300000 }
          );
          if (isLoading) return <Skeleton height="40px" />;
          return res?.data?.name || '-';
        },
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
    [handleEdit, cookies]
  );

  return (
    <Box>
      {isFetching && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}

      <AddRadiologySubCategoryModal
        isOpen={isModalOpen}
        onClose={onModalClose}
      />
      <EditRadiologySubCategoryDrawer
        isOpen={isDrawerOpen}
        onClose={onDrawerClose}
        selectedSubCategory={selectedSubCategory}
        setSelectedSubCategory={setSelectedSubCategory}
      />

      <PaginationTable
        columns={columns}
        data={data || []}
        isLoading={isLoading}
        skeletonCols={5}
        action={
          <Button onClick={onModalOpen} colorScheme="purple">
            Add New Radiology Sub Category
          </Button>
        }
      />
    </Box>
  );
};
