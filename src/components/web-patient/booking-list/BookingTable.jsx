/* eslint-disable react/jsx-key */
import * as React from 'react';
import {
  chakra,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Skeleton,
  HStack,
  FormControl,
  InputGroup,
  FormLabel,
  InputLeftElement,
  Input,
  Box,
  VStack,
  Icon,
  Text,
} from '@chakra-ui/react';
import { useTable, useSortBy, useGlobalFilter } from 'react-table';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { BsSearch } from 'react-icons/bs';
import { ImFileEmpty } from 'react-icons/im';

export const BookingTable = ({
  columns,
  data,
  isLoading,
  skeletonCols,
  skeletonRows,
  noFilter,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable({ columns, data }, useGlobalFilter, useSortBy);

  const { globalFilter } = state;

  if (!isLoading && !data.length) {
    return (
      <Box pb="20" overflow="hidden">
        <VStack py="20">
          <Icon as={ImFileEmpty} h={10} w={10} color="blue.600" />
          <Text color="blue.600" fontWeight="semibold">
            Belum ada history pemeriksaan
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <>
      {!noFilter && (
        <Stack
          spacing="4"
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
        >
          <HStack>
            <FormControl minW={{ md: '320px' }} id="search">
              <InputGroup size="sm" bg="white">
                <FormLabel srOnly>Filter by name or email</FormLabel>
                <InputLeftElement pointerEvents="none" color="gray.400">
                  <BsSearch />
                </InputLeftElement>
                <Input
                  rounded="base"
                  type="search"
                  placeholder="Filter by doctor name..."
                  value={globalFilter || ''}
                  onChange={e => setGlobalFilter(e.target.value)}
                />
              </InputGroup>
            </FormControl>
          </HStack>
        </Stack>
      )}

      <Box overflowX="auto">
        <Table
          {...getTableProps()}
          my="4"
          borderWidth="1px"
          fontSize="sm"
          boxShadow="sm"
        >
          <Thead bg="gray.50">
            {headerGroups.map(headerGroup => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <Th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    isNumeric={column.isNumeric}
                    whiteSpace="nowrap"
                    scope="col"
                  >
                    {column.render('Header')}
                    <chakra.span pl="4">
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <TriangleDownIcon aria-label="sorted descending" />
                        ) : (
                          <TriangleUpIcon aria-label="sorted ascending" />
                        )
                      ) : null}
                    </chakra.span>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody bg="white" {...getTableBodyProps()}>
            {isLoading && (
              <TableSkeleton
                cols={skeletonCols || 5}
                rows={skeletonRows || 3}
              />
            )}
            {rows.map(row => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <Td
                      fontSize="md"
                      {...cell.getCellProps()}
                      isNumeric={cell.column.isNumeric}
                      maxW="md"
                    >
                      {cell.render('Cell')}
                    </Td>
                  ))}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
    </>
  );
};

const TableSkeleton = ({ cols, rows }) => {
  return Array.from(Array(rows).keys()).map((_, indexRow) => (
    <Tr key={indexRow}>
      {Array.from(Array(cols).keys()).map((_, indexCol) => (
        <Td key={indexCol}>
          <Skeleton height="40px" />
        </Td>
      ))}
    </Tr>
  ));
};
