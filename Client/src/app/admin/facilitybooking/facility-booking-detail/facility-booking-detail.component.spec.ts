import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityBookingDetailComponent } from './facility-booking-detail.component';

describe('FacilityBookingDetailComponent', () => {
  let component: FacilityBookingDetailComponent;
  let fixture: ComponentFixture<FacilityBookingDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityBookingDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityBookingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
