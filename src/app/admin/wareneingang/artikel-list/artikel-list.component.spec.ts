import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtikelListComponent } from './artikel-list.component';

describe('ArtikelListComponent', () => {
  let component: ArtikelListComponent;
  let fixture: ComponentFixture<ArtikelListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArtikelListComponent]
    });
    fixture = TestBed.createComponent(ArtikelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
