import { TestBed, inject } from '@angular/core/testing';

import { EntryExitLogService } from './entry-exit-log.service';

describe('EntryExitLogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EntryExitLogService]
    });
  });

  it('should be created', inject([EntryExitLogService], (service: EntryExitLogService) => {
    expect(service).toBeTruthy();
  }));
});
