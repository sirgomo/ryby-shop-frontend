import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowUrlopComponent } from './show-urlop.component';

describe('ShowUrlopComponent', () => {
  let component: ShowUrlopComponent;
  let fixture: ComponentFixture<ShowUrlopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowUrlopComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowUrlopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
