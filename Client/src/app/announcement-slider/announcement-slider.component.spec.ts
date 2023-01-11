import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncementSliderComponent } from './announcement-slider.component';

describe('AnnouncementSliderComponent', () => {
  let component: AnnouncementSliderComponent;
  let fixture: ComponentFixture<AnnouncementSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnouncementSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnouncementSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
