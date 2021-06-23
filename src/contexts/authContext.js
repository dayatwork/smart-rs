import { createContext } from 'react';

const AuthContext = createContext({
  user: null,
  logout: () => {},
  setUser: () => {},
  setCookie: () => {},
  token: null,
  setToken: () => {},
  cookie: null,
  permissions: [],
  isLoadingPermissions: true,
  employeeDetail: null,
  setEmployeeDetail: () => {},
});

export { AuthContext };
