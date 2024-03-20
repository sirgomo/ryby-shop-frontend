import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellItemComponent } from './sell-item.component';

describe('SellItemComponent', () => {
  let component: SellItemComponent;
  let fixture: ComponentFixture<SellItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SellItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
