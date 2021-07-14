import { Permissions } from '../../../access-control';

export const subMenus = [
  {
    to: '/pharmacy/inventory',
    text: 'Drug Inventory',
    permission: Permissions.indexDrugInventory,
  },
  {
    to: '/pharmacy/receipt',
    text: 'Receipt',
    permission: Permissions.indexReceipt,
  },
  {
    to: '/pharmacy/packaging',
    text: 'Packaging',
    permission: Permissions.indexPackaging,
  },
  {
    to: '/pharmacy/collect-medicine',
    text: 'Collect Medicine',
    permission: Permissions.indexReceipt,
  },
];
