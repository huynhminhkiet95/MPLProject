import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupassetComponent } from './groupasset.component';

describe('GroupassetComponent', () => {
  let component: GroupassetComponent;
  let fixture: ComponentFixture<GroupassetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupassetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupassetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
