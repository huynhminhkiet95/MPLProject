import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationLoginComponent } from './configuration-login.component';

describe('ConfigurationLoginComponent', () => {
  let component: ConfigurationLoginComponent;
  let fixture: ComponentFixture<ConfigurationLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
