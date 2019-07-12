import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Client } from '../classes/client';
import { CLIENTS } from '../mock-data/mock-clients';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  constructor() {}
  getClients(): Observable<Client[]> {
    return of(CLIENTS);
  }
}
