import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StdcodeComponent } from './stdcode.component';

describe('StdcodeComponent', () => {
  let component: StdcodeComponent;
  let fixture: ComponentFixture<StdcodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StdcodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StdcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
