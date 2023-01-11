import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeRequisitionApprovalDetailComponent } from './employee-requisition-approval-detail.component';

describe('EmployeeRequisitionApprovalDetailComponent', () => {
  let component: EmployeeRequisitionApprovalDetailComponent;
  let fixture: ComponentFixture<EmployeeRequisitionApprovalDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeRequisitionApprovalDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeRequisitionApprovalDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
