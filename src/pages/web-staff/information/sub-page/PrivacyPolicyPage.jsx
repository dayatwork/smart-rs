import React, { useState, useContext, useCallback } from 'react';
import {
  Box,
  FormControl,
  Heading,
  FormLabel,
  Select,
  Button,
  HStack,
  IconButton,
  useDisclosure,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  FormErrorMessage,
  Textarea,
  ModalFooter,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useCookies } from 'react-cookie';

import { AuthContext } from 'contexts/authContext';
import { getApplications } from 'api/application-services/application';

import { getInstitutions } from 'api/institution-services/institution';
import {
  getPrivacyPolicyList,
  createPrivacyPolicy,
  updatePrivacyPolicy,
} from 'api/application-services/privacy-policy';
import PaginationTable from 'components/shared/tables/PaginationTable';
import { BackButton } from 'components/shared/BackButton';
import { HiPencilAlt } from 'react-icons/hi';
import { useForm } from 'react-hook-form';

export const PrivacyPolicyPage = () => {
  const { employeeDetail, user } = useContext(AuthContext);
  const [cookies] = useCookies(['token']);
  const [selectedInstitution, setSelectedInstitution] = useState(
    employeeDetail?.institution_id || ''
  );
  const [selectedPrivacyPolicy, setSelectedPrivacyPolicy] = useState('');
  const {
    isOpen: isOpenCreate,
    onOpen: onOpenCreate,
    onClose: onCloseCreate,
  } = useDisclosure();
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();

  const { data: resInstitution, isSuccess: isSuccessInstitution } = useQuery(
    'institutions',
    () => getInstitutions(cookies),
    { staleTime: Infinity }
  );

  const {
    data: dataPrivacyPolicy,
    isSuccess: isSuccessPrivacyPolicy,
    isLoading: isLoadingPrivacyPolicy,
  } = useQuery(['privacy-policy'], () => getPrivacyPolicyList(cookies));

  const handleEdit = useCallback(
    privacyPolicyId => {
      const privacyPolicy = dataPrivacyPolicy?.data.find(
        privacyPolicy => privacyPolicy.id === privacyPolicyId
      );
      setSelectedPrivacyPolicy(privacyPolicy);
      onOpenEdit();
    },
    [dataPrivacyPolicy?.data, onOpenEdit]
  );

  const data = React.useMemo(
    () =>
      isSuccessPrivacyPolicy &&
      dataPrivacyPolicy?.data?.map(privacyPolicy => ({
        id: privacyPolicy.id,
        app_id: privacyPolicy.app_id,
        content: privacyPolicy.content,
        created_at: privacyPolicy.created_at,
        updated_at: privacyPolicy.updated_at,
      })),
    [isSuccessPrivacyPolicy, dataPrivacyPolicy?.data]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        Cell: ({ value }) => <Box>{value?.substring(0, 5)}...</Box>,
      },
      {
        Header: 'App ID',
        accessor: 'app_id',
      },
      {
        Header: 'Content',
        accessor: 'content',
      },

      {
        Header: 'Created At',
        accessor: 'created_at',
        Cell: ({ value }) => value && new Date(value).toLocaleString('id-ID'),
      },
      {
        Header: 'Updated At',
        accessor: 'updated_at',
        Cell: ({ value, row }) =>
          value
            ? new Date(value).toLocaleString('id-ID')
            : new Date(row.original.created_at).toLocaleString('id-ID'),
      },
      {
        Header: 'Action',
        // accessor: "userId",
        Cell: ({ row }) => (
          <HStack>
            <IconButton
              icon={<HiPencilAlt />}
              colorScheme="yellow"
              aria-label="Edit"
              onClick={() => handleEdit(row.original.id)}
            />
            {/* <IconButton
              icon={<HiTrash />}
              colorScheme="red"
              aria-label="Delete"
              onClick={() => {
                setSelectedFAQ(row.original.id);
                onOpenDelete();
              }}
            /> */}
          </HStack>
        ),
      },
    ],
    [handleEdit]
  );

  return (
    <Box>
      <BackButton to="/information" text="Back to Information" />
      <Heading
        mb={{ base: '3', '2xl': '6' }}
        fontSize={{ base: '2xl', '2xl': '3xl' }}
      >
        Privacy Policy
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
        <>
          <AddPrivacyPolicyModal
            isOpen={isOpenCreate}
            onClose={onCloseCreate}
          />
          <EditPrivacyPolicyDrawer
            isOpen={isOpenEdit}
            onClose={onCloseEdit}
            selectedPrivacyPolicy={selectedPrivacyPolicy}
          />
          <PaginationTable
            columns={columns}
            data={data || []}
            isLoading={isLoadingPrivacyPolicy}
            skeletonCols={6}
            action={
              <Button colorScheme="purple" onClick={onOpenCreate}>
                Create About Us
              </Button>
            }
          />
        </>
      )}
    </Box>
  );
};

