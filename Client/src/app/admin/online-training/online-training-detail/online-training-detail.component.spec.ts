import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineTrainingDetailComponent } from './online-training-detail.component';

describe('OnlineTrainingDetailComponent', () => {
  let component: OnlineTrainingDetailComponent;
  let fixture: ComponentFixture<OnlineTrainingDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineTrainingDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineTrainingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
