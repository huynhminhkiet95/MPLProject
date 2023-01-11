import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceApprovalComponent } from './service-approval.component';

describe('ServiceApprovalComponent', () => {
  let component: ServiceApprovalComponent;
  let fixture: ComponentFixture<ServiceApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
