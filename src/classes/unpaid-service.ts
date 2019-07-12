export class UnpaidService {
  clientId: number;
  serviceId: number;
  cost: number;
  paidAmount: number;
  debt: number;
  constructor(clientId: number, serviceId: number, cost: number, paidAmount: number, debt: number) {
    this.clientId = clientId;
    this.serviceId = serviceId;
    this.paidAmount = paidAmount;
    this.debt = debt;
  }
}
