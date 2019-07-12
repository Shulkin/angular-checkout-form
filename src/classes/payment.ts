// how much money the user has made through checkout form
export class Payment {
  clientId: number;
  amount: number;
  constructor(clientId: number, amount: number) {
    this.clientId = clientId;
    this.amount = amount;
  }
}
