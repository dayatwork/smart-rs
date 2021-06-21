/* eslint-disable react/jsx-key */
import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
  Flex,
  Box,
  Skeleton,
  HStack,
  Button,
  Divider,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
} from '@chakra-ui/react';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

export const PrescriptionTable = ({
  columns,
  data,
  action,
  isLoading,
  skeletonCols,
  skeletonRows,
  ...props
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize,
    state,
    prepareRow,
  } = useTable({ columns, data }, useGlobalFilter, useSortBy, usePagination);

  const { pageIndex, pageSize } = state;

  return (
    <Box pb="20">
      <Flex
        justify="flex-end"
        direction={{ base: 'column', md: 'row' }}
        mb="4"
        align={{ base: 'end', md: 'center' }}>
        {/* <GlobalFilter
          mb={{ base: "3", md: "0" }}
          filter={globalFilter}
          setFilter={setGlobalFilter}
        /> */}
        <Box>{action}</Box>
      </Flex>
      <Box overflow="auto">
        <Table
          {...getTableProps()}
          variant="striped"
          boxShadow="sm"
          rounded="md"
          overflow="hidden"
          size="sm"
          {...props}>
          <Thead>
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <Th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    isNumeric={column.isNumeric}
                    bgColor="gray.200"
                    color="gray.700"
                    py="2">
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
          <Tbody {...getTableBodyProps()}>
            {isLoading && (
              <TableSkeleton cols={skeletonCols || 5} rows={skeletonRows || 3} />
            )}
            {page.map((row) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <Td
                      fontSize="md"
                      {...cell.getCellProps()}
                      isNumeric={cell.column.isNumeric}
                      maxW="md">
                      {cell.render('Cell')}
                    </Td>
                  ))}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
      {!isLoading && (
        <Flex justify="flex-end" mt="6" mr="1">
          <HStack spacing="2">
            <Box as="span">
              Page <strong>{pageIndex + 1}</strong> of{' '}
              <strong>{pageOptions.length}</strong>
            </Box>
            <Divider orientation="vertical" mx="2" />
            <Flex align="center">
              <Box as="span" mr="1">
                Go to page
              </Box>
              <NumberInput
                size="sm"
                w="20"
                value={pageIndex + 1}
                min={1}
                max={pageCount}
                onChange={(value) => {
                  const pageNumber = value ? Number(value) - 1 : 0;
                  gotoPage(pageNumber);
                }}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {/* <Input w="20" display="inline" type="number" size="sm" /> */}
            </Flex>
            <Select
              size="sm"
              w="28"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}>
              <option value={5}>Show 5</option>
              <option value={10}>Show 10</option>
              <option value={25}>Show 25</option>
              <option value={50}>Show 50</option>
            </Select>
            <Button
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
              size="sm">{`<<`}</Button>
            <Button
              leftIcon={<FaArrowLeft />}
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              size="sm">
              Previous
            </Button>
            <Button
              rightIcon={<FaArrowRight />}
              onClick={() => nextPage()}
              disabled={!canNextPage}
              size="sm">
              Next
            </Button>
            <Button
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
              size="sm">{`>>`}</Button>
          </HStack>
        </Flex>
      )}
    </Box>
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
