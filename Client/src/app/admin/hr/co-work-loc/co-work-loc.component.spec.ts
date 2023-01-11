import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { COWorkLocComponent } from './co-work-loc.component';

describe('COWorkLocComponent', () => {
  let component: COWorkLocComponent;
  let fixture: ComponentFixture<COWorkLocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ COWorkLocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(COWorkLocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
