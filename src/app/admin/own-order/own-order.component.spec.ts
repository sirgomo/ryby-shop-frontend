import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnOrderComponent } from './own-order.component';

describe('OwnOrderComponent', () => {
  let component: OwnOrderComponent;
  let fixture: ComponentFixture<OwnOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnOrderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OwnOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
