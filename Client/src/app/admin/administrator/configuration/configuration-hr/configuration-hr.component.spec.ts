import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationHrComponent } from './configuration-hr.component';

describe('ConfigurationHrComponent', () => {
  let component: ConfigurationHrComponent;
  let fixture: ComponentFixture<ConfigurationHrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationHrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationHrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
