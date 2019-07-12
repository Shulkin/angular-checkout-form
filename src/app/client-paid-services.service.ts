import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ClientPaidService } from '../classes/client-paid-service';
import { CLIENT_PAID_SERVICES } from '../mock-data/mock-client-paid-services';

@Injectable({
  providedIn: 'root'
})
export class ClientPaidServicesService {
  constructor() {}
  getClientPaidServices(): Observable<ClientPaidService[]> {
    return of(CLIENT_PAID_SERVICES);
  }
}
