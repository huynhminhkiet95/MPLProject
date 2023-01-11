import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveEntitleReportComponent } from './leave-entitle-report.component';

describe('LeaveEntitleReportComponent', () => {
  let component: LeaveEntitleReportComponent;
  let fixture: ComponentFixture<LeaveEntitleReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveEntitleReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveEntitleReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
