import { HiOutlineHome } from 'react-icons/hi';
import { RiBuilding4Line, RiHandHeartFill } from 'react-icons/ri';
import { GiStethoscope, GiOrganigram, GiMedicines } from 'react-icons/gi';
import { FaMoneyBillWave, FaUsersCog, FaUserSecret, FaUserCog } from 'react-icons/fa';
import { BsListCheck } from 'react-icons/bs';

export const menus = [
  {
    to: '/dashboard',
    text: 'Dashboard',
    icon: HiOutlineHome,
  },
  {
    to: '/master',
    text: 'Master',
    icon: FaUserSecret,
  },
  {
    to: '/department',
    text: 'Department',
    icon: RiBuilding4Line,
  },
  {
    to: '/division',
    text: 'Division',
    icon: GiOrganigram,
  },
  {
    to: '/services',
    text: 'Services',
    icon: RiHandHeartFill,
  },
  {
    to: '/events',
    text: 'Events',
    icon: BsListCheck,
  },
  {
    to: '/patient',
    text: 'Patient',
    icon: GiStethoscope,
  },
  {
    to: '/pharmacy',
    text: 'Pharmacy',
    icon: GiMedicines,
  },
  {
    to: '/finance',
    text: 'Finance',
    icon: FaMoneyBillWave,
  },
  {
    to: '/user-management',
    text: 'User Management',
    icon: FaUserCog,
  },
  {
    to: '/institution-management',
    text: 'Institution Management',
    icon: FaUsersCog,
  },
];
