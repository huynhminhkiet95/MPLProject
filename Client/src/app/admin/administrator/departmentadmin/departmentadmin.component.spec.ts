import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentForAdminComponent } from './departmentadmin.component';

describe('DepartmentForAdminComponent', () => {
  let component: DepartmentForAdminComponent;
  let fixture: ComponentFixture<DepartmentForAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartmentForAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentForAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
