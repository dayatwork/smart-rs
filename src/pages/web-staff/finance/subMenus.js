import { Permissions } from '../../../access-control';

export const subMenus = [
  {
    to: '/finance/payment-method',
    text: 'Payment Method',
    permission: Permissions.indexInstitutionPaymentMethod,
  },
  {
    to: '/finance/patient-payment',
    text: 'Patient Payment',
    permission: Permissions.indexPayment,
  },
];
