import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OffBoardingDetailComponent } from './off-boarding-detail.component';

describe('OffBoardingDetailComponent', () => {
  let component: OffBoardingDetailComponent;
  let fixture: ComponentFixture<OffBoardingDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffBoardingDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffBoardingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
