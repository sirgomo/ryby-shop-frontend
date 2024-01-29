import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgbComponent } from './agb.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AgbComponent', () => {
  let component: AgbComponent;
  let fixture: ComponentFixture<AgbComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AgbComponent, HttpClientTestingModule]
    });
    fixture = TestBed.createComponent(AgbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
