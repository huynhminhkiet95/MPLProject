import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnounceDetailComponent } from './announce-detail.component';

describe('AnnounceDetailComponent', () => {
  let component: AnnounceDetailComponent;
  let fixture: ComponentFixture<AnnounceDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnounceDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnounceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
