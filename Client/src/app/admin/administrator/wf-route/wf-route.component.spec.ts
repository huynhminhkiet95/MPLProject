import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WfRouteComponent } from './wf-route.component';

describe('WfRouteComponent', () => {
  let component: WfRouteComponent;
  let fixture: ComponentFixture<WfRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WfRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WfRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
