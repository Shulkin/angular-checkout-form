import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Service } from '../classes/service';
import { SERVICES } from '../mock-data/mock-services';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  constructor() {}
  getServices(): Observable<Service[]> {
    return of(SERVICES);
  }
}
