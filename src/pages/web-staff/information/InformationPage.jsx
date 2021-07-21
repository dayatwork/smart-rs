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

import { PrivateRoute, Permissions } from '../../../access-control';
import { AuthContext } from '../../../contexts/authContext';
import { FAQPage } from './sub-page';

const InformationPage = () => {
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
      <Box height="full" overflow="hidden" position="relative" w="full">
        <Flex h="full">
          <SubMenuSideBar
            title="Information"
            titleLink="/information"
            subMenus={
              user?.role?.alias === 'super-admin' ? subMenus : showedSubMenus
            }
          />
          <ContentWrapper>
            <Switch>
              <PrivateRoute
                exact
                permission={Permissions.indexDashboard}
                path={path}
                pageTitle="Information | SMART-RS"
              >
                <SubMenuGrid
                  title="Information"
                  subMenus={
                    user?.role?.alias === 'super-admin'
                      ? subMenus
                      : showedSubMenus
                  }
                />
              </PrivateRoute>

              <Route path={`${path}/faq`}>
                <FAQPage />
              </Route>
            </Switch>
          </ContentWrapper>
        </Flex>
      </Box>
    </AppShell>
  );
};

export default InformationPage;
