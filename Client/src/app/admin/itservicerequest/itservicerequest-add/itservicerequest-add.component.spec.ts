import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItservicerequestAddComponent } from './itservicerequest-add.component';

describe('ItservicerequestAddComponent', () => {
  let component: ItservicerequestAddComponent;
  let fixture: ComponentFixture<ItservicerequestAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItservicerequestAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItservicerequestAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
