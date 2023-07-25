import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtikelGebuchtComponent } from './artikel-gebucht.component';

describe('ArtikelGebuchtComponent', () => {
  let component: ArtikelGebuchtComponent;
  let fixture: ComponentFixture<ArtikelGebuchtComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArtikelGebuchtComponent]
    });
    fixture = TestBed.createComponent(ArtikelGebuchtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
