import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagemanagementPopupComponent } from './imagemanagement-popup.component';

describe('ImagemanagementPopupComponent', () => {
  let component: ImagemanagementPopupComponent;
  let fixture: ComponentFixture<ImagemanagementPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagemanagementPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagemanagementPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
