import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdrequestComponent } from './idrequest.component';

describe('IdrequestComponent', () => {
  let component: IdrequestComponent;
  let fixture: ComponentFixture<IdrequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdrequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
