import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineTrainingAddNewComponent } from './online-training-add-new.component';

describe('OnlineTrainingAddNewComponent', () => {
  let component: OnlineTrainingAddNewComponent;
  let fixture: ComponentFixture<OnlineTrainingAddNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineTrainingAddNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineTrainingAddNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
