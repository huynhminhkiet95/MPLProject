import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserprofileViewdetailComponent } from './userprofile-viewdetail.component';

describe('UserprofileViewdetailComponent', () => {
  let component: UserprofileViewdetailComponent;
  let fixture: ComponentFixture<UserprofileViewdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserprofileViewdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserprofileViewdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
