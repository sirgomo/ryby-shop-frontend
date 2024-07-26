import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedVariationListComponent } from './selected-variation-list.component';

describe('SelectedVariationListComponent', () => {
  let component: SelectedVariationListComponent;
  let fixture: ComponentFixture<SelectedVariationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectedVariationListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedVariationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
