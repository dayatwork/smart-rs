import { Box } from '@chakra-ui/layout';
import React from 'react';
import { useRouteMatch, Switch, Route } from 'react-router-dom';

import { SubMenuGrid } from '../../../../../components/web-staff/shared/sub-menu';
import { subMenus } from './subMenus';
import { InfrastructureListPage, InfrastructureTypePage } from './sub-page';

export const InfrastructurePage = () => {
  const { path } = useRouteMatch();

  return (
    <Box pb="24">
      <Switch>
        <Route exact path={path}>
          <SubMenuGrid title="Sarana/Prasarana" subMenus={subMenus} />
        </Route>
        <Route exact path={`${path}/list`}>
          <InfrastructureListPage />
        </Route>
        <Route exact path={`${path}/type`}>
          <InfrastructureTypePage />
        </Route>
      </Switch>
    </Box>
  );
};
