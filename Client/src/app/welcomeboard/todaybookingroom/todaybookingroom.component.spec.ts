import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodaybookingroomComponent } from './todaybookingroom.component';

describe('TodaybookingroomComponent', () => {
  let component: TodaybookingroomComponent;
  let fixture: ComponentFixture<TodaybookingroomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodaybookingroomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodaybookingroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
