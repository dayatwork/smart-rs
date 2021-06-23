/* eslint-disable react/display-name */
import React from 'react';
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
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';

import {
  getInstitutionTypes,
  getInstitutions,
} from '../../../../api/institution-services/institution';
import PaginationTable from '../../../../components/shared/tables/PaginationTable';
import {
  AddInstitutionModal,
  AddInstitutionTypeModal,
} from '../../../../components/web-staff/institution-management/institution';
import { BackButton } from '../../../../components/shared/BackButton';

export const InstitutionPage = () => {
  return (
    <Box>
      <BackButton
        to="/institution-management"
        text="Back to Institution Management List"
      />
      <Heading mb="6" fontSize="3xl">
        Institution
      </Heading>
      <Tabs size="lg" colorScheme="purple">
        <TabList>
          <Tab fontSize="2xl" fontWeight="semibold">
            Institution Type
          </Tab>
          <Tab fontSize="2xl" fontWeight="semibold">
            Institution
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <InstitutionType />
          </TabPanel>
          <TabPanel>
            <Institution />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

// ================================
// ===== Institution Type =========
// ================================
const InstitutionType = () => {
  const [cookies] = useCookies(['token']);

  const {
    onOpen: onModalOpen,
    isOpen: isModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const {
    data: res,
    isSuccess,
    isLoading,
    isFetching,
  } = useQuery('institution-types', () => getInstitutionTypes(cookies), {
    staleTime: Infinity,
  });

  const data = React.useMemo(
    () =>
      isSuccess &&
      res?.data?.map(type => {
        return {
          id: type.id,
          name: type.name,
          alias: type.alias,
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
        Header: 'Alias',
        accessor: 'alias',
        Cell: ({ value }) => (value ? value : '-'),
      },
    ],
    []
  );

  return (
    <Box>
      {isFetching && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}

      <AddInstitutionTypeModal isOpen={isModalOpen} onClose={onModalClose} />

      <PaginationTable
        columns={columns}
        data={data || []}
        isLoading={isLoading}
        skeletonCols={3}
        action={
          <Button onClick={onModalOpen} colorScheme="purple">
            Add New Institution Type
          </Button>
        }
      />
    </Box>
  );
};

// ================================
// ========= Institution ==========
// ================================
const Institution = () => {
  const [cookies] = useCookies(['token']);

  const {
    onOpen: onModalOpen,
    isOpen: isModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const {
    data: res,
    isSuccess,
    isLoading,
    isFetching,
  } = useQuery('institutions', () => getInstitutions(cookies), {
    staleTime: Infinity,
  });

  const data = React.useMemo(
    () =>
      isSuccess &&
      res?.data?.map(institution => {
        return {
          id: institution.id,
          name: institution.name,
          logo: institution.logo,
          email: institution.email,
          phone_number: institution.phone_number,
        };
      }),
    [res?.data, isSuccess]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        Cell: ({ value }) => <Box>{value?.substring(0, 5)}</Box>,
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Logo',
        accessor: 'logo',
        // Cell: ({ value }) => <Image src={value} />,
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Phone',
        accessor: 'phone_number',
      },
      // {
      //   Header: "Institution Type",
      //   accessor: "type",
      //   Cell: ({ value }) => {
      //     const { data: resApp, isLoading } = useQuery(
      //       ["app", value],
      //       () => getApplicationById(cookies, value),
      //       { enabled: Boolean(value) }
      //     );
      //     if (isLoading) return <Skeleton height="40px" />;
      //     return resApp?.data?.name || "-";
      //   },
      // },
    ],
    []
  );

  return (
    <Box>
      {isFetching && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}

      <AddInstitutionModal isOpen={isModalOpen} onClose={onModalClose} />

      <PaginationTable
        columns={columns}
        data={data || []}
        isLoading={isLoading}
        skeletonCols={5}
        action={
          <Button onClick={onModalOpen} colorScheme="purple">
            Add New Institution
          </Button>
        }
      />
    </Box>
  );
};
