import { useContext } from 'react';

import { AuthContext } from '../contexts/authContext';

export const PrivateComponent = ({ children, permission, ...rest }) => {
  const { permissions, isLoadingPermissions } = useContext(AuthContext);

  if (isLoadingPermissions) return null;

  if (permissions.includes(permission)) {
    return children;
  }

  return null;
};
