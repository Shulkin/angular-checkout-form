export class UnpaidService {
  clientId: number;
  serviceId: number;
  // how much is the service cost
  totalCost: number;
  // how much the user has already paid
  paidAmount: number;
  // difference between totalCost and paidAmount
  debt: number;
  constructor(clientId: number, serviceId: number, totalCost: number, paidAmount: number) {
    this.clientId = clientId;
    this.serviceId = serviceId;
    this.totalCost = totalCost;
    this.paidAmount = paidAmount;
    this.debt = totalCost > paidAmount ? totalCost - paidAmount : 0;
  }
}
