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
import { CreateCashierModal } from '../../../../components/web-staff/institution-management/cashier';
import { BackButton } from '../../../../components/shared/BackButton';
import { getCashiers } from '../../../../api/institution-services/cashier';
import { getInstitutions } from '../../../../api/institution-services/institution';

export const CashierPage = () => {
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
  } = useQuery('cashiers', () => getCashiers(cookies, selectedInstitution), {
    staleTime: Infinity,
    enabled: Boolean(selectedInstitution),
  });

  const handleEdit = useCallback(
    objectiveId => {
      const objective = res?.data.find(
        objective => objective.id === objectiveId
      );
      setSelectedCashier(objective);
      onDrawerOpen();
    },
    [onDrawerOpen, res?.data]
  );

  const data = React.useMemo(
    () =>
      isSuccess &&
      res?.data?.map(cashier => {
        return {
          id: cashier.id,
          name: cashier.name,
          code: cashier.code,
          description: cashier.description,
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
        Header: 'Code',
        accessor: 'code',
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Description',
        accessor: 'description',
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
    <>
      {isFetching && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}
      <Box>
        <CreateCashierModal
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
          Cashier
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
                Add New Cashier
              </Button>
            }
          />
        )}
      </Box>
    </>
  );
};
