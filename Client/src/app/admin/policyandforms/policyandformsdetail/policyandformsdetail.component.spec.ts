import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyandformsdetailComponent } from './policyandformsdetail.component';

describe('PolicyandformsdetailComponent', () => {
  let component: PolicyandformsdetailComponent;
  let fixture: ComponentFixture<PolicyandformsdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyandformsdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyandformsdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
