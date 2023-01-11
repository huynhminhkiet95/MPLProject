import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetapporovalComponent } from './timesheetapporoval.component';

describe('TimesheetapporovalComponent', () => {
  let component: TimesheetapporovalComponent;
  let fixture: ComponentFixture<TimesheetapporovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimesheetapporovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimesheetapporovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
