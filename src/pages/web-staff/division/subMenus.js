import { Permissions } from '../../../access-control';

export const subMenus = [
  {
    to: '/division/administration',
    text: 'Administrasi',
    permission: Permissions['division-dashboardDivisionAdministration'],
  },
  {
    to: '/division/human-capital',
    text: 'SDM',
    permission: Permissions.indexHumanCapital,
  },
  {
    to: '/division/finance',
    text: 'Keuangan',
    permission: Permissions.indexServicePrice,
  },
  {
    to: '/division/infrastructure',
    text: 'Sarana / Prasarana',
  },
];
