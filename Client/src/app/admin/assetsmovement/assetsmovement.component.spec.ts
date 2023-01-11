import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsmovementComponent } from './assetsmovement.component';

describe('AssetsmovementComponent', () => {
  let component: AssetsmovementComponent;
  let fixture: ComponentFixture<AssetsmovementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetsmovementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetsmovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
