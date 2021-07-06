import React from 'react';
import { Switch, useRouteMatch } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';

import { AppShell } from '../../../components/web-staff/shared/app-shell';
import {
  SubMenuGrid,
  SubMenuSideBar,
  ContentWrapper,
} from '../../../components/web-staff/shared/sub-menu';
import { subMenus } from './subMenus';
import { UsersPage, RolePage } from './sub-page';
import { SuperAdminRoute } from '../../../access-control';

const UserManagementPage = () => {
  const { path } = useRouteMatch();

  return (
    <AppShell>
      <Helmet>
        <title>User Management | SMART-RS</title>
      </Helmet>
      <Box height="full" overflow="hidden" position="relative" w="full">
        <Flex h="full">
          <SubMenuSideBar
            title="User Management"
            titleLink="/user-management"
            subMenus={subMenus}
          />
          <ContentWrapper>
            <Switch>
              <SuperAdminRoute exact path={path}>
                <SubMenuGrid title="User Management" subMenus={subMenus} />
              </SuperAdminRoute>
              <SuperAdminRoute exact path={`${path}/users`}>
                <UsersPage />
              </SuperAdminRoute>
              <SuperAdminRoute exact path={`${path}/role`}>
                <RolePage />
              </SuperAdminRoute>
            </Switch>
          </ContentWrapper>
        </Flex>
      </Box>
    </AppShell>
  );
};

export default UserManagementPage;
