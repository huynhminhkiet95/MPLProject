import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetcodeComponent } from './assetcode.component';

describe('AssetcodeComponent', () => {
  let component: AssetcodeComponent;
  let fixture: ComponentFixture<AssetcodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetcodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
