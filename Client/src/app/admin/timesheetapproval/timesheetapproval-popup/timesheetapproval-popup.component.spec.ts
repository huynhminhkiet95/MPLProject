import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetapprovalPopupComponent } from './timesheetapproval-popup.component';

describe('TimesheetapprovalPopupComponent', () => {
  let component: TimesheetapprovalPopupComponent;
  let fixture: ComponentFixture<TimesheetapprovalPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimesheetapprovalPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimesheetapprovalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
