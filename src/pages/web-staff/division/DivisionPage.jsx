import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';

import { AppShell } from '../../../components/web-staff/shared/app-shell';
import {
  SubMenuGrid,
  SubMenuSideBar,
  ContentWrapper,
} from '../../../components/web-staff/shared/sub-menu';
import { subMenus } from './subMenus';
import {
  AdministrationPage,
  HumanCapitalPage,
  FinancePage,
  InfrastructurePage,
} from './sub-page';

export const DivisionPage = () => {
  const { path } = useRouteMatch();

  return (
    <AppShell>
      <Box height="full" overflow="hidden" position="relative">
        <Flex h="full">
          <SubMenuSideBar
            title="Division"
            titleLink="/division"
            subMenus={subMenus}
          />
          <ContentWrapper>
            <Switch>
              <Route exact path={path}>
                <SubMenuGrid title="Division" subMenus={subMenus} />
              </Route>
              <Route path={`${path}/administration`}>
                <AdministrationPage />
              </Route>
              <Route path={`${path}/human-capital`}>
                <HumanCapitalPage />
              </Route>
              <Route path={`${path}/finance`}>
                <FinancePage />
              </Route>
              <Route path={`${path}/infrastructure`}>
                <InfrastructurePage />
              </Route>
            </Switch>
          </ContentWrapper>
        </Flex>
      </Box>
    </AppShell>
  );
};
