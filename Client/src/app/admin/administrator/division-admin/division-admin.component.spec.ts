import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DivisionAdminComponent } from './division-admin.component';

describe('DivisionAdminComponent', () => {
  let component: DivisionAdminComponent;
  let fixture: ComponentFixture<DivisionAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DivisionAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivisionAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
