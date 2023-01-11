import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicerequestPopupComponent } from './servicerequest-popup.component';

describe('ServicerequestPopupComponent', () => {
  let component: ServicerequestPopupComponent;
  let fixture: ComponentFixture<ServicerequestPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicerequestPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicerequestPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
