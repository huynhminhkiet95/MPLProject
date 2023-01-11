import { TestBed, inject } from '@angular/core/testing';

import { WfUserGroupService } from './wf-user-group.service';

describe('WfUserGroupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WfUserGroupService]
    });
  });

  it('should be created', inject([WfUserGroupService], (service: WfUserGroupService) => {
    expect(service).toBeTruthy();
  }));
});
