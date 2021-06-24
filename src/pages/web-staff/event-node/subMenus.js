import { Permissions } from '../../../access-control';

export const subMenus = [
  {
    to: '/events/registration',
    text: 'Registration',
    permission: Permissions.indexRegistration,
    // permission: Permissions.readRegistration,
  },
  {
    to: '/events/booking',
    text: 'Booking',
    permission: Permissions.indexBookingDoctor,
    // permission: Permissions.readBooking,
  },
  {
    to: '/events/checkin',
    text: 'Check-in',
    permission: Permissions.indexCheckIn,
    // permission: Permissions.readCheckIn,
  },
  {
    to: '/events/examination',
    text: 'Examination',
    permission: Permissions.indexExamination,
    // permission: Permissions.readExamination,
  },
  {
    to: '/events/imaging',
    text: 'Imaging',
    permission: Permissions.indexImaging,
  },
  {
    to: '/events/blood-draw',
    text: 'Blood Draw',
    permission: Permissions.indexBloodDraw,
  },
  {
    to: '/events/blood-test',
    text: 'Blood Test',
    permission: Permissions.indexBloodTest,
  },
  {
    to: '/events/prescription',
    text: 'Prescription',
    permission: Permissions.indexPrescription,
  },
  {
    to: '/events/collect-medicine',
    text: 'Collect Medicine',
    permission: Permissions.indexReceipt,
  },
  {
    to: '/events/payment',
    text: 'Payment',
    permission: Permissions.indexPayment,
  },
];
