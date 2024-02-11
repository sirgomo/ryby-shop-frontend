import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { AktionService } from './aktion.service';
import { ErrorService } from '../error/error.service';
import { ErrorComponent } from '../error/error.component';
import { MatButtonModule } from '@angular/material/button';
import { iAktion } from '../model/iAktion';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { KategorieService } from '../admin/kategories/kategorie.service';
import { iKategorie } from '../model/iKategorie';
import { iProduct } from '../model/iProduct';


@Component({
  selector: 'app-aktion',
  standalone: true,
  imports: [CommonModule, ErrorComponent, MatButtonModule, FormsModule, ReactiveFormsModule,
     MatInputModule, MatFormFieldModule, MatIconModule, MomentDateModule, MatDatepickerModule, MatSelectModule],
  templateUrl: './aktion.component.html',
  styleUrl: './aktion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AktionComponent {

  aktionForm: FormGroup;
  katgorySig = toSignal(this.katgorieService.getKategorieWithArtikles());
  constructor(public readonly servis: AktionService, public errorService: ErrorService, private readonly fb: FormBuilder,
     public readonly katgorieService: KategorieService, private detRef: ChangeDetectorRef) {
    this.aktionForm = this.fb.group({
      aktions: this.fb.array([]),
    });
    this.servis.aktCompo = this;
  }
  addAktion( aktion?: iAktion) {
   const item = this.fb.group({
    id: aktion && aktion.id ? aktion.id : undefined,
    aktion_key: aktion ? aktion.aktion_key : [''],
    produkt: aktion ? aktion.produkt : [[]],
    startdatum: aktion ? aktion.startdatum : undefined,
    enddatum: aktion ? aktion.enddatum : undefined,
    rabattProzent: aktion ? aktion.rabattProzent : [0],
   });
   this.aktions.push(item);

  }
  get aktions() {
    return this.aktionForm.controls['aktions'] as FormArray;
  }
  save(item: AbstractControl<any,any>) {
    if(item.valid)
      this.servis.actionSig.set({item: item.value, action: 'add'});
  }
  delete(index: number, item: iAktion) {
    this.servis.actionSig.set({item: item, action: 'delete'});
  }
  selectfromKategorie(index: number,item: AbstractControl<any,any>, selectd: any) {
    const kategiries =  selectd.value as iKategorie[];
    let currentProd: iProduct[] = [];
    if(kategiries.length > 1)
    kategiries.forEach((tmp) => {
      currentProd = [...currentProd, ...tmp.products];
    });
    const items = [...new Set(currentProd)];
    item.get('produkt')?.patchValue(items);
  }
  reloadAktions(data: iAktion[]) {

    while (this.aktions.length != 0)
      this.aktions.removeAt(0);

    data.forEach((item) => {
      this.addAktion(item);
    })
    this.detRef.detectChanges();
  }
}
