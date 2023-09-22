import { ChangeDetectionStrategy, Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { iLieferant } from 'src/app/model/iLieferant';
import { LiferantsService } from '../liferants/liferants.service';
import { Observable, tap } from 'rxjs';
import { ErrorService } from 'src/app/error/error.service';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from 'src/app/error/error.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-edit-liferant',
  templateUrl: './add-edit-liferant.component.html',
  styleUrls: ['./add-edit-liferant.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ErrorComponent, MatIconModule, MatButtonModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, MatInputModule]
})
export class AddEditLiferantComponent implements OnInit{
  lieferantForm: FormGroup;
  actt$ = new Observable();
  constructor(
    private formBuilder: FormBuilder,
    private liferantsService: LiferantsService,
    public dialogRef: MatDialogRef<AddEditLiferantComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: iLieferant,
    public error: ErrorService,
  ) {
    this.lieferantForm = this.formBuilder.group({
      id: [data ? data.id : undefined],
      name: [data ? data.name : '', [Validators.required, Validators.pattern(/^[a-zA-Z ]{5,40}$/)]],
      email: [data ? data.email : '', [Validators.required, Validators.email]],
      telefon: [data ? data.telefon : '', Validators.required],
      adresse: this.formBuilder.group({
        strasse: [data && data.adresse ? data.adresse.strasse : '', Validators.required],
        hausnummer: [data && data.adresse ? data.adresse.hausnummer : '', Validators.required],
        stadt: [data && data.adresse ? data.adresse.stadt : '', Validators.required],
        postleitzahl: [data && data.adresse ? data.adresse.postleitzahl : '', Validators.required],
        land: [data && data.adresse ? data.adresse.land : '', Validators.required]
      }),
      steuernummer: [data ? data.steuernummer : '', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\/]{6,14}$/)]],
      bankkontonummer: [data ? data.bankkontonummer : '', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\/]{10,30}$/)]],
      ansprechpartner: [data ? data.ansprechpartner : '', Validators.required],
      zahlart: [data ? data.zahlart : '', Validators.required],
      umsatzsteuerIdentifikationsnummer: [data ? data.umsatzsteuerIdentifikationsnummer : '', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\/-]{8,15}$/)]]
    });
  }
  ngOnInit(): void {
    if(this.data && this.data.id)
    this.actt$ = this.liferantsService.getLieferantById(this.data.id).pipe(tap((res) => {
      this.lieferantForm.patchValue(res);
    }))
  }

  saveLieferant(): void {
    if (this.lieferantForm.valid) {
      const lieferant: iLieferant = this.lieferantForm.value;
      if (this.data && this.data.id) {
       this.actt$ = this.liferantsService.updateLieferant(lieferant).pipe(tap((res) => {
        if(res.id === this.data.id)
             this.closeDialog();
       }));
      } else {
        this.actt$ = this.liferantsService.createLieferant(lieferant).pipe(tap((res) => {
          if(res.id)
             this.closeDialog();
        }));
      }
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
