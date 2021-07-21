/* eslint-disable react/display-name */
import React, { useState, useContext, useCallback } from 'react';
import {
  Box,
  FormControl,
  Heading,
  FormLabel,
  Select,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
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
  Input,
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
import { getInstitutions } from 'api/institution-services/institution';
import {
  getFAQCategoryList,
  getFAQList,
  createFAQ,
  createFAQCategory,
  updateFAQ,
  updateFAQCategory,
} from 'api/application-services/faq';
import PaginationTable from 'components/shared/tables/PaginationTable';
import { BackButton } from 'components/shared/BackButton';
import { HiPencilAlt } from 'react-icons/hi';
import { useForm } from 'react-hook-form';

export const FAQPage = () => {
  const { employeeDetail, user } = useContext(AuthContext);
  const [cookies] = useCookies(['token']);
  const [selectedInstitution, setSelectedInstitution] = useState(
    employeeDetail?.institution_id || ''
  );

  const { data: resInstitution, isSuccess: isSuccessInstitution } = useQuery(
    'institutions',
    () => getInstitutions(cookies),
    { staleTime: Infinity }
  );

  return (
    <Box>
      <BackButton to="/information" text="Back to Information" />
      <Heading
        mb={{ base: '3', '2xl': '6' }}
        fontSize={{ base: '2xl', '2xl': '3xl' }}
      >
        FAQ
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
        <Tabs size="lg" colorScheme="purple">
          <TabList>
            <Tab fontSize="2xl" fontWeight="semibold">
              FAQ
            </Tab>

            <Tab fontSize="2xl" fontWeight="semibold">
              Category
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <FAQList cookies={cookies} />
            </TabPanel>
            <TabPanel>
              <FAQCategoryList cookies={cookies} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}
    </Box>
  );
};

const FAQList = ({ cookies }) => {
  const [selectedFAQ, setSelectedFAQ] = useState('');
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
  // const {
  //   isOpen: isOpenDelete,
  //   onOpen: onOpenDelete,
  //   onClose: onCloseDelete,
  // } = useDisclosure();

  const {
    data: dataFAQ,
    isSuccess: isSuccessFAQ,
    isLoading: isLoadingFAQ,
  } = useQuery(['faq'], () => getFAQList(cookies));

  console.log({ dataFAQ });

  const handleEdit = useCallback(
    faqId => {
      const faq = dataFAQ?.data.find(faq => faq.id === faqId);
      setSelectedFAQ(faq);
      onOpenEdit();
    },
    [dataFAQ?.data, onOpenEdit]
  );

  const data = React.useMemo(
    () =>
      isSuccessFAQ &&
      dataFAQ?.data?.map(faq => ({
        id: faq.id,
        category_id: faq.category_id,
        question: faq.question,
        answer: faq.answer,
        created_at: faq.created_at,
        updated_at: faq.updated_at,
      })),
    [isSuccessFAQ, dataFAQ?.data]
  );

  // console.log({ dataDrugs });

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        Cell: ({ value }) => <Box>{value?.substring(0, 5)}...</Box>,
      },
      {
        Header: 'Category ID',
        accessor: 'category_id',
      },
      {
        Header: 'Question',
        accessor: 'question',
      },
      {
        Header: 'Answer',
        accessor: 'answer',
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
    <>
      <AddFAQModal isOpen={isOpenCreate} onClose={onCloseCreate} />
      <EditFAQDrawer
        isOpen={isOpenEdit}
        onClose={onCloseEdit}
        selectedFAQ={selectedFAQ}
      />
      <PaginationTable
        columns={columns}
        data={data || []}
        isLoading={isLoadingFAQ}
        skeletonCols={7}
        action={
          <Button colorScheme="purple" onClick={onOpenCreate}>
            Add New FAQ
          </Button>
        }
      />
    </>
  );
};

