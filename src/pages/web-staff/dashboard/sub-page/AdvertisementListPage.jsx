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

import {
  getAdvertisements,
  deleteAdvertisement,
} from 'api/institution-services/advertisement';
import { AppShell } from 'components/web-staff/shared/app-shell';
import { ContentWrapper } from 'components/web-staff/shared/sub-menu';
import { BackButton } from 'components/shared/BackButton';
import PaginationTable from 'components/shared/tables/PaginationTable';

const AdvertisementListPage = () => {
  const [cookies] = useCookies(['token']);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedAdvertisement, setSelectedAdvertisement] = useState(null);

  // console.log({ cookies });

  const {
    data: dataAdvertisement,
    isSuccess,
    isLoading,
  } = useQuery(['advertisement'], () => getAdvertisements(cookies));

  console.log({ dataAdvertisement });

  const data = React.useMemo(
    () =>
      isSuccess &&
      dataAdvertisement?.data?.map(advertisement => {
        return {
          id: advertisement?.id,
          title: advertisement?.title,
          start_date: advertisement?.start_date,
          end_date: advertisement?.end_date,
        };
      }),
    [dataAdvertisement?.data, isSuccess]
  );

  const columns = React.useMemo(
    () => [
      // {
      //   Header: 'ID',
      //   accessor: 'id',
      //   Cell: ({ value }) => <Box>{value?.substring(0, 5)}...</Box>,
      // },
      {
        Header: 'Title',
        accessor: 'title',
        Cell: ({ value }) => <Box width="full">{value}</Box>,
      },
      {
        Header: 'Start Date',
        accessor: 'start_date',
        Cell: ({ value }) => new Date(value).toLocaleDateString(),
      },
      {
        Header: 'End Date',
        accessor: 'end_date',
        Cell: ({ value }) => new Date(value).toLocaleDateString(),
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
              to={`/dashboard/advertisement/edit/${row.original.id}`}
            />
            <IconButton
              icon={<HiTrash />}
              colorScheme="red"
              aria-label="Delete"
              onClick={() => {
                setSelectedAdvertisement(row.original.id);
                onOpen();
              }}
            />
          </HStack>
        ),
      },
    ],
    [onOpen]
  );

  // console.log({ dataAdvertisement });

  return (
    <AppShell>
      <Helmet>
        <title>Advertisement | SMART-RS</title>
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
            <Heading fontSize={{ base: '2xl', '2xl': '3xl' }}>
              Advertisement List
            </Heading>
            <Button
              colorScheme="purple"
              as={Link}
              to="/dashboard/advertisement/create"
              leftIcon={<HiSpeakerphone />}
            >
              New Advertisement
            </Button>
          </Flex>
          <ContentWrapper bg="gray.50">
            <DeleteAdvertisementAlert
              isOpen={isOpen}
              onClose={onClose}
              selectedAdvertisement={selectedAdvertisement}
              cookies={cookies}
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
                isLoading={isLoading}
              />
            </Box>
          </ContentWrapper>
        </Flex>
      </Box>
    </AppShell>
  );
};

export default AdvertisementListPage;

const DeleteAdvertisementAlert = ({
  isOpen,
  onClose,
  selectedAdvertisement,
  cookies,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (!selectedAdvertisement) return;

    try {
      setIsLoading(true);
      await deleteAdvertisement(cookies, selectedAdvertisement);
      // console.log({ res });
      await queryClient.invalidateQueries(['advertisement']);
      setIsLoading(false);
      toast({
        position: 'top-right',
        title: 'Success',
        description: `Advertisement deleted successfully`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      setIsLoading(false);
      toast({
        position: 'top-right',
        title: 'Error',
        description: `Error, Cannot delete advertisement`,
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
        <AlertDialogHeader>Delete Advertisement</AlertDialogHeader>
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
