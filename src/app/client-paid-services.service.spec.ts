import { TestBed } from '@angular/core/testing';

import { ClientPaidServicesService } from './client-paid-services.service';

describe('ClientPaidServicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClientPaidServicesService = TestBed.get(ClientPaidServicesService);
    expect(service).toBeTruthy();
  });
});
