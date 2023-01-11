import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItAdminComponent } from './it-admin.component';

describe('ItAdminComponent', () => {
  let component: ItAdminComponent;
  let fixture: ComponentFixture<ItAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
