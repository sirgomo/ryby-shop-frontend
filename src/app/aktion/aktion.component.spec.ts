import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AktionComponent } from './aktion.component';

describe('AktionComponent', () => {
  let component: AktionComponent;
  let fixture: ComponentFixture<AktionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AktionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AktionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
