import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from 'src/app/user/user.service';
import { OrdersService } from 'src/app/orders/orders.service';
import { ProductService } from '../product/product.service';
import { OwnOrderComponent } from './own-order.component';
import { iUserData } from 'src/app/model/iUserData';
import { of } from 'rxjs';
import { ErrorService } from 'src/app/error/error.service';
import { iProduct } from 'src/app/model/iProduct';
import { JwtModule } from '@auth0/angular-jwt';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('OwnOrderComponent', () => {
  let component: OwnOrderComponent;
  let fixture: ComponentFixture<OwnOrderComponent>;
  let httpTestingController: HttpTestingController;
  let userService: UserService;
  let ordersService: OrdersService;
  let productService: ProductService;
  let errorService: ErrorService;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, MatSnackBarModule, OwnOrderComponent, JwtModule.forRoot({}), NoopAnimationsModule],
      providers: [UserService, OrdersService, ProductService, ErrorService, MatDialog]
    }).compileComponents();

    fixture = TestBed.createComponent(OwnOrderComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    userService = TestBed.inject(UserService);
    ordersService = TestBed.inject(OrdersService);
    productService = TestBed.inject(ProductService);
    errorService = TestBed.inject(ErrorService);
    dialog = fixture.debugElement.injector.get(MatDialog);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user details on init', async () => {
    const mockUserData: iUserData = { id: 1, name: 'Test User', role: 'ADMIN' } as unknown as iUserData;
    jest.spyOn(userService, 'getUserDetails').mockReturnValue(of(mockUserData));

    await component.ngOnInit();

    expect(userService.getUserDetails).toHaveBeenCalled();
    userService.getUserDetails().subscribe(data => {
      expect(data).toEqual(mockUserData);
    });

  });

  it('should add item to order', async () => {
    const mockProduct: iProduct = { id: 1, name: 'Test Product', artid: 'A1', verfgbarkeit: 1 } as unknown as iProduct;
    const mockDialogData = [{ id: 2, name: 'Test Product 2', artid: 'A2', verfgbarkeit: 1 } as unknown as iProduct];
    jest.spyOn(productService, 'getProduktWithBuyPrice').mockReturnValue(of(mockDialogData));
    const dial = jest.spyOn(dialog, 'open').mockReturnValue({
      afterClosed: () => of(mockDialogData)
    } as any);

    await component.addItemToOrder(mockProduct);
    expect(productService.getProduktWithBuyPrice).toHaveBeenCalled();
    expect(dialog.open).toHaveBeenCalled();

    expect(component.products).toContain(mockDialogData[0]);
    expect(component.itemsCountSig()).toBe(1);
  });

  it('should handle add item error', async () => {
    const mockProduct: iProduct = { id: null, name: 'Test Product', artid: 'A1', verfgbarkeit: 1 } as unknown as iProduct;
    const errorSpy = jest.spyOn(errorService, 'newMessage');

    await component.addItemToOrder(mockProduct);

    expect(errorSpy).toHaveBeenCalledWith('Es gibt kein Porduct id!');
  });

  it('should save order', async () => {
    const mockUserData: iUserData = { id: 1, name: 'Test', role: 'ADMIN' } as unknown as iUserData;
    const mockProduct: iProduct = { id: 1, name: 'Test Product', artid: 'A1', verfgbarkeit: 1 } as unknown as iProduct;
    const mockOrderResponse = { status: 200 } as any;
    jest.spyOn(userService, 'getUserDetails').mockReturnValue(of(mockUserData));
    jest.spyOn(ordersService, 'createOwnOrder').mockReturnValue(of(mockOrderResponse));
    component.products = [mockProduct];
    await component.ngOnInit();
    fixture.detectChanges();

    expect(userService.getUserDetails).toHaveBeenCalled();

    await component.saveOrder();

    expect(ordersService.createOwnOrder).toHaveBeenCalled();
  });

  it('should handle save order with no products', async () => {
    component.products = [];
    const ordersServiceSpy = jest.spyOn(ordersService, 'createOwnOrder');

    await component.saveOrder();

    expect(ordersServiceSpy).not.toHaveBeenCalled();
  });

  it('should remove product from order', () => {
    const mockProduct: iProduct = { id: 1, name: 'Test Product', artid: 'A1', verfgbarkeit: 1 } as unknown as iProduct;
    component.products = [mockProduct];
    const snackSpy = jest.spyOn(component['snack'], 'open');

    component.removeProduct(0);

    expect(component.products).toHaveLength(0);
    expect(snackSpy).toHaveBeenCalledWith('Produkt wurde gelöscht', 'OK', { duration: 1500 });
  });

  it('should clear all products', () => {
    const mockProduct: iProduct = { id: 1, name: 'Test Product', artid: 'A1', verfgbarkeit: 1 } as unknown as iProduct;
    component.products = [mockProduct];
    component.removeProduct(-2);

    expect(component.products).toHaveLength(0);
  });
});
