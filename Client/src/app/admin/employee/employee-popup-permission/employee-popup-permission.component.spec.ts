import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePopupPermissionComponent } from './employee-popup-permission.component';

describe('EmployeePopupPermissionComponent', () => {
  let component: EmployeePopupPermissionComponent;
  let fixture: ComponentFixture<EmployeePopupPermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeePopupPermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeePopupPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
