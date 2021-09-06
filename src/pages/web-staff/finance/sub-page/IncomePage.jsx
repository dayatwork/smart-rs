/* eslint-disable react/display-name */
import React, { useState, useCallback, useContext } from 'react';
import {
  Box,
  Button,
  Heading,
  HStack,
  IconButton,
  Spinner,
  useDisclosure,
  FormControl,
  FormLabel,
  Select,
} from '@chakra-ui/react';
import { HiPencilAlt } from 'react-icons/hi';
import { useCookies } from 'react-cookie';
import { useQuery } from 'react-query';

import { AuthContext } from '../../../../contexts/authContext';
import PaginationTable from '../../../../components/shared/tables/PaginationTable';
// import {
//   AddSoapObjectiveModal,
//   EditSoapObjectiveDrawer,
// } from '../../../../components/web-staff/master/soap-objective';
import { CreateNewIncomeModal } from '../../../../components/web-staff/finance/income';
import { getIncomeList } from '../../../../api/finance-services/income';
import { BackButton } from '../../../../components/shared/BackButton';
import { getInstitutions } from '../../../../api/institution-services/institution';

export const IncomePage = () => {
  const [cookies] = useCookies(['token']);
  const { employeeDetail, user } = useContext(AuthContext);
  const [selectedInstitution, setSelectedInstitution] = useState(
    employeeDetail?.institution_id || ''
  );
  const [selectedCashier, setSelectedCashier] = useState(null);
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

  const { data: resInstitution, isSuccess: isSuccessInstitution } = useQuery(
    'institutions',
    () => getInstitutions(cookies),
    { staleTime: Infinity }
  );

  const {
    data: res,
    isSuccess,
    isLoading,
    isFetching,
  } = useQuery(
    'income-list',
    () => getIncomeList(cookies, selectedInstitution),
    {
      staleTime: 1000 * 60 * 10,
      enabled: Boolean(selectedInstitution),
    }
  );

  // const handleEdit = useCallback(
  //   objectiveId => {
  //     const objective = res?.data.find(
  //       objective => objective.id === objectiveId
  //     );
  //     setSelectedCashier(objective);
  //     onDrawerOpen();
  //   },
  //   [onDrawerOpen, res?.data]
  // );

  const data = React.useMemo(
    () =>
      isSuccess &&
      res?.data?.map(income => {
        return {
          id: income.id,
          type: income.type,
          date: income.date,
          currency: income.currency,
          total: income.total,
        };
      }),
    [res?.data, isSuccess]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        // isNumeric: true,
      },
      {
        Header: 'Type',
        accessor: 'type',
      },
      {
        Header: 'Date',
        accessor: 'date',
      },
      {
        Header: 'Currency',
        accessor: 'currency',
      },
      {
        Header: 'Total',
        accessor: 'total',
      },
      // {
      //   Header: 'Action',
      //   Cell: ({ row }) => (
      //     <HStack>
      //       <IconButton
      //         aria-label="Edit"
      //         colorScheme="blackAlpha"
      //         icon={<HiPencilAlt />}
      //         onClick={() => handleEdit(row.original.id)}
      //       />
      //     </HStack>
      //   ),
      // },
    ],
    []
  );

  return (
    <>
      {isFetching && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}
      <Box>
        <CreateNewIncomeModal
          isOpen={isModalOpen}
          onClose={onModalClose}
          selectedInstitution={selectedInstitution}
        />
        {/* <AddSoapObjectiveModal isOpen={isModalOpen} onClose={onModalClose} />
        
        <EditSoapObjectiveDrawer
          isOpen={isDrawerOpen}
          onClose={onDrawerClose}
          selectedCashier={selectedCashier}
          setSelectedCashier={setSelectedCashier}
        /> */}
        <BackButton to="/master" text="Back to Master List" />
        <Heading
          mb={{ base: '3', '2xl': '6' }}
          fontSize={{ base: '2xl', '2xl': '3xl' }}
        >
          Income
        </Heading>
        {user?.role?.alias === 'super-admin' && (
          <FormControl id="name" mb="4" maxW="xs">
            <FormLabel>Institution</FormLabel>
            <Select
              name="institution"
              value={selectedInstitution}
              onChange={e => setSelectedInstitution(e.target.value)}
            >
              <option value="">Select Institution</option>
              {isSuccessInstitution &&
                resInstitution?.data?.map(institution => (
                  <option key={institution.id} value={institution.id}>
                    {institution.name}
                  </option>
                ))}
            </Select>
          </FormControl>
        )}
        {selectedInstitution && (
          <PaginationTable
            columns={columns}
            data={data || []}
            skeletonCols={5}
            isLoading={isLoading}
            action={
              <Button onClick={onModalOpen} colorScheme="purple">
                Add New Income
              </Button>
            }
          />
        )}
      </Box>
    </>
  );
};
