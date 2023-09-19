import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatenSchutztComponent } from './daten-schutzt.component';

describe('DatenSchutztComponent', () => {
  let component: DatenSchutztComponent;
  let fixture: ComponentFixture<DatenSchutztComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DatenSchutztComponent]
    });
    fixture = TestBed.createComponent(DatenSchutztComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
