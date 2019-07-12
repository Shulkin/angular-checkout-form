import { ClientPaidService } from '../classes/client-paid-service';

export const CLIENT_PAID_SERVICES: ClientPaidService[] = [
  { id: 0, clientId: 0, serviceId: 0, paidAmount: 22 },
  { id: 1, clientId: 0, serviceId: 1, paidAmount: 10 },
  { id: 2, clientId: 1, serviceId: 0, paidAmount: 125 },
  { id: 3, clientId: 2, serviceId: 1, paidAmount: 34 },
  { id: 4, clientId: 2, serviceId: 4, paidAmount: 57 },
];
