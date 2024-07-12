import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EbayCategoryComponent } from './ebay-category.component';

describe('EbayCategoryComponent', () => {
  let component: EbayCategoryComponent;
  let fixture: ComponentFixture<EbayCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EbayCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EbayCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
