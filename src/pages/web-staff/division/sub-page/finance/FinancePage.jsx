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

export const FinancePage = () => {
  const { path } = useRouteMatch();

  return (
    <Box pb="24">
      <Switch>
        <Route exact path={path}>
          <SubMenuGrid title="Keuangan" subMenus={subMenus} />
        </Route>
        <Route exact path={`${path}/service`}>
          <ServicePriceListPage />
        </Route>
        <Route exact path={`${path}/service/create`}>
          <CreateServicePricePage />
        </Route>
        <Route exact path={`${path}/pharmacy`}>
          <DrugPriceListPage />
        </Route>
      </Switch>
    </Box>
  );
};
