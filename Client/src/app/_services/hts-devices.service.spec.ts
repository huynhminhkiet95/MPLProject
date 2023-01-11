import { TestBed, inject } from '@angular/core/testing';

import { HtsDevicesService } from './hts-devices.service';

describe('HtsDevicesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HtsDevicesService]
    });
  });

  it('should be created', inject([HtsDevicesService], (service: HtsDevicesService) => {
    expect(service).toBeTruthy();
  }));
});
