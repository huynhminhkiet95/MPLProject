import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyandformsComponent } from './policyandforms.component';

describe('PolicyandformsComponent', () => {
  let component: PolicyandformsComponent;
  let fixture: ComponentFixture<PolicyandformsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyandformsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyandformsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
