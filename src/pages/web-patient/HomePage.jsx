import { Flex } from '@chakra-ui/react';
import * as React from 'react';

import { HomeHero } from '../../components/web-patient/home';
import { WebPatientNav, Wrapper } from '../../components/web-patient/shared';
import { AuthContext } from '../../contexts/authContext';

const HomePage = () => {
  const { user } = React.useContext(AuthContext);

  return (
    <Flex
      direction="column"
      bg="secondary.lighter"
      height="100vh"
      maxW="100vw"
      overflow="hidden"
    >
      <WebPatientNav active="home" />
      <Wrapper>
        <HomeHero user={user} />
      </Wrapper>
    </Flex>
  );
};

export default HomePage;
