import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ClientService } from '../classes/client-service';
import { CLIENT_SERVICES } from '../mock-data/mock-client-services';

@Injectable({
  providedIn: 'root'
})
export class ClientServicesService {
  constructor() {}
  getClientServices(): Observable<ClientService[]> {
    return of(CLIENT_SERVICES);
  }
}
