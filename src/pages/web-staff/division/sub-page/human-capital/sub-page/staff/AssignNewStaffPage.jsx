/* eslint-disable react/display-name */
import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Select,
  Button,
  Input,
  useToast,
  FormHelperText,
  Thead,
  Table,
  Th,
  Tr,
  Tbody,
  Td,
} from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useCookies } from 'react-cookie';
import { useForm } from 'react-hook-form';
import CreatableSelect from 'react-select/creatable';
import { HiSearch } from 'react-icons/hi';

import { AuthContext } from '../../../../../../../contexts/authContext';
import { getInstitutions } from '../../../../../../../api/institution-services/institution';
import { getFMS } from '../../../../../../../api/institution-services/fms';
import { getInstitutionRoles } from '../../../../../../../api/institution-services/role';
import {
  checkRegisteredEmployee,
  assignStaff,
} from '../../../../../../../api/human-capital-services/employee';
import { BackButton } from '../../../../../../../components/shared/BackButton';

export const AssignNewStaffPage = () => {
  const { employeeDetail, user } = useContext(AuthContext);
  const history = useHistory();
  const [cookies] = useCookies(['token']);
  const [selectedInstitution, setSelectedInstitution] = useState(
    employeeDetail?.institution_id || ''
  );
  const [isLoadingAssign, setIsLoadingAssign] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [, setErrMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [identities, setIdentities] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm();
  const queryClient = useQueryClient();

  // ==============================
  // ========== Select ============
  // ==============================
  const components = {
    DropdownIndicator: null,
  };

  const createOption = label => ({
    label,
    value: label,
  });

  const handleChange = (value, actionMeta) => {
    setIdentities(value);
  };

  const handleInputChange = inputValue => {
    setInputValue(inputValue);
  };

  const handleKeyDown = e => {
    if (!inputValue) return;
    switch (e.key) {
      case 'Enter':
      case 'Tab':
        setInputValue('');
        setIdentities(prev => [...prev, createOption(inputValue)]);
        e.preventDefault();
        break;
      default:
    }
  };

  const handleBlur = e => {
    if (!inputValue) return;
    setIdentities(prev => [...prev, createOption(inputValue)]);
  };

  const onSubmit = async () => {
    const data = {
      identity: identities.map(identity => identity.value),
    };

    try {
      if (data.identity.length) {
        setIsLoadingSearch(true);
        const res = await checkRegisteredEmployee(cookies, data);
        setIsLoadingSearch(false);
        setUsers(res.data);
      }
    } catch (error) {
      setIsLoadingSearch(false);
    }
  };
  // ==============================
  // ======== End Select ==========
  // ==============================

  const { data: resInstitution, isSuccess: isSuccessInstitution } = useQuery(
    'institutions',
    () => getInstitutions(cookies),
    { staleTime: Infinity }
  );

  const { data: resRole } = useQuery(
    'institution-roles',
    () => getInstitutionRoles(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution), staleTime: Infinity }
  );

  const { data: resFMS } = useQuery(
    ['fms', selectedInstitution],
    () => getFMS(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution), staleTime: Infinity }
  );

  const { mutate } = useMutation(assignStaff(cookies), {
    onMutate: () => {
      setIsLoadingAssign(true);
    },
    onSettled: async (data, error) => {
      setIsLoadingAssign(false);
      if (data) {
        await queryClient.invalidateQueries(['employees', selectedInstitution]);
        setErrMessage('');
        clearErrors();
        toast({
          title: 'Success',
          description: `Assign staff success`,
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
        reset();
        setUsers([]);
        setIdentities([]);
        setInputValue('');
        history.push('/division/human-capital/staff');
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

  const onSubmitAssign = async values => {
    const { data } = values;
    const filteredData = data.filter(user => user.status === 'Registered');
    const assignUser = filteredData.map(user => ({
      user_id: user.user_id,
      role_id: JSON.parse(user.profession).id,
      profession: JSON.parse(user.profession).name,
      master_role_id: JSON.parse(user.profession).master_role_id,
      functional_medical_staff_id: user.fms,
      status: 'active',
    }));

    await mutate({
      institution_id: selectedInstitution,
      data: assignUser,
    });
  };

  return (
    <Box>
      <BackButton
        to="/division/human-capital/staff"
        text="Back to Staff List"
      />
      <Heading mb="6" fontSize="3xl">
        Assign New Staff
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
        <Box>
          <Flex align="center" mb="10">
            <FormControl id="identities" mb="2">
              <FormLabel>Search</FormLabel>
              {/* <Input name="allergies" ref={register} /> */}
              <CreatableSelect
                components={components}
                inputValue={inputValue}
                isClearable
                isMulti
                menuIsOpen={false}
                onChange={handleChange}
                onInputChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Tab atau Enter untuk tambah email / identity"
                value={identities}
                onBlur={handleBlur}
              />
              <FormHelperText>
                Tekan tab atau enter untuk tambah email / identity
              </FormHelperText>
            </FormControl>
            <Button
              pr="6"
              leftIcon={<HiSearch />}
              colorScheme="purple"
              ml="2"
              mt="-1"
              onClick={onSubmit}
              isLoading={isLoadingSearch}
            >
              Search
            </Button>
          </Flex>

          {users.length ? (
            <>
              <Heading fontSize="xl" mb="2">
                Found User
              </Heading>
              <Table variant="simple" boxShadow="md">
                <Thead bg="gray.100">
                  <Tr>
                    <Th>User Id</Th>
                    <Th>Name</Th>
                    <Th>Identity</Th>
                    <Th>Role</Th>
                    <Th>SMF</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {users.map((user, index) => (
                    <Tr key={user.identity}>
                      <Td>
                        <Input
                          defaultValue={user.user_id}
                          readOnly
                          {...register(`data[${index}][user_id]`)}
                        />
                      </Td>
                      <Td>{user.name || '-'}</Td>
                      <Td>{user.identity}</Td>
                      <Td>
                        <>
                          <Select
                            disabled={
                              !user.user_id || user.status === 'Assigned'
                            }
                            {...register(`data[${index}][profession]`, {
                              required:
                                !user.user_id || user.status === 'Assigned'
                                  ? false
                                  : 'Profession is required',
                            })}
                            borderColor={
                              errors?.data && errors?.data[index]?.profession
                                ? 'red.500'
                                : null
                            }
                          >
                            <option value="">Pilih Profesi</option>
                            {resRole?.data.map(role => (
                              <option
                                value={JSON.stringify({
                                  id: role.id,
                                  name: role.name,
                                  master_role_id: role.master_role_id,
                                })}
                                key={role.id}
                              >
                                {role.name}
                              </option>
                            ))}
                          </Select>
                        </>
                      </Td>
                      <Td>
                        <>
                          <Select
                            disabled={
                              !user.user_id || user.status === 'Assigned'
                            }
                            {...register(`data[${index}][fms]`, {
                              required:
                                !user.user_id || user.status === 'Assigned'
                                  ? false
                                  : 'SMF is required',
                            })}
                            borderColor={
                              errors?.data && errors?.data[index]?.profession
                                ? 'red.500'
                                : null
                            }
                          >
                            <option value="">Pilih SMF</option>
                            {resFMS?.data.map(fms => (
                              <option key={fms.id} value={fms.id}>
                                {fms.name}
                              </option>
                            ))}
                          </Select>
                        </>
                      </Td>
                      <Td>
                        <Input
                          readOnly
                          defaultValue={user.status}
                          {...register(`data[${index}][status]`)}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              <Flex justify="flex-end" mt="4">
                <Button onClick={() => setUsers([])}>Cancel</Button>
                <Button
                  onClick={handleSubmit(onSubmitAssign)}
                  colorScheme="purple"
                  isLoading={isLoadingAssign}
                  ml="2"
                  disabled={
                    users.filter(user => user.status === 'Registered')
                      .length === 0
                  }
                >
                  Assign
                </Button>
              </Flex>
            </>
          ) : null}
        </Box>
      )}
    </Box>
  );
};
