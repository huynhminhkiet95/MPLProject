import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagemanagementPopupImageDetailComponent } from './imagemanagement-popup-image-detail.component';

describe('ImagemanagementPopupImageDetailComponent', () => {
  let component: ImagemanagementPopupImageDetailComponent;
  let fixture: ComponentFixture<ImagemanagementPopupImageDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagemanagementPopupImageDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagemanagementPopupImageDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
