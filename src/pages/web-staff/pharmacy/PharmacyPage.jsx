import React from 'react';
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
  DrugInventoryPage,
  DrugReceiptPage,
  DrugReceiptDetailPage,
  DrugPackagePage,
  DrugPackageDetailPage,
} from './sub-page';

export const PharmacyPage = () => {
  const { path } = useRouteMatch();

  return (
    <AppShell>
      <Box height="full" overflow="hidden" position="relative">
        <Flex h="full">
          <SubMenuSideBar title="Pharmacy" titleLink="/pharmacy" subMenus={subMenus} />
          <ContentWrapper>
            <Switch>
              <Route exact path={path}>
                <SubMenuGrid title="Pharmacy" subMenus={subMenus} />
              </Route>
              <Route exact path={`${path}/inventory`}>
                <DrugInventoryPage />
              </Route>
              <Route exact path={`${path}/receipt`}>
                <DrugReceiptPage />
              </Route>
              <Route exact path={`${path}/receipt/:id`}>
                <DrugReceiptDetailPage />
              </Route>
              <Route exact path={`${path}/packaging`}>
                <DrugPackagePage />
              </Route>
              <Route exact path={`${path}/packaging/:id`}>
                <DrugPackageDetailPage />
              </Route>
            </Switch>
          </ContentWrapper>
        </Flex>
      </Box>
    </AppShell>
  );
};
