import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckInOutDetailComponent } from './check-in-out-detail.component';

describe('CheckInOutDetailComponent', () => {
  let component: CheckInOutDetailComponent;
  let fixture: ComponentFixture<CheckInOutDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckInOutDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckInOutDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
