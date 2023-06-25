import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KategoriesComponent } from './kategories.component';

describe('KategoriesComponent', () => {
  let component: KategoriesComponent;
  let fixture: ComponentFixture<KategoriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KategoriesComponent]
    });
    fixture = TestBed.createComponent(KategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
