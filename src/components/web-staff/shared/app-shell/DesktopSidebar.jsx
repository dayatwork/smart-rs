import React, { useState, useEffect } from 'react';
import { useLocation, useRouteMatch } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

import { NavLink } from './NavLink';
import { menus, extendedMenu } from './menus';
// import { Logo } from './Logo';

export const DesktopSidebar = () => {
  const { pathname } = useLocation();
  const { path } = useRouteMatch();
  const [isPrimaryMenu, setIsPrimaryMenu] = useState(true);

  useEffect(() => {
    if (
      menus.map(menu => menu.to).includes(pathname) ||
      extendedMenu.map(menu => menu.to).includes(path) ||
      extendedMenu.map(menu => menu.to).includes(pathname)
    ) {
      setIsPrimaryMenu(true);
    } else {
      setIsPrimaryMenu(false);
    }
  }, [pathname, path]);

  return (
    <Box as="nav" h="full" display={{ base: 'none', lg: 'block' }}>
      {/* <Logo /> */}
      <Box h="full" overflowY="auto" py="4" px="3">
        {menus.map(menu => (
          <NavLink
            key={menu.to}
            isPrimaryMenu={isPrimaryMenu}
            icon={menu.icon}
            to={menu.to}
          >
            {isPrimaryMenu && menu.text}
          </NavLink>
        ))}
      </Box>
    </Box>
  );
};
