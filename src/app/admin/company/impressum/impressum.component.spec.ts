import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpressumComponent } from './impressum.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ImpressumComponent', () => {
  let component: ImpressumComponent;
  let fixture: ComponentFixture<ImpressumComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ImpressumComponent, HttpClientTestingModule]
    });
    fixture = TestBed.createComponent(ImpressumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
