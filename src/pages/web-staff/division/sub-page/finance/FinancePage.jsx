import { Box } from '@chakra-ui/layout';
import React from 'react';
import { useRouteMatch, Switch, Route } from 'react-router-dom';

import { SubMenuGrid } from '../../../../../components/web-staff/shared/sub-menu';
import { subMenus } from './subMenus';
import {
  ServicePriceListPage,
  CreateServicePricePage,
} from './sub-page/service';
import { DrugPriceListPage } from './sub-page/pharmacy';
import { PrivateRoute, Permissions } from '../../../../../access-control';

export const FinancePage = () => {
  const { path } = useRouteMatch();

  return (
    <Box pb="24">
      <Switch>
        <Route exact path={path}>
          <SubMenuGrid title="Keuangan" subMenus={subMenus} />
        </Route>
        <PrivateRoute
          permission={Permissions.indexServicePrice}
          exact
          path={`${path}/service`}
        >
          <ServicePriceListPage />
        </PrivateRoute>
        <PrivateRoute
          permission={Permissions.createServicePrice}
          exact
          path={`${path}/service/create`}
        >
          <CreateServicePricePage />
        </PrivateRoute>
        <PrivateRoute
          permission={Permissions.indexDrugPrice}
          exact
          path={`${path}/pharmacy`}
        >
          <DrugPriceListPage />
        </PrivateRoute>
      </Switch>
    </Box>
  );
};
