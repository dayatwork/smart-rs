import React, { useContext } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';

import { AppShell } from '../../../components/web-staff/shared/app-shell';
import {
  SubMenuGrid,
  SubMenuSideBar,
  ContentWrapper,
} from '../../../components/web-staff/shared/sub-menu';
import { subMenus } from './subMenus';
import {
  DrugInventoryPage,
  DrugReceiptPage,
  DrugReceiptDetailPage,
  DrugPackagePage,
  DrugPackageDetailPage,
} from './sub-page';
import { PrivateRoute, Permissions } from '../../../access-control';
import { AuthContext } from '../../../contexts/authContext';

const PharmacyPage = () => {
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
      <Helmet>
        <title>Pharmacy | SMART-RS</title>
      </Helmet>
      <Box height="full" overflow="hidden" position="relative" w="full">
        <Flex h="full">
          <SubMenuSideBar
            title="Pharmacy"
            titleLink="/pharmacy"
            subMenus={
              user?.role?.alias === 'super-admin' ? subMenus : showedSubMenus
            }
          />
          <ContentWrapper>
            <Switch>
              <PrivateRoute
                permission={Permissions.dashboardPharmacy}
                exact
                path={path}
              >
                <SubMenuGrid
                  title="Pharmacy"
                  subMenus={
                    user?.role?.alias === 'super-admin'
                      ? subMenus
                      : showedSubMenus
                  }
                />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexDrugInventory}
                exact
                path={`${path}/inventory`}
              >
                <DrugInventoryPage />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexReceipt}
                exact
                path={`${path}/receipt`}
              >
                <DrugReceiptPage />
              </PrivateRoute>
              <Route exact path={`${path}/receipt/:id`}>
                <DrugReceiptDetailPage />
              </Route>
              <PrivateRoute
                permission={Permissions.indexPackaging}
                exact
                path={`${path}/packaging`}
              >
                <DrugPackagePage />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions['read-detailPackaging']}
                exact
                path={`${path}/packaging/:id`}
              >
                <DrugPackageDetailPage />
              </PrivateRoute>
            </Switch>
          </ContentWrapper>
        </Flex>
      </Box>
    </AppShell>
  );
};

export default PharmacyPage;
