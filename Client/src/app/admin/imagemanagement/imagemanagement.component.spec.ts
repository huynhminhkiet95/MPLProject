import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagemanagementComponent } from './imagemanagement.component';

describe('ImagemanagementComponent', () => {
  let component: ImagemanagementComponent;
  let fixture: ComponentFixture<ImagemanagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagemanagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagemanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
