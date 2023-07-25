import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WareneingangComponent } from './wareneingang.component';

describe('WareneingangComponent', () => {
  let component: WareneingangComponent;
  let fixture: ComponentFixture<WareneingangComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WareneingangComponent]
    });
    fixture = TestBed.createComponent(WareneingangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
