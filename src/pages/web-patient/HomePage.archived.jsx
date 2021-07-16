import * as React from 'react';
// import { Link } from 'react-router-dom';
import {
  Box,
  Flex,
  Heading,
  SimpleGrid,
  Link as ChakraLink,
  Skeleton,
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useQuery } from 'react-query';

import { getAdvertisements } from 'api/institution-services/advertisement';
import { HomeHero, AdvertisementCard } from 'components/web-patient/home';
import { WebPatientNav, Wrapper } from 'components/web-patient/shared';
import { AuthContext } from 'contexts/authContext';
import { BsArrowRight } from 'react-icons/bs';

const HomePage = () => {
  const { user } = React.useContext(AuthContext);
  const [cookies] = useCookies(['token']);

  const { data: dataAdvertisement, isLoading } = useQuery(
    ['advertisement'],
    () => getAdvertisements(cookies),
    { staleTime: Infinity }
  );

  return (
    <Flex
      direction="column"
      bg="secondary.lighter"
      minH="100vh"
      maxW="100vw"
      overflow="auto"
    >
      <WebPatientNav active="home" />
      <Wrapper>
        <HomeHero user={user} />
        <Box mt="12">
          <Heading size="lg" mb="6" fontWeight="bold">
            News & Promotion
          </Heading>
          {isLoading ? (
            <SimpleGrid
              columns={{
                base: 1,
                md: 3,
              }}
              spacing="12"
              mb="6"
            >
              <Skeleton height="400px" rounded="md" />
              <Skeleton height="400px" rounded="md" />
              <Skeleton height="400px" rounded="md" />
            </SimpleGrid>
          ) : (
            <>
              <SimpleGrid
                columns={{
                  base: 1,
                  md: 3,
                }}
                spacing="12"
                mb="6"
              >
                {dataAdvertisement?.data?.slice(0, 3)?.map(advertisement => (
                  <AdvertisementCard
                    key={advertisement.id}
                    category={advertisement.category}
                    media={`${process.env.REACT_APP_UPLOADED_FILE_URL}/${advertisement.image}`}
                    title={advertisement.title}
                    description={advertisement.content}
                    href="#"
                    author={{
                      name: 'SMART-RS',
                      href: '#',
                    }}
                  />
                ))}
              </SimpleGrid>
              <ChakraLink
                // as={Link}
                fontSize="lg"
                fontWeight="bold"
                color="primary.600"
              >
                <span>View all news & promotion</span>
                <Box as={BsArrowRight} display="inline-block" ms="2" />
              </ChakraLink>
            </>
          )}
        </Box>
      </Wrapper>
    </Flex>
  );
};

export default HomePage;
