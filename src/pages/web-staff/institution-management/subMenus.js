import { Permissions } from '../../../access-control';

export const subMenus = [
  {
    to: '/institution-management/institution',
    text: 'Institution',
    permission: 'super-admin',
  },
  {
    to: '/institution-management/department',
    text: 'Department',
    permission: Permissions.indexInstitutionDepartment,
  },
  {
    to: '/institution-management/division',
    text: 'Division',
    permission: Permissions.indexInstitutionDivision,
  },
  {
    to: '/institution-management/service',
    text: 'Service',
    permission: Permissions.indexInstitutionService,
  },
  {
    to: '/institution-management/event',
    text: 'Event Node',
    permission: Permissions.indexInstitutionEventNode,
  },
  {
    to: '/institution-management/fms',
    text: 'SMF',
    permission: Permissions.indexMedicalStaffFunctional,
  },
  {
    to: '/institution-management/account',
    text: 'Account',
    permission: 'hospital-admin',
  },
  {
    to: '/institution-management/role',
    text: 'Role',
    permission: Permissions.indexInstitutionRole,
  },
  {
    to: '/institution-management/lab-category',
    text: 'Lab Category',
    permission: Permissions.indexInstitutionLaboratory,
  },
  {
    to: '/institution-management/radiology-category',
    text: 'Radiology Category',
    permission: Permissions.indexInstitutionRadiology,
  },
  {
    to: '/institution-management/payment-method',
    text: 'Payment Method',
    permission: Permissions.indexInstitutionPaymentMethod,
  },
];
