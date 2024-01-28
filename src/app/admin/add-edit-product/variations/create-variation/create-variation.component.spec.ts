import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVariationComponent } from './create-variation.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ErrorComponent } from 'src/app/error/error.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { iProduct } from 'src/app/model/iProduct';
import { iProduktVariations } from 'src/app/model/iProduktVariations';
import { iLieferant } from 'src/app/model/iLieferant';
import { ErrorService } from 'src/app/error/error.service';
import { VariationsService } from '../variations.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';

describe('CreateVariationComponent', () => {
  let component: CreateVariationComponent;
  let fixture: ComponentFixture<CreateVariationComponent>;
  let prod: iProduct;
  let vari: iProduktVariations;
  let testController: HttpTestingController;

  beforeEach(() => {
    vari  = {
      sku: 'hjasgdaksjd',
      produkt: { id : 1},
      variations_name: 'hjdas',
      hint: '',
      value: 'asd',
      unit: 'dsad',
      image: '',
      price: 1,
      wholesale_price: 0,
      thumbnail: '',
      quanity: 10,
      quanity_sold: 1,
      quanity_sold_at_once: 1,
    };
    prod  = {
      id: 1,
      name: 'ajksdh as jkasdh ',
      sku: 'aklsdj',
      artid: 0,
      beschreibung: 'asjkdh asjkd hashd asjkhd asdd ',
      lieferant: {} as iLieferant,
      lagerorte: [],
      bestellungen: [],
      datumHinzugefuegt: '2022-01-10',
      kategorie: [],
      verfgbarkeit: 0,
      product_sup_id: '',
      ebay: 0,
      wareneingang: [],
      mehrwehrsteuer: 0,
      promocje: [],
      bewertung: [],
      eans: [],
      variations: [],
      produkt_image: '',
      shipping_costs: []
    };

    TestBed.configureTestingModule({
      imports: [CreateVariationComponent, CommonModule, ErrorComponent, MatFormFieldModule, FormsModule, MatInputModule, ReactiveFormsModule,
        MatButtonModule, HttpClientTestingModule, NoopAnimationsModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {prod, vari},
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: jest.fn(),
          }
        },
        VariationsService,
        ErrorService,

      ]
    });
    fixture = TestBed.createComponent(CreateVariationComponent);
    component = fixture.componentInstance;
    testController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should display the correct header for new variation creation', () => {
    component.form.get('sku')?.setValue('');
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.header h1').textContent).toContain('Neue Variations hinzufügen');
  });

  it('should display the correct header for variation editing', () => {
    component.form.get('sku')?.setValue('123');
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.header h1').textContent).toContain('Variations bearbeiten');
  });

  it('should call save method when save button is clicked', () => {
    jest.spyOn(component, 'save');
    const button = fixture.debugElement.nativeElement.querySelector('.acction button[color="accent"]');
    button.click();
    expect(component.save).toHaveBeenCalled();
  });

  it('should call abort method when cancel button is clicked', () => {
    jest.spyOn(component, 'abort');
    const button = fixture.debugElement.nativeElement.querySelector('.acction button[color="primary"]');
    button.click();
    expect(component.abort).toHaveBeenCalled();
  });

  it('should display error message when form is invalid and save is attempted', () => {
    component.form.get('variations_name')?.setValue('');
    component.form.get('value')?.setValue('');
    component.form.get('unit')?.setValue('');
    component.form.get('price')?.setValue(null);
    fixture.detectChanges();
    component.save();
    expect(component.error.message()).toContain('Nicht alle erforderlichen Felder sind ausgefüllt.');
  });

  it('should not send data if form is invalid', () => {
    component.form.get('variations_name')?.setValue('');
    component.save();
    expect(testController.expectNone('/api/variations')).toBeUndefined();
  });

  it('should update SKU on input', () => {
    const valueInput = component.form.get('value');
    const nameInput = component.form.get('variations_name');
    nameInput?.setValue('TestName');
    valueInput?.setValue('TestValue');
    component.updateVariationSku();
    expect(component.form.get('sku')?.value).toContain('TestName_TestValue');
  });

  it('should send data if form is valid', () => {
    jest.spyOn(component, 'save');
    component.form.get('variations_name')?.setValue('TestName');
    component.form.get('value')?.setValue('TestValue');
    component.form.get('unit')?.setValue('kg');
    component.form.get('price')?.setValue(10);
    fixture.detectChanges();
    const saveB = fixture.nativeElement.querySelector('#saveButt');
    saveB.click();
    fixture.detectChanges();
    const req = testController.expectOne(environment.api +'variation');
    expect(req.request.method).toEqual('POST');
    req.flush({}); // simulate response
    expect(component.ref.close).toHaveBeenCalled();
  });
});
