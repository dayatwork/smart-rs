import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import { HiPencilAlt, HiSpeakerphone, HiTrash } from 'react-icons/hi';
import { useCookies } from 'react-cookie';
import { useQuery, useQueryClient } from 'react-query';

import { getFAQList, deleteFAQ } from 'api/application-services/faq';
import { AppShell } from 'components/web-staff/shared/app-shell';
import { ContentWrapper } from 'components/web-staff/shared/sub-menu';
import { BackButton } from 'components/shared/BackButton';
import PaginationTable from 'components/shared/tables/PaginationTable';

const FAQListPage = () => {
  const [cookies] = useCookies(['token']);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedFAQ, setSelectedFAQ] = useState(null);

  const {
    data: dataFAQ,
    isSuccess: isSuccessFAQ,
    isLoading: isLoadingFAQ,
  } = useQuery(['faq'], () => getFAQList(cookies));

  const data = React.useMemo(
    () =>
      isSuccessFAQ &&
      dataFAQ?.data?.map(faq => ({
        id: faq.id,
        category_id: faq.category_id,
        category_name: faq.category_name,
        question: faq.question,
        answer: faq.answer,
        // created_at: faq.created_at,
        // updated_at: faq.updated_at,
      })),
    [isSuccessFAQ, dataFAQ?.data]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'Category',
        accessor: 'category_name',
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
        Header: 'Action',
        // accessor: "userId",
        Cell: ({ row }) => (
          <HStack>
            <IconButton
              icon={<HiPencilAlt />}
              colorScheme="yellow"
              aria-label="Edit"
              as={Link}
              to={`/dashboard/faq/edit/${row.original.id}`}
            />
            <IconButton
              icon={<HiTrash />}
              colorScheme="red"
              aria-label="Delete"
              onClick={() => {
                setSelectedFAQ(row.original.id);
                onOpen();
              }}
            />
          </HStack>
        ),
      },
    ],
    [onOpen]
  );

  return (
    <AppShell>
      <Helmet>
        <title>FAQ | SMART-RS</title>
      </Helmet>
      <Box height="full" overflow="hidden" position="relative" w="full">
        <Flex h="full" direction="column">
          <Flex
            py="6"
            px="10"
            justify="space-between"
            // mb={{ base: '3', '2xl': '6' }}
            bg="white"
            boxShadow="lg"
          >
            <Heading fontSize={{ base: '2xl', '2xl': '3xl' }}>FAQ List</Heading>
            <Button
              colorScheme="purple"
              as={Link}
              to="/dashboard/faq/create"
              leftIcon={<HiSpeakerphone />}
            >
              New FAQ
            </Button>
          </Flex>
          <ContentWrapper bg="gray.50">
            <DeleteFAQAlert
              isOpen={isOpen}
              onClose={onClose}
              selectedFAQ={selectedFAQ}
              cookies={cookies}
              setSelectedFAQ={setSelectedFAQ}
            />
            <Flex
              justify="space-between"
              align="center"
              py="4"
              // maxW="7xl"
              // mx="auto"
            >
              <BackButton to="/dashboard" text="Back to Dashboard" />
            </Flex>
            <Box bg="white" px="6" py="8" boxShadow="md" rounded="md">
              <PaginationTable
                skeletonCols={4}
                columns={columns}
                data={data || []}
                isLoading={isLoadingFAQ}
              />
            </Box>
          </ContentWrapper>
        </Flex>
      </Box>
    </AppShell>
  );
};

export default FAQListPage;

const DeleteFAQAlert = ({
  isOpen,
  onClose,
  selectedFAQ,
  cookies,
  setSelectedFAQ,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (!selectedFAQ) return;

    try {
      setIsLoading(true);
      await deleteFAQ(cookies, selectedFAQ);
      await queryClient.invalidateQueries(['faq']);
      setIsLoading(false);
      toast({
        position: 'top-right',
        title: 'Success',
        description: `FAQ deleted successfully`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      setSelectedFAQ(null);
      onClose();
    } catch (error) {
      setIsLoading(false);
      toast({
        position: 'top-right',
        title: 'Error',
        description: `Error, Cannot delete FAQ`,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };
  return (
    <AlertDialog
      motionPreset="slideInBottom"
      onClose={onClose}
      isOpen={isOpen}
      isCentered
    >
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogHeader>Delete FAQ</AlertDialogHeader>
        <AlertDialogBody>
          Are you sure? You can't undo this action afterwards.
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button onClick={onClose}>No</Button>
          <Button
            colorScheme="red"
            ml={3}
            isLoading={isLoading}
            onClick={handleDelete}
          >
            Yes
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
