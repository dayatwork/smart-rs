import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useRouteMatch } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

import { NavLink } from './NavLink';
import { menus, extendedMenu } from './menus';
import { AuthContext } from '../../../../contexts/authContext';
// import { Logo } from './Logo';

export const DesktopSidebar = () => {
  const { pathname } = useLocation();
  const { path } = useRouteMatch();
  const [isPrimaryMenu, setIsPrimaryMenu] = useState(true);
  const { permissions, user } = useContext(AuthContext);

  const showedMenus = menus
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

  useEffect(() => {
    if (
      (user?.role?.alias === 'super-admin' ? menus : showedMenus)
        .map(menu => menu.to)
        .includes(pathname) ||
      extendedMenu.map(menu => menu.to).includes(path) ||
      extendedMenu.map(menu => menu.to).includes(pathname)
    ) {
      setIsPrimaryMenu(true);
    } else {
      setIsPrimaryMenu(false);
    }
  }, [pathname, path, showedMenus, user?.role?.alias]);

  return (
    <Box as="nav" h="full" display={{ base: 'none', lg: 'block' }}>
      {/* <Logo /> */}
      <Box
        h="full"
        overflowY="auto"
        py={{ base: '3', '2xl': '4' }}
        px={{ base: '2', '2xl': '3' }}
      >
        {(user?.role?.alias === 'super-admin' ? menus : showedMenus).map(
          menu => (
            <NavLink
              key={menu.to}
              isPrimaryMenu={isPrimaryMenu}
              icon={menu.icon}
              to={menu.to}
            >
              {isPrimaryMenu && menu.text}
            </NavLink>
          )
        )}
      </Box>
    </Box>
  );
};
