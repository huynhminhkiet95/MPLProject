import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeCheckAddnewPopupComponent } from './employee-check-addnew-popup.component';

describe('EmployeeCheckAddnewPopupComponent', () => {
  let component: EmployeeCheckAddnewPopupComponent;
  let fixture: ComponentFixture<EmployeeCheckAddnewPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeCheckAddnewPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeCheckAddnewPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
