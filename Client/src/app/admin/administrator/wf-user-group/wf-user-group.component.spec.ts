import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WfUserGroupComponent } from './wf-user-group.component';

describe('WfUserGroupComponent', () => {
  let component: WfUserGroupComponent;
  let fixture: ComponentFixture<WfUserGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WfUserGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WfUserGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
