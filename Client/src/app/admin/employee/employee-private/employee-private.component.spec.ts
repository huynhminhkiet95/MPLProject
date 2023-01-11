import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePrivateComponent } from './employee-private.component';

describe('EmployeePrivateComponent', () => {
  let component: EmployeePrivateComponent;
  let fixture: ComponentFixture<EmployeePrivateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeePrivateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeePrivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
