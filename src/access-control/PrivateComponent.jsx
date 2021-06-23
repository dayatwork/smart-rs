import { useContext } from 'react';

import { AuthContext } from '../contexts/authContext';

export const PrivateComponent = ({ children, permission, ...rest }) => {
  const { permissions, isLoadingPermissions, user } = useContext(AuthContext);

  if (isLoadingPermissions) return null;

  if (user?.role?.alias === 'super-admin' || permissions.includes(permission)) {
    return children;
  }

  return null;
};
