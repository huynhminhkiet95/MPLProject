import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAssetMovementPopupComponent } from './employee-asset-movement-popup.component';

describe('EmployeeAssetMovementPopupComponent', () => {
  let component: EmployeeAssetMovementPopupComponent;
  let fixture: ComponentFixture<EmployeeAssetMovementPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeAssetMovementPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeAssetMovementPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
