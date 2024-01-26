import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { ProductComponent } from './product.component';
import { ProductService } from './product.service';
import { iProduct } from 'src/app/model/iProduct';


describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  let productService: ProductService;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductComponent, MatDialogModule],
      providers: [
        { provide: ProductService, useValue: { productsSig: of([]), deleteProduct: () => of() } },
        { provide: MatDialog, useValue: { open: () => {} } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    dialog = TestBed.inject(MatDialog);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open dialog when addEditProduct is called', () => {
    jest.spyOn(dialog, 'open');
    component.addEditProduct();
    expect(dialog.open).toHaveBeenCalled();
  });

  it('should open confirmation dialog and call deleteProduct when deleteProdukt is called', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    jest.spyOn(productService, 'deleteProduct').mockReturnValue(of());
    const prod: iProduct = { id: 1, name: 'Test Product' } as iProduct;
    component.deleteProdukt(prod);
    expect(window.confirm).toHaveBeenCalled();
    expect(productService.deleteProduct).toHaveBeenCalledWith(prod.id);
  });
});
