import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HtsDevicesComponent } from './hts-devices.component';

describe('HtsDevicesComponent', () => {
  let component: HtsDevicesComponent;
  let fixture: ComponentFixture<HtsDevicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HtsDevicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HtsDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