const AddPrivacyPolicyModal = ({ isOpen, onClose }) => {
  const toast = useToast();
  const [, setErrMessage] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [cookies] = useCookies(['token']);
  const queryClient = useQueryClient();

  const { data: dataApp, isLoading: isLoadingApp } = useQuery(
    'master-application',
    () => getApplications(cookies),
    {
      staleTime: Infinity,
    }
  );

  const { mutate } = useMutation(createPrivacyPolicy(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries(['privacy-policy']);
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          position: 'top-right',
          title: 'Success',
          description: `Privacy Policy added successfully`,
          status: 'success',
          duration: 4000,
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

  const onSubmit = async values => {
    const data = {
      app_id: values.app_id,
      content: values.content,
    };

    await mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Privacy Policy</ModalHeader>
        <ModalBody>
          <Box>
            <FormControl
              id="app"
              mb="4"
              isInvalid={errors?.app_id ? true : false}
            >
              <FormLabel>App</FormLabel>
              <Select disabled={isLoadingApp} {...register('app_id')}>
                <option value="">Select App</option>
                {dataApp?.data?.map(app => (
                  <option key={app.id} value={app.id}>
                    {app.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>
                {errors.app_id && errors.app_id.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl id="content" mb="4">
              <FormLabel>Content</FormLabel>
              <Textarea rows={7} {...register('content')} />
              <FormErrorMessage>
                {errors.content && errors.content.message}
              </FormErrorMessage>
            </FormControl>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose} variant="ghost">
            Close
          </Button>
          <Button
            isLoading={isLoading}
            colorScheme="purple"
            onClick={handleSubmit(onSubmit)}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const EditPrivacyPolicyDrawer = ({
  isOpen,
  onClose,
  selectedPrivacyPolicy,
}) => {
  const toast = useToast();
  const [, setErrMessage] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [cookies] = useCookies(['token']);
  const queryClient = useQueryClient();

  const { data: dataApp, isLoading: isLoadingApp } = useQuery(
    'master-application',
    () => getApplications(cookies),
    {
      staleTime: Infinity,
    }
  );

  const { mutate } = useMutation(
    updatePrivacyPolicy(cookies, selectedPrivacyPolicy?.id),
    {
      onMutate: () => {
        setIsLoading(true);
      },
      onSettled: async (data, error) => {
        setIsLoading(false);
        onClose();
        if (data) {
          await queryClient.invalidateQueries(['privacy-policy']);
          setErrMessage('');
          reset();
          clearErrors();
          toast({
            position: 'top-right',
            title: 'Success',
            description: `Privacy Policy edited successfully`,
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
    }
  );

  const onSubmit = async values => {
    const data = {
      app_id: values.app_id,
      content: values.content,
    };

    await mutate(data);
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm" sele>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Edit Privacy Policy</DrawerHeader>

          <DrawerBody>
            <Box as="form" onSubmit={handleSubmit(onSubmit)}>
              <FormControl
                id="app"
                mb="4"
                isInvalid={errors?.app_id ? true : false}
              >
                <FormLabel>App</FormLabel>
                <Select
                  disabled={isLoadingApp}
                  defaultValue={selectedPrivacyPolicy?.app_id}
                  {...register('app_id')}
                >
                  <option value="">Select App</option>
                  {dataApp?.data?.map(app => (
                    <option key={app.id} value={app.id}>
                      {app.name}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>
                  {errors.app_id && errors.app_id.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl id="content" mb="4">
                <FormLabel>Content</FormLabel>
                <Textarea
                  rows={7}
                  defaultValue={selectedPrivacyPolicy?.content}
                  {...register('content')}
                />
                <FormErrorMessage>
                  {errors.content && errors.content.message}
                </FormErrorMessage>
              </FormControl>
            </Box>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              isLoading={isLoading}
              colorScheme="purple"
              onClick={handleSubmit(onSubmit)}
            >
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
