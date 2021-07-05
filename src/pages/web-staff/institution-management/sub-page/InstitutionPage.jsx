/* eslint-disable react/display-name */
import React, { useState } from 'react';
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
  Avatar,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';
import Lightbox from 'react-image-lightbox';

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
import { SuperAdminComponent } from '../../../../access-control';

export const InstitutionPage = () => {
  return (
    <Box>
      <BackButton
        to="/institution-management"
        text="Back to Institution Management List"
      />
      <Heading
        mb={{ base: '3', '2xl': '6' }}
        fontSize={{ base: '2xl', '2xl': '3xl' }}
      >
        Institution
      </Heading>
      <Tabs size="lg" colorScheme="purple">
        <TabList>
          <SuperAdminComponent>
            <>
              <Tab fontSize="2xl" fontWeight="semibold">
                Institution Type
              </Tab>
              <Tab fontSize="2xl" fontWeight="semibold">
                Institution
              </Tab>
            </>
          </SuperAdminComponent>
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
  const [isOpenLogo, setIsOpenLogo] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState('');

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
        Cell: ({ value }) => (
          <Avatar
            src={value && `http://local-dev.ejemplo.me/smartrs/${value}`}
            onClick={() => {
              setSelectedLogo(value);
              setIsOpenLogo(true);
            }}
            cursor="pointer"
          />
        ),
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

  console.log({ selectedLogo });
  console.log({ isOpenLogo });

  return (
    <Box>
      {isFetching && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}

      <AddInstitutionModal isOpen={isModalOpen} onClose={onModalClose} />
      {isOpenLogo && selectedLogo && (
        <Lightbox
          mainSrc={`http://local-dev.ejemplo.me/smartrs/${selectedLogo}`}
          onCloseRequest={() => setIsOpenLogo(false)}
        />
      )}
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
