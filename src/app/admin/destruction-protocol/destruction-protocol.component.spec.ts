import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestructionProtocolComponent } from './destruction-protocol.component';

describe('DestructionProtocolComponent', () => {
  let component: DestructionProtocolComponent;
  let fixture: ComponentFixture<DestructionProtocolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DestructionProtocolComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DestructionProtocolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
