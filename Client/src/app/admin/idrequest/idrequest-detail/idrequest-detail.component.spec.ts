import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdrequestDetailComponent } from './idrequest-detail.component';

describe('IdrequestDetailComponent', () => {
  let component: IdrequestDetailComponent;
  let fixture: ComponentFixture<IdrequestDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdrequestDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdrequestDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
