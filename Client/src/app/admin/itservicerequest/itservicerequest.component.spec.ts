import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItservicerequestComponent } from './itservicerequest.component';

describe('ItservicerequestComponent', () => {
  let component: ItservicerequestComponent;
  let fixture: ComponentFixture<ItservicerequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItservicerequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItservicerequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
