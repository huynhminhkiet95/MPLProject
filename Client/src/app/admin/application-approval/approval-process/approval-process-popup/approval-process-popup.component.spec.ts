import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalProcessPopupComponent } from './approval-process-popup.component';

describe('ApprovalProcessPopupComponent', () => {
  let component: ApprovalProcessPopupComponent;
  let fixture: ComponentFixture<ApprovalProcessPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalProcessPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalProcessPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
