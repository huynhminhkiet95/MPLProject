import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OndeskPopupComponent } from './ondesk-popup.component';

describe('OndeskPopupComponent', () => {
  let component: OndeskPopupComponent;
  let fixture: ComponentFixture<OndeskPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OndeskPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OndeskPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
