import { ChangeDetectionStrategy, Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { iKategorie } from 'src/app/model/iKategorie';
import { KategorieService } from '../kategories/kategorie.service';
import { combineLatest, tap } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-add-edit-kategorie',
  templateUrl: './add-edit-kategorie.component.html',
  styleUrls: ['./add-edit-kategorie.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule, MatFormFieldModule, MatSelectModule, CommonModule, MatInputModule, MatButtonModule]
})
export class AddEditKategorieComponent {
  kategorieForm: FormGroup;
  kategorie$ = this.katService.kategorie$;
  constructor(
    public dialogRef: MatDialogRef<AddEditKategorieComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: iKategorie | null,
    private readonly formB: FormBuilder,
    private katService: KategorieService
  ) {
    this.kategorieForm = this.formB.group({
      id: [this.data?.id || null],
      parent_id: [this.data?.parent_id || null],
      name: [this.data?.name || '', Validators.required]
    });
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {

    if (this.kategorieForm.valid && this.data === null) {
      const formData = this.kategorieForm.value as iKategorie;

      this.kategorie$ = this.katService.createCategory(formData).pipe(tap(res => {
        if(res)
        this.dialogRef.close();
      }));

    }
    if(this.kategorieForm.valid && this.data !== null) {
      const formData = this.kategorieForm.value as iKategorie;
      if(this.data.products !== null)
        formData.products = this.data.products;

        this.kategorie$ = this.katService.updateCategory(formData.id, formData).pipe(tap(res => {
          if(res)
          this.dialogRef.close();
        }))
    }
  }

}
