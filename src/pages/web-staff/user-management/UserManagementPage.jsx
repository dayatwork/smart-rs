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
import { UsersPage, RolePage } from './sub-page';

export const UserManagementPage = () => {
  const { path } = useRouteMatch();

  return (
    <AppShell>
      <Box height="full" overflow="hidden" position="relative">
        <Flex h="full">
          <SubMenuSideBar
            title="User Management"
            titleLink="/user-management"
            subMenus={subMenus}
          />
          <ContentWrapper>
            <Switch>
              <Route exact path={path}>
                <SubMenuGrid title="User Management" subMenus={subMenus} />
              </Route>
              <Route exact path={`${path}/users`}>
                <UsersPage />
              </Route>
              <Route exact path={`${path}/role`}>
                <RolePage />
              </Route>
            </Switch>
          </ContentWrapper>
        </Flex>
      </Box>
    </AppShell>
  );
};
