import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ShowShippingComponent } from './show-shipping.component';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ShowShippingComponent', () => {
  let component: ShowShippingComponent;
  let fixture: ComponentFixture<ShowShippingComponent>;
  let mockDialogRef: MatDialogRef<ShowShippingComponent>;
  let dialRef: MatDialogRef<ShowShippingComponent>;

  const mockShippingAddress = {
    shipping_name: 'John Doe',
    strasse: 'Main St',
    hausnummer: '123',
    stadt: 'Sample City',
    postleitzahl: '12345',
    land: 'Sample Country'
  };

  beforeEach(async () => {


    await TestBed.configureTestingModule({
      imports: [ShowShippingComponent, NoopAnimationsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockShippingAddress },
        { provide: MatDialogRef, useValue: { close: jest.fn() } }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowShippingComponent);
    component = fixture.componentInstance;
    dialRef = fixture.debugElement.injector.get(MatDialogRef);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display shipping address details', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('p:nth-child(2)')?.textContent).toContain('John Doe');
    expect(compiled.querySelector('p:nth-child(3)')?.textContent).toContain('Main St 123');
    expect(compiled.querySelector('p:nth-child(4)')?.textContent).toContain('Sample City');
    expect(compiled.querySelector('p:nth-child(5)')?.textContent).toContain('12345');
    expect(compiled.querySelector('p:nth-child(6)')?.textContent).toContain('Sample Country');
  });

  it('should close the dialog when cancel button is clicked', () => {
    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', null);

    expect(dialRef.close).toHaveBeenCalled();
  });
});