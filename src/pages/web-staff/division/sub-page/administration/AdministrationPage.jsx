import { Box } from '@chakra-ui/layout';
import React from 'react';
import { useRouteMatch, Switch, Route } from 'react-router-dom';

import { SubMenuGrid } from '../../../../../components/web-staff/shared/sub-menu';
import { subMenus } from './subMenus';
import { ServiceSchedulePage, AddServiceSchedule } from './sub-page/service-schedule';

export const AdministrationPage = () => {
  const { path } = useRouteMatch();

  return (
    <Box pb="24">
      <Switch>
        <Route exact path={path}>
          <SubMenuGrid title="Administration" subMenus={subMenus} />
        </Route>
        <Route exact path={`${path}/service-schedule`}>
          <ServiceSchedulePage />
        </Route>
        <Route exact path={`${path}/service-schedule/create`}>
          <AddServiceSchedule />
        </Route>
      </Switch>
    </Box>
  );
};
