export class ClientPaidService {
  clientId: number;
  serviceId: number;
  paidAmount: number;
  constructor(clientId: number, serviceId: number, paidAmount: number) {
    this.clientId = clientId;
    this.serviceId = serviceId;
    this.paidAmount = paidAmount;
  }
}
