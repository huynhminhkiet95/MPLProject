import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveentitlePopupComponent } from './leaveentitle-popup.component';

describe('LeaveentitlePopupComponent', () => {
  let component: LeaveentitlePopupComponent;
  let fixture: ComponentFixture<LeaveentitlePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveentitlePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveentitlePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
