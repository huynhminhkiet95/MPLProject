import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeboardComponent } from './welcomeboard.component';

describe('WelcomeboardComponent', () => {
  let component: WelcomeboardComponent;
  let fixture: ComponentFixture<WelcomeboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomeboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
