import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WfNameRoleComponent } from './wf-name-role.component';

describe('WfNameRoleComponent', () => {
  let component: WfNameRoleComponent;
  let fixture: ComponentFixture<WfNameRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WfNameRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WfNameRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
