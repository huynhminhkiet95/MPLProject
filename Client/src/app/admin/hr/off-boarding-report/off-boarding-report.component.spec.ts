import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OffBoardingReportComponent } from './off-boarding-report.component';

describe('OffBoardingReportComponent', () => {
  let component: OffBoardingReportComponent;
  let fixture: ComponentFixture<OffBoardingReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffBoardingReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffBoardingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
