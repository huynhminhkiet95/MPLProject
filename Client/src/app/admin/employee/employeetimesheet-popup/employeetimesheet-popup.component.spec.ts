import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeetimesheetPopupComponent } from './employeetimesheet-popup.component';

describe('EmployeetimesheetPopupComponent', () => {
  let component: EmployeetimesheetPopupComponent;
  let fixture: ComponentFixture<EmployeetimesheetPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeetimesheetPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeetimesheetPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
