import { Component, OnInit } from '@angular/core';
import { Client } from '../../classes/client';
import { ClientPaidService } from '../../classes/client-paid-service';
import { DisplayService } from '../../classes/display-service';
import { Payment } from '../../classes/payment';
import { UnpaidService } from '../../classes/unpaid-service';
import { CLIENTS } from '../../mock-data/mock-clients';
import { SERVICES } from '../../mock-data/mock-services';
import { CLIENT_SERVICES } from '../../mock-data/mock-client-services';
import { CLIENT_PAID_SERVICES } from '../../mock-data/mock-client-paid-services';

declare var UIkit: any;

@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.sass']
})
export class ClientsListComponent implements OnInit {
  title = 'Список наших клиентов';
  // TODO: should be in global store
  clients = CLIENTS;
  services = SERVICES;
  clientServices = CLIENT_SERVICES;
  clientPaidServices = CLIENT_PAID_SERVICES;
  clientWhoMakesPayment: Client = null;

  constructor() {
  }
  ngOnInit() {
  }
  getClientPaidServiceByClientIdAndServiceId(clientId: number, serviceId: number): ClientPaidService {
    return this.clientPaidServices.find(item => item.clientId === clientId && item.serviceId === serviceId);
  }
  getServicesProviedToClientByClientId(clientId: number): DisplayService[] {
    return this.clientServices
      .filter(item => item.clientId === clientId)
      .map(clientService => {
        const service = this.services.find(item => item.id === clientService.serviceId);
        const paidService = this.getClientPaidServiceByClientIdAndServiceId(clientService.clientId, clientService.serviceId);
        return {
          name: service ? service.name : '',
          cost: clientService.cost,
          paidAmount: paidService ? paidService.paidAmount : 0,
        };
      });
  }
  onOpenPaymentWindow(clientId: number) {
    this.clientWhoMakesPayment = this.clients.find(item => item.id === clientId) || null;
  }
  onClientMadePayment(clientPayment: Payment) {
    console.log('on client made payment', clientPayment);
    const unpaidClientServices: UnpaidService[] = this.clientServices
      .filter(item => item.clientId === clientPayment.clientId)
      .filter(item => {
        const paidService = this.getClientPaidServiceByClientIdAndServiceId(item.clientId, item.serviceId);
        // if the client has not paid for the service yet or does not pay for it in full
        return !paidService || paidService.paidAmount < item.cost;
      })
      .map(item => {
        const paidService = this.getClientPaidServiceByClientIdAndServiceId(item.clientId, item.serviceId);
        const cost = item.cost;
        const paidAmount = paidService ? paidService.paidAmount : 0;
        return new UnpaidService(item.clientId, item.serviceId, cost, paidAmount, cost - paidAmount);
      });
    const totalServiceDebt = unpaidClientServices.reduce((previous, item) => previous + item.debt, 0);
    if (totalServiceDebt === 0) {
      UIkit.notification('Все ваши услуги оплачены');
      return;
    }
    unpaidClientServices.forEach(item => {
      const paidService = this.getClientPaidServiceByClientIdAndServiceId(item.clientId, item.serviceId);
      const paidAmount = Math.floor(item.debt * 100 / totalServiceDebt);
      if (paidService) {
        paidService.paidAmount += paidAmount;
      } else {
        this.clientPaidServices.push(new ClientPaidService(item.clientId, item.serviceId, paidAmount));
      }
    });
  }
}
