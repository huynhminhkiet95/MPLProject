import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItservicerequestDetailComponent } from './itservicerequest-detail.component';

describe('ItservicerequestDetailComponent', () => {
  let component: ItservicerequestDetailComponent;
  let fixture: ComponentFixture<ItservicerequestDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItservicerequestDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItservicerequestDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
