import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdrequestAddComponent } from './idrequest-add.component';

describe('IdrequestAddComponent', () => {
  let component: IdrequestAddComponent;
  let fixture: ComponentFixture<IdrequestAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdrequestAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdrequestAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
