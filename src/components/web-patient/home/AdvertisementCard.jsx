import {
  Box,
  Flex,
  Heading,
  Image,
  Link,
  LinkBox,
  LinkOverlay,
  Text,
} from '@chakra-ui/react';
import * as React from 'react';
import { BsClockFill } from 'react-icons/bs';

export const AdvertisementCard = ({
  title,
  href,
  description,
  media,
  author,
  category,
}) => {
  return (
    <LinkBox
      as="article"
      bg="white"
      shadow={{
        sm: 'base',
      }}
      rounded={{
        sm: 'md',
      }}
      overflow="hidden"
      transition="all 0.2s"
      _hover={{
        shadow: {
          sm: 'lg',
        },
      }}
    >
      <Flex direction="column">
        <Image
          height="44"
          objectFit="cover"
          alt={title}
          src={media}
          fallbackSrc="https://placekitten.com/640/360"
        />
        <Flex
          direction="column"
          px={{
            sm: '6',
          }}
          py="5"
        >
          <Text
            casing="uppercase"
            letterSpacing="wider"
            fontSize="xs"
            fontWeight="semibold"
            mb="2"
            color="gray.500"
          >
            {category}
          </Text>
          <Heading as="h3" size="sm" mb="2" lineHeight="base">
            <LinkOverlay href={href}>{title}</LinkOverlay>
          </Heading>
          <Text noOfLines={2} mb="8" color="gray.600">
            {description}
          </Text>
          <Flex
            align="baseline"
            justify="space-between"
            fontSize="sm"
            color="gray.600"
          >
            <Text>
              By{' '}
              <Box as="a" textDecor="underline" href={author.href}>
                {author.name}
              </Box>
            </Text>
            <Link href="#">
              <Box
                as={BsClockFill}
                display="inline-block"
                me="2"
                opacity={0.4}
              />
              3 min read
            </Link>
          </Flex>
        </Flex>
      </Flex>
    </LinkBox>
  );
};
