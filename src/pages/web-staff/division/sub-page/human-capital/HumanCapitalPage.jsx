import { Box } from '@chakra-ui/layout';
import React from 'react';
import { useRouteMatch, Switch, Route } from 'react-router-dom';

import { SubMenuGrid } from '../../../../../components/web-staff/shared/sub-menu';
import { subMenus } from './subMenus';
import {
  StaffListPage,
  AddNewStaffPage,
  AssignNewStaffPage,
} from './sub-page/staff';
import { ScheduleListPage } from './sub-page/schedule';
import { StaffScheduleListPage } from './sub-page/staff-schedule';
import { PrivateRoute, Permissions } from '../../../../../access-control';

export const HumanCapitalPage = () => {
  const { path } = useRouteMatch();

  return (
    <Box pb="24">
      <Switch>
        <Route exact path={path}>
          <SubMenuGrid title="SDM" subMenus={subMenus} />
        </Route>
        <Route exact path={`${path}/staff`}>
          <StaffListPage />
        </Route>
        <Route exact path={`${path}/staff/create`}>
          <AddNewStaffPage />
        </Route>
        <Route exact path={`${path}/staff/assign`}>
          <AssignNewStaffPage />
        </Route>
        <PrivateRoute
          permission={Permissions.indexSchedule}
          exact
          path={`${path}/schedule`}
        >
          <ScheduleListPage />
        </PrivateRoute>
        <PrivateRoute
          permission={Permissions.indexStaffSchedule}
          exact
          path={`${path}/staff-schedule`}
        >
          <StaffScheduleListPage />
        </PrivateRoute>
      </Switch>
    </Box>
  );
};
