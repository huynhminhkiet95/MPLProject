import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsidiaryHolidayPopupComponent } from './subsidiary-holiday-popup.component';

describe('SubsidiaryHolidayPopupComponent', () => {
  let component: SubsidiaryHolidayPopupComponent;
  let fixture: ComponentFixture<SubsidiaryHolidayPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubsidiaryHolidayPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubsidiaryHolidayPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
