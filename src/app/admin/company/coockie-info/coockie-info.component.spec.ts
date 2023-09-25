import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoockieInfoComponent } from './coockie-info.component';

describe('CoockieInfoComponent', () => {
  let component: CoockieInfoComponent;
  let fixture: ComponentFixture<CoockieInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoockieInfoComponent]
    });
    fixture = TestBed.createComponent(CoockieInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