const AddFAQModal = ({ isOpen, onClose }) => {
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

  const { data: dataFAQCategory, isLoading: isLoadingFAQCategory } = useQuery(
    ['faq-category'],
    () => getFAQCategoryList(cookies)
  );

  const { mutate } = useMutation(createFAQ(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries(['faq']);
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          position: 'top-right',
          title: 'Success',
          description: `FAQ added successfully`,
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
    console.log({ values });
    const data = {
      category_id: values.category_id,
      question: values.question,
      answer: values.answer,
    };

    await mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New FAQ</ModalHeader>
        <ModalBody>
          <Box>
            <FormControl
              id="category"
              mb="4"
              isInvalid={errors?.category_id ? true : false}
            >
              <FormLabel>Category</FormLabel>
              <Select
                disabled={isLoadingFAQCategory}
                {...register('category_id')}
              >
                <option value="">Select Category</option>
                {dataFAQCategory?.data?.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>
                {errors.category_id && errors.category_id.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl id="question" mb="4">
              <FormLabel>Question</FormLabel>
              <Textarea {...register('question')} />
              <FormErrorMessage>
                {errors.question && errors.question.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl id="answer" mb="4">
              <FormLabel>Answer</FormLabel>
              <Textarea rows={5} {...register('answer')} />
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

const EditFAQDrawer = ({ isOpen, onClose, selectedFAQ }) => {
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

  const { mutate } = useMutation(updateFAQ(cookies, selectedFAQ?.id), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries(['faq']);
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          position: 'top-right',
          title: 'Success',
          description: `FAQ edited successfully`,
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

  const onSubmit = async values => {
    const data = {
      question: values.question,
      answer: values.answer,
    };

    await mutate(data);
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm" sele>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Edit FAQ</DrawerHeader>

          <DrawerBody>
            <Box as="form" onSubmit={handleSubmit(onSubmit)}>
              <FormControl
                id="question"
                mb="4"
                isInvalid={errors?.question ? true : false}
              >
                <FormLabel>Question</FormLabel>
                <Textarea
                  placeholder="Question"
                  defaultValue={selectedFAQ?.question}
                  {...register('question')}
                />
                <FormErrorMessage>
                  {errors.question && errors.question.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl id="answer" mb="4">
                <FormLabel>Answer</FormLabel>
                <Textarea
                  placeholder="Answer"
                  rows={5}
                  defaultValue={selectedFAQ?.answer}
                  {...register('answer')}
                />
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
// ======================================
// ============== CATEGORY ==============
// ======================================

const FAQCategoryList = ({ cookies }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
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
  // const {
  //   isOpen: isOpenDelete,
  //   onOpen: onOpenDelete,
  //   onClose: onCloseDelete,
  // } = useDisclosure();

  const {
    data: dataFAQCategory,
    isSuccess: isSuccessFAQCategory,
    isLoading: isLoadingFAQCategory,
  } = useQuery(['faq-category'], () => getFAQCategoryList(cookies));

  console.log({ dataFAQCategory });

  const handleEdit = useCallback(
    categoryId => {
      const category = dataFAQCategory?.data.find(
        category => category.id === categoryId
      );
      setSelectedCategory(category);
      onOpenEdit();
    },
    [dataFAQCategory?.data, onOpenEdit]
  );

  const data = React.useMemo(
    () =>
      isSuccessFAQCategory &&
      dataFAQCategory?.data?.map(category => ({
        id: category.id,
        name: category.name,
        created_at: category.created_at,
        updated_at: category.updated_at,
      })),
    [dataFAQCategory, isSuccessFAQCategory]
  );

  // console.log({ dataDrugs });

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Name',
        accessor: 'name',
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
                setSelectedCategory(row.original.id);
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
    <>
      <AddFAQCategoryModal isOpen={isOpenCreate} onClose={onCloseCreate} />
      <EditFAQCategoryDrawer
        isOpen={isOpenEdit}
        onClose={onCloseEdit}
        selectedCategory={selectedCategory}
      />
      <PaginationTable
        columns={columns}
        data={data || []}
        isLoading={isLoadingFAQCategory}
        skeletonCols={5}
        action={
          <Button colorScheme="purple" onClick={onOpenCreate}>
            Add New Category
          </Button>
        }
      />
    </>
  );
};

const AddFAQCategoryModal = ({ isOpen, onClose }) => {
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

  const { mutate } = useMutation(createFAQCategory(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries(['faq-category']);
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          position: 'top-right',
          title: 'Success',
          description: `New FAQ Category added successfully`,
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
      name: values.name,
    };

    await mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Category</ModalHeader>
        <ModalBody>
          <Box>
            <FormControl id="name" mb="4">
              <FormLabel>Category Name</FormLabel>
              <Input {...register('name')} />
              <FormErrorMessage>
                {errors.name && errors.name.message}
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

const EditFAQCategoryDrawer = ({ isOpen, onClose, selectedCategory }) => {
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

  const { mutate } = useMutation(
    updateFAQCategory(cookies, selectedCategory?.id),
    {
      onMutate: () => {
        setIsLoading(true);
      },
      onSettled: async (data, error) => {
        setIsLoading(false);
        onClose();
        if (data) {
          await queryClient.invalidateQueries(['faq-category']);
          setErrMessage('');
          reset();
          clearErrors();
          toast({
            position: 'top-right',
            title: 'Success',
            description: `Category edited successfully`,
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
      name: values.name,
    };

    await mutate(data);
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Edit Category</DrawerHeader>

          <DrawerBody>
            <Box as="form" onSubmit={handleSubmit(onSubmit)}>
              <FormControl
                id="name"
                mb="4"
                isInvalid={errors?.name ? true : false}
              >
                <FormLabel>Category Name</FormLabel>
                <Input
                  placeholder="Category Name"
                  defaultValue={selectedCategory?.name}
                  {...register('name')}
                />
                <FormErrorMessage>
                  {errors.name && errors.name.message}
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
