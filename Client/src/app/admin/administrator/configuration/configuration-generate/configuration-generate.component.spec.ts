import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationGenerateComponent } from './configuration-generate.component';

describe('ConfigurationGenerateComponent', () => {
  let component: ConfigurationGenerateComponent;
  let fixture: ComponentFixture<ConfigurationGenerateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationGenerateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
