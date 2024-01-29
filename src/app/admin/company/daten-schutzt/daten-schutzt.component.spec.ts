import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatenSchutztComponent } from './daten-schutzt.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DatenSchutztComponent', () => {
  let component: DatenSchutztComponent;
  let fixture: ComponentFixture<DatenSchutztComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DatenSchutztComponent, HttpClientTestingModule]
    });
    fixture = TestBed.createComponent(DatenSchutztComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
