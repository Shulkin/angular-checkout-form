export class PaidClient {
  clientId: number;
  paidAmount: number;
  constructor(clientId: number, paidAmount: number) {
    this.clientId = clientId;
    this.paidAmount = paidAmount;
  }
}
