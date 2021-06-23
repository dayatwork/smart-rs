import { useContext } from 'react';

import { AuthContext } from '../contexts/authContext';

export const SuperAdminComponent = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (user?.role?.alias === 'super-admin') {
    return children;
  }

  return null;
};
