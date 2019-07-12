import { Component, OnInit } from '@angular/core';
import { Client } from '../../classes/client';
import { DisplayService } from '../../classes/display-service';
import { PaidClient } from '../../classes/paid-client';
import { CLIENTS } from '../../mock-data/mock-clients';
import { SERVICES } from '../../mock-data/mock-services';
import { CLIENT_SERVICES } from '../../mock-data/mock-client-services';
import { CLIENT_PAID_SERVICES } from '../../mock-data/mock-client-paid-services';

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
  getServicesRenderedToClientByClientId(clientId: number): DisplayService[] {
    return this.clientServices
      .filter(item => item.clientId === clientId)
      .map(clientService => {
        const service = this.services.find(item => item.id === clientService.serviceId);
        const paidService = this.clientPaidServices.find(item => {
          return item.clientId === clientService.clientId && item.serviceId === clientService.serviceId;
        });
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
  onClientMadePayment(paidClient: PaidClient) {
    console.log('on client made payment', paidClient);
  }
}
