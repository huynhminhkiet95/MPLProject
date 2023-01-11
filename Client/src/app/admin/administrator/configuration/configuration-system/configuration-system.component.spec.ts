import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationSystemComponent } from './configuration-system.component';

describe('ConfigurationSystemComponent', () => {
  let component: ConfigurationSystemComponent;
  let fixture: ComponentFixture<ConfigurationSystemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationSystemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
