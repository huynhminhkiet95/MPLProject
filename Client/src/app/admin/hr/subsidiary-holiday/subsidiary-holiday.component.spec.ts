import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsidiaryHolidayComponent } from './subsidiary-holiday.component';

describe('SubsidiaryHolidayComponent', () => {
  let component: SubsidiaryHolidayComponent;
  let fixture: ComponentFixture<SubsidiaryHolidayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubsidiaryHolidayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubsidiaryHolidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
