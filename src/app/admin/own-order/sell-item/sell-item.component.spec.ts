import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorService } from 'src/app/error/error.service';
import { SellItemComponent } from './sell-item.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { iProduktVariations } from 'src/app/model/iProduktVariations';

describe('SellItemComponent', () => {
  let component: SellItemComponent;
  let fixture: ComponentFixture<SellItemComponent>;
  let httpTestingController: HttpTestingController;
  let mockDialogRef: MatDialogRef<SellItemComponent>;
  let mockErrorService: ErrorService;

  const mockProduct = {
    id: 1,
    name: 'Test Product',
    sku: 'TP123',
    variations: [
      { sku: 'VAR1', variations_name: 'Variation 1', price: 10 },
      { sku: 'VAR2', variations_name: 'Variation 2', price: 20 }
    ],
    wareneingang: [
      {
        product_variation: [
          { sku: 'VAR1', price_in_euro: 8 },
          { sku: 'VAR2', price_in_euro: 18 }
        ]
      }
    ],
    mehrwehrsteuer: 19
  };

  beforeEach(async () => {
    mockDialogRef = { close: jest.fn() } as any;
    mockErrorService = { newMessage: jest.fn() } as any;

    await TestBed.configureTestingModule({
      imports: [
        SellItemComponent,
        HttpClientTestingModule,
        FormsModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatTableModule,
        MatIconModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockProduct },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: ErrorService, useValue: mockErrorService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SellItemComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize product variations and quantities correctly', () => {
    expect(component.products_variations.length).toBe(2);
    expect(component.quanity.length).toBe(2);
    expect(component.price.length).toBe(2);
    expect(component.quanity).toEqual([0, 0]);
    expect(component.price).toEqual([10, 20]);
  });

  it('should calculate item price correctly', () => {
    const price1 = component.getItemPrice(mockProduct.variations[0] as unknown as iProduktVariations);
    const price2 = component.getItemPrice(mockProduct.variations[1] as unknown as iProduktVariations);

    expect(price1).toBe('9.52');
    expect(price2).toBe('21.42');
  });

  it('should add item to products correctly', () => {
    component.quanity[0] = 2;
    component.addItem(0);

    expect(component.products.length).toBe(1);
    expect(component.products[0].variations[0].quanity).toBe(2);
  });

  it('should not add item with quantity less than 1', () => {
    component.quanity[0] = 0;
    component.addItem(0);

    expect(component.products.length).toBe(0);
  });

  it('should close dialog with null on abort', () => {
    component.abort();
    expect(mockDialogRef.close).toHaveBeenCalledWith(null);
  });

  it('should close dialog with products on save', () => {
    component.quanity[0] = 2;
    component.addItem(0);
    component.save();

    expect(mockDialogRef.close).toHaveBeenCalledWith(component.products);
  });

  it('should show error message if item price not found', () => {
    component.getItemPrice({ sku: 'INVALID', variations_name: '', price: 0 } as any);
    expect(mockErrorService.newMessage).toHaveBeenCalledWith('Preis for item wurde nicht gefunden !');
  });
});
