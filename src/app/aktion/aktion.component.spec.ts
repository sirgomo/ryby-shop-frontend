import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AktionComponent } from './aktion.component';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule, MomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ErrorComponent } from '../error/error.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';
import { iKategorie } from '../model/iKategorie';
import { iProduct } from '../model/iProduct';
import { iAktion } from '../model/iAktion';
import { AktionService } from './aktion.service';
import { KategorieService } from '../admin/kategories/kategorie.service';
import { By } from '@angular/platform-browser';


describe('AktionComponent', () => {
  let component: AktionComponent;
  let fixture: ComponentFixture<AktionComponent>;
  let testCont: HttpTestingController;
  let cat: iKategorie[];
  let act: iAktion[];

  beforeEach(async () => {
    act = [{
      id: 1,
      aktion_key: 'piwko',
      produkt: [{id: 1} as iProduct],
      startdatum: '',
      enddatum: '',
      rabattProzent: 10
    }];
    cat = [ {
      id: 1,
      parent_id: null,
      name: '',
      products: [{id: 1} as iProduct]
    }];
    await TestBed.configureTestingModule({
      imports: [AktionComponent, CommonModule, ErrorComponent, MatButtonModule, FormsModule, ReactiveFormsModule,
        MatInputModule, MatFormFieldModule, MatIconModule, MomentDateModule, MatDatepickerModule, MatSelectModule,
        HttpClientTestingModule, NoopAnimationsModule, MatMomentDateModule],
      providers: [DatePipe, AktionService, KategorieService],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AktionComponent);
    testCont = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;

  });

  afterEach(() => {
    testCont.verify();
  })
  it('should create and loat initial data', () => {
    fixture.detectChanges();
    initalRequests();

    expect(component).toBeTruthy();
    expect(component.katgorySig()).toEqual(cat);
  });
  it('should add a new aktion', () => {
    jest.spyOn(component, 'addAktion');
    fixture.detectChanges();
    initalRequests();
    const initialLength = component.aktions.length;
    const button = fixture.nativeElement.querySelectorAll('button')[0];
    button.click();
    //on action its load from server, second is click button
    expect(component.addAktion).toHaveBeenCalledTimes(2);
    expect(component.aktions.length).toBeGreaterThan(initialLength);
  });

  it('should call save method with new aktion data', () => {
    jest.spyOn(component, 'save');
    fixture.detectChanges();
    initalRequests();

    component.aktions.at(0).get('id')?.patchValue('2');
    component.aktions.at(0).get('aktion_key')?.patchValue('piwkooo');
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('#save')).nativeElement;
    button.click();

    expect(component.save).toHaveBeenCalledTimes(1);
    const requ = testCont.expectOne(environment.api+'aktion/2');
    expect(requ.request.method).toBe('PUT');

    expect(requ.request.body).toEqual({ id:'2',
      aktion_key: 'piwkooo',
      produkt: {id: 1},
      startdatum: '',
      enddatum: '',
      rabattProzent: 10})
    requ.flush({affected: 1});
  });

  it('should delete an aktion', () => {
    jest.spyOn(component, 'delete');
    fixture.detectChanges();
    initalRequests();
    const butt = fixture.nativeElement.querySelector('#del');
    butt.click();

    expect(component.delete).toHaveBeenCalledWith(0, {
      id: 1,
      aktion_key: 'piwko',
      produkt: {id: 1},
      startdatum: '',
      enddatum: '',
      rabattProzent: 10
    });

    const requ = testCont.expectOne(environment.api+'aktion/1');
    expect(requ.request.method).toBe('DELETE');
    requ.flush({affected: 1});
  });

 function initalRequests() {
  const requ2 = testCont.expectOne(environment.api+'aktion');
  expect(requ2.request.method).toBe('GET');
    const requ = testCont.expectOne(environment.api+'kategorie/products');
    expect(requ.request.method).toBe('GET');
    fixture.detectChanges();
    requ.flush(cat);
    requ2.flush(act);
  fixture.detectChanges();
  expect(component.katgorySig()).toEqual(cat);

  }
});
