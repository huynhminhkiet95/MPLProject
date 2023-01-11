import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetActivityComponent } from './asset-activity.component';

describe('AssetActivityComponent', () => {
  let component: AssetActivityComponent;
  let fixture: ComponentFixture<AssetActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
