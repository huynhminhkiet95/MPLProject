import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetActivityDetailComponent } from './asset-activity-detail.component';

describe('AssetActivityDetailComponent', () => {
  let component: AssetActivityDetailComponent;
  let fixture: ComponentFixture<AssetActivityDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetActivityDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetActivityDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
