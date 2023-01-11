import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OffBoardNoticeComponent } from './off-board-notice.component';

describe('OffBoardNoticeComponent', () => {
  let component: OffBoardNoticeComponent;
  let fixture: ComponentFixture<OffBoardNoticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffBoardNoticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffBoardNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
