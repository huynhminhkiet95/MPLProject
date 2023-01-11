import { TestBed, inject } from '@angular/core/testing';

import { OffboardnoticeServiceService } from './offboardnotice.service.service';

describe('OffboardnoticeServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OffboardnoticeServiceService]
    });
  });

  it('should be created', inject([OffboardnoticeServiceService], (service: OffboardnoticeServiceService) => {
    expect(service).toBeTruthy();
  }));
});
