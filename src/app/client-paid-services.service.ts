import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PersistenceService, StorageType } from 'angular-persistence';
import { ClientPaidService } from '../classes/client-paid-service';
import { CLIENT_PAID_SERVICES } from '../mock-data/mock-client-paid-services';

@Injectable({
  providedIn: 'root'
})
export class ClientPaidServicesService {
  constructor(private persistenceService: PersistenceService) {}
  getClientPaidServices(): Observable<ClientPaidService[]> {
    return of(this.persistenceService.get('clientPaidServices', StorageType.LOCAL) || CLIENT_PAID_SERVICES);
  }
}
