import { useContext } from 'react';

import { AuthContext } from '../contexts/authContext';

export const PrivateComponent = ({ children, permission, ...rest }) => {
  const { permissions, isLoadingPermissions, user, employeeDetail } =
    useContext(AuthContext);

  if (isLoadingPermissions) return null;

  if (
    user?.role?.alias === 'super-admin' ||
    (employeeDetail?.employee_id && permissions.includes(permission))
  ) {
    return children;
  }

  return null;
};
