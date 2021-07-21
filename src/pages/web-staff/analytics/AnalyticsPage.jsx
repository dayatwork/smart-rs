import React, { useContext } from 'react';
import { Switch, useRouteMatch } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';

import { Helmet } from 'react-helmet-async';

import { AuthContext } from 'contexts/authContext';
import { AppShell } from 'components/web-staff/shared/app-shell';
import {
  ContentWrapper,
  SubMenuGrid,
  SubMenuSideBar,
} from 'components/web-staff/shared/sub-menu';
import { PrivateRoute, Permissions } from 'access-control';
import { subMenus } from './subMenus';
import { BusinessProcessPage } from './sub-page/business-process/BusinessProcessPage';
import { LearningAndGrowthPage } from './sub-page/learning-and-growth/LearningAndGrowthPage';
import { CustomersPage } from './sub-page/customers/CustomersPage';
import { FinancePage } from './sub-page/finance/FinancePage';

const AnalyticsPage = () => {
  const { path } = useRouteMatch();
  const { user, permissions } = useContext(AuthContext);

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
      <Helmet>
        <title>Analytics | SMART-RS</title>
      </Helmet>
      <Box height="full" overflow="hidden" position="relative" w="full">
        <Flex h="full">
          <SubMenuSideBar
            title="Analytics"
            titleLink="/analytics"
            subMenus={
              user?.role?.alias === 'super-admin' ? subMenus : showedSubMenus
            }
          />
          <ContentWrapper>
            <Switch>
              <PrivateRoute
                permission={Permissions.indexDashboard}
                exact
                path={path}
                pageTitle="Analytics | SMART-RS"
              >
                <SubMenuGrid
                  title="Analytics"
                  subMenus={
                    user?.role?.alias === 'super-admin'
                      ? subMenus
                      : showedSubMenus
                  }
                />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexDashboard}
                path={`${path}/business-process`}
              >
                <BusinessProcessPage />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexDashboard}
                path={`${path}/learning-and-growth`}
              >
                <LearningAndGrowthPage />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexDashboard}
                path={`${path}/customers`}
              >
                <CustomersPage />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexDashboard}
                path={`${path}/finance`}
              >
                <FinancePage />
              </PrivateRoute>
            </Switch>
          </ContentWrapper>
        </Flex>
      </Box>
    </AppShell>
  );
};

export default AnalyticsPage;
