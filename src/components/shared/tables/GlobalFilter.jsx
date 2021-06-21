/* eslint-disable react/no-children-prop */
import React from 'react';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { HiOutlineSearch } from 'react-icons/hi';

export const GlobalFilter = ({ filter, setFilter, ...props }) => {
  return (
    <InputGroup maxW="md" mr="4" {...props}>
      <InputLeftElement
        pointerEvents="none"
        children={<HiOutlineSearch color="gray.300" />}
      />
      <Input
        type="tel"
        placeholder="Search"
        variant="filled"
        value={filter || ''}
        onChange={(e) => setFilter(e.target.value)}
      />
    </InputGroup>
  );
};
