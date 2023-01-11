import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncePopupComponent } from './announce-popup.component';

describe('AnnouncePopupComponent', () => {
  let component: AnnouncePopupComponent;
  let fixture: ComponentFixture<AnnouncePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnouncePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnouncePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
