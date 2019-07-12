import { Component, OnInit } from '@angular/core';
import { Client } from '../../classes/client';
import { ClientPaidService } from '../../classes/client-paid-service';
import { ClientService } from '../../classes/client-service';
import { DisplayService } from '../../classes/display-service';
import { Payment } from '../../classes/payment';
import { Service } from '../../classes/service';
import { UnpaidService } from '../../classes/unpaid-service';
import { CLIENT_PAID_SERVICES } from '../../mock-data/mock-client-paid-services';
import { CLIENT_SERVICES } from '../../mock-data/mock-client-services';
import { CLIENTS } from '../../mock-data/mock-clients';
import { SERVICES } from '../../mock-data/mock-services';

declare var UIkit: any;

@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.sass']
})
export class ClientsListComponent implements OnInit {
  title = 'Список наших клиентов';
  // TODO: get from services
  clientPaidServices: ClientPaidService[] = CLIENT_PAID_SERVICES;
  clientServices: ClientService[] = CLIENT_SERVICES;
  clients: Client[] = CLIENTS;
  services: Service[] = SERVICES;
  selectedClient: Client = null;

  constructor() {}
  ngOnInit() {}
  // TODO: move to some common getters
  getService(serviceId: number): Service {
    return this.services.find(item => item.id === serviceId);
  }
  getClientService(clientId: number, serviceId: number): ClientService {
    return this.clientServices.find(item => item.clientId === clientId && item.serviceId === serviceId);
  }
  getClientPaidService(clientId: number, serviceId: number): ClientPaidService {
    return this.clientPaidServices.find(item => item.clientId === clientId && item.serviceId === serviceId);
  }
  getServicesProvidedToClient(clientId: number): DisplayService[] {
    return this.clientServices
      .filter(item => item.clientId === clientId)
      .map(clientService => {
        const service = this.getService(clientService.serviceId);
        const paidService = this.getClientPaidService(clientService.clientId, clientService.serviceId);
        return {
          // TODO: handle error when failed to get the name of the service, instead of displaying empty string
          name: service ? service.name : '',
          totalCost: clientService.totalCost,
          paidAmount: paidService ? paidService.paidAmount : 0,
        };
      });
  }
  onOpenPaymentWindow(clientId: number) {
    this.selectedClient = this.clients.find(item => item.id === clientId) || null;
  }
  onSubmitPayment(clientPayment: Payment) {
    const unpaidClientServices: UnpaidService[] = this.clientServices
      .filter(item => item.clientId === clientPayment.clientId)
      .filter(item => {
        const paidService = this.getClientPaidService(item.clientId, item.serviceId);
        // if the client has not paid for the service yet or does not pay for it in full
        return !paidService || paidService.paidAmount < item.totalCost;
      })
      .map(item => {
        const paidService = this.getClientPaidService(item.clientId, item.serviceId);
        const paidAmount = paidService ? paidService.paidAmount : 0;
        return new UnpaidService(item.clientId, item.serviceId, item.totalCost, paidAmount);
      });
    const totalServiceDebt: number = unpaidClientServices.reduce((previous, item) => previous + item.debt, 0);
    if (totalServiceDebt === 0) {
      // TODO: this probably should be in checkout form
      UIkit.notification('Все ваши услуги оплачены');
      return;
    }
    let totalOverdraft: number = 0;
    unpaidClientServices.forEach(item => {
      const clientService = this.getClientService(item.clientId, item.serviceId);
      const paidService = this.getClientPaidService(item.clientId, item.serviceId);
      const debtPercentage = +(Math.floor(item.debt * 100 / totalServiceDebt).toFixed(2));
      const newPaidAmount = +(Math.floor(clientPayment.amount * debtPercentage / 100).toFixed(2));
      if (paidService) {
        if (paidService.paidAmount + newPaidAmount > clientService.totalCost) {
          paidService.paidAmount = clientService.totalCost;
          totalOverdraft += paidService.paidAmount + newPaidAmount - clientService.totalCost;
        } else {
          paidService.paidAmount += newPaidAmount;
        }
      } else {
        const newAmount = Math.min(newPaidAmount, clientService.totalCost);
        if (newPaidAmount > clientService.totalCost) {
          totalOverdraft += newPaidAmount - clientService.totalCost;
        }
        this.clientPaidServices.push(new ClientPaidService(item.clientId, item.serviceId, newAmount));
      }
    });
    if (totalOverdraft > 0) {
      // TODO: inject currency pipe to display overdraft in pretty manner
      UIkit.notification(`Осталось ${totalOverdraft}`);
    }
  }
}
