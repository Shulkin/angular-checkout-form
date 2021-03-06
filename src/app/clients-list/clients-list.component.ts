import { Component, OnInit } from '@angular/core';
import { PersistenceService, StorageType } from 'angular-persistence';
// my classes
import { Client } from '../../classes/client';
import { ClientPaidService } from '../../classes/client-paid-service';
import { ClientService } from '../../classes/client-service';
import { DisplayService } from '../../classes/display-service';
import { Payment } from '../../classes/payment';
import { Service } from '../../classes/service';
import { UnpaidService } from '../../classes/unpaid-service';
// data services
import { ClientsService } from '../clients.service';
import { ServicesService } from '../services.service';
import { ClientServicesService } from '../client-services.service';
import { ClientPaidServicesService } from '../client-paid-services.service';

declare var UIkit: any;

@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.sass']
})
export class ClientsListComponent implements OnInit {
  title = 'Список наших клиентов';
  clientPaidServices: ClientPaidService[];
  clientServices: ClientService[];
  clients: Client[];
  services: Service[];
  selectedClient: Client = null;

  constructor(
    private clientsService: ClientsService,
    private servicesService: ServicesService,
    private clientServicesService: ClientServicesService,
    private clientPaidServicesService: ClientPaidServicesService,
    private persistenceService: PersistenceService
  ) {}
  ngOnInit() {
    this.getClients();
    this.getServices();
    this.getClientServices();
    this.getClientPaidServices();
  }
  getClients() {
    this.clientsService.getClients().subscribe(data => this.clients = data);
  }
  getServices() {
    this.servicesService.getServices().subscribe(data => this.services = data);
  }
  getClientServices() {
    this.clientServicesService.getClientServices().subscribe(data => this.clientServices = data);
  }
  getClientPaidServices() {
    this.clientPaidServicesService.getClientPaidServices().subscribe(data => this.clientPaidServices = data);
  }
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
          totalOverdraft += paidService.paidAmount + newPaidAmount - clientService.totalCost;
          paidService.paidAmount = clientService.totalCost;
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
    // TODO: this should be in corresponding service
    this.persistenceService.set('clientPaidServices', this.clientPaidServices, { type: StorageType.LOCAL });
  }
}
