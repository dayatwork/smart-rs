import { Box } from '@chakra-ui/layout';
import React from 'react';
import { useRouteMatch, Switch, Route } from 'react-router-dom';

import { SubMenuGrid } from '../../../../../components/web-staff/shared/sub-menu';
import { subMenus } from './subMenus';
import {
  ServiceSchedulePage,
  AddServiceSchedule,
} from './sub-page/service-schedule';
import { PrivateRoute, Permissions } from '../../../../../access-control';

export const AdministrationPage = () => {
  const { path } = useRouteMatch();

  return (
    <Box pb="24">
      <Switch>
        <Route exact path={path}>
          <SubMenuGrid title="Administrasi" subMenus={subMenus} />
        </Route>
        <PrivateRoute
          permission={Permissions.indexServiceSchedule}
          exact
          path={`${path}/service-schedule`}
        >
          <ServiceSchedulePage />
        </PrivateRoute>
        <PrivateRoute
          permission={Permissions.createServiceSchedule}
          exact
          path={`${path}/service-schedule/create`}
        >
          <AddServiceSchedule />
        </PrivateRoute>
      </Switch>
    </Box>
  );
};
