import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilitybookingComponent } from './facilitybooking.component';

describe('FacilitybookingComponent', () => {
  let component: FacilitybookingComponent;
  let fixture: ComponentFixture<FacilitybookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilitybookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilitybookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
