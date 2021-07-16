// import { HiOutlineHome } from 'react-icons/hi';
// import { RiBuilding4Line, RiHandHeartFill } from 'react-icons/ri';
import { GiStethoscope, GiOrganigram, GiMedicines } from 'react-icons/gi';
import {
  FaMoneyBillWave,
  FaUsersCog,
  FaUserSecret,
  FaUserCog,
} from 'react-icons/fa';
import { BsListCheck } from 'react-icons/bs';
import { RiDashboardFill } from 'react-icons/ri';
import { AiOutlineAreaChart } from 'react-icons/ai';

import { Permissions } from '../../../../access-control';

export const menus = [
  {
    to: '/dashboard',
    text: 'Dashboard',
    icon: RiDashboardFill,
    permission: Permissions.indexDashboard,
  },
  {
    to: '/analytics',
    text: 'Analytics',
    icon: AiOutlineAreaChart,
    // permission: Permissions.indexDashboard,
  },
  {
    to: '/master',
    text: 'Master',
    icon: FaUserSecret,
    permission: 'super-admin',
  },
  // {
  //   to: '/department',
  //   text: 'Department',
  //   icon: RiBuilding4Line,
  // },
  {
    to: '/division',
    text: 'Division',
    icon: GiOrganigram,
    permission: Permissions.dashboardDivision,
  },
  // {
  //   to: '/services',
  //   text: 'Services',
  //   icon: RiHandHeartFill,
  // },
  {
    to: '/events',
    text: 'Events',
    icon: BsListCheck,
    permission: Permissions.dashboardEventNode,
  },
  {
    to: '/patient',
    text: 'Patient',
    icon: GiStethoscope,
    permission: Permissions.indexExamination,
  },
  {
    to: '/pharmacy',
    text: 'Pharmacy',
    icon: GiMedicines,
    permission: Permissions.dashboardPharmacy,
  },
  {
    to: '/finance',
    text: 'Finance',
    icon: FaMoneyBillWave,
    permission: Permissions.dashboardFinance,
  },
  {
    to: '/user-management',
    text: 'User Management',
    icon: FaUserCog,
    permission: 'super-admin',
  },
  {
    to: '/institution-management',
    text: 'Institution Management',
    icon: FaUsersCog,
    permission: Permissions.dashboardInstitutionManagement,
  },
];

export const extendedMenu = [
  {
    to: '/patient/active',
  },
  {
    to: '/patient/history',
  },
  {
    to: '/patient/soap/:soapId',
  },
  {
    to: '/patient/soap-result/:soapId',
  },
  {
    to: '/dashboard/advertisement',
  },
  {
    to: '/dashboard/advertisement/create',
  },
  {
    to: '/dashboard/advertisement/edit/:id',
  },
];
