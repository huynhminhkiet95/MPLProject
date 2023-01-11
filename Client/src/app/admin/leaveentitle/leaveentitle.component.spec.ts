import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveentitleComponent } from './leaveentitle.component';

describe('LeaveentitleComponent', () => {
  let component: LeaveentitleComponent;
  let fixture: ComponentFixture<LeaveentitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveentitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveentitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
