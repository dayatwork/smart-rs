import React, { useContext } from 'react';
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
import { PrivateRoute, Permissions } from '../../../access-control';
import { AuthContext } from '../../../contexts/authContext';

export const DivisionPage = () => {
  const { path } = useRouteMatch();
  const { permissions, user } = useContext(AuthContext);

  const showedSubMenus = subMenus
    .map(menu => {
      if (menu.permission) {
        if (permissions.includes(menu.permission)) {
          return menu;
        }
        return false;
      }
      return menu;
    })
    .filter(menu => !!menu);

  return (
    <AppShell>
      <Box height="full" overflow="hidden" position="relative">
        <Flex h="full">
          <SubMenuSideBar
            title="Division"
            titleLink="/division"
            subMenus={
              user?.role?.alias === 'super-admin' ? subMenus : showedSubMenus
            }
          />
          <ContentWrapper>
            <Switch>
              <PrivateRoute
                permission={Permissions.dashboardDivision}
                exact
                path={path}
                pageTitle="Division | SMART-RS"
              >
                <SubMenuGrid
                  title="Division"
                  subMenus={
                    user?.role?.alias === 'super-admin'
                      ? subMenus
                      : showedSubMenus
                  }
                />
              </PrivateRoute>
              <PrivateRoute
                permission={
                  Permissions['division-dashboardDivisionAdministration']
                }
                path={`${path}/administration`}
              >
                <AdministrationPage />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexHumanCapital}
                path={`${path}/human-capital`}
              >
                <HumanCapitalPage />
              </PrivateRoute>
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
