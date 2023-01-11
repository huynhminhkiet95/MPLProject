import { TestBed, inject } from '@angular/core/testing';

import { ViewLogGateInOutService } from './view-log-gate-in-out.service';

describe('ViewLogGateInOutService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ViewLogGateInOutService]
    });
  });

  it('should be created', inject([ViewLogGateInOutService], (service: ViewLogGateInOutService) => {
    expect(service).toBeTruthy();
  }));
});
