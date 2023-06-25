import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiferantsComponent } from './liferants.component';

describe('LiferantsComponent', () => {
  let component: LiferantsComponent;
  let fixture: ComponentFixture<LiferantsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LiferantsComponent]
    });
    fixture = TestBed.createComponent(LiferantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
