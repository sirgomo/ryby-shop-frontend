import { ChangeDetectionStrategy, Component, Inject, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarehouseService } from '../warehouse.service';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { iLager } from 'src/app/model/iLager';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Observable, tap } from 'rxjs';
import { ErrorService } from 'src/app/error/error.service';
import { ErrorComponent } from 'src/app/error/error.component';

@Component({
  selector: 'app-add-edit-warehouse',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, ErrorComponent],
  templateUrl: './add-edit-warehouse.component.html',
  styleUrls: ['./add-edit-warehouse.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEditWarehouseComponent {
  lagerForm: FormGroup;
  act$ = new Observable();
  constructor(private readonly formBuilder: FormBuilder, private readonly service: WarehouseService, @Optional() @Inject(MAT_DIALOG_DATA) public data: iLager, public error: ErrorService,
  private readonly ref: MatDialogRef<AddEditWarehouseComponent>) {
    this.lagerForm = this.formBuilder.group({
      id: [this.data ? this.data.id : undefined],
      name: [this.data ? this.data.name : '', Validators.required],
      adresse: [this.data ? this.data.adresse : '', Validators.required],

    });
   }



  onSubmit() {

    if (this.lagerForm.valid) {
      const item = {} as iLager;
      Object.assign(item, this.lagerForm.value);
      if(!this.lagerForm.get('id')?.value)
        return this.act$ = this.service.createWarehouse(item).pipe(tap(res => {
      Object.assign(this.lagerForm, res);
      this.ref.close();
      }));
      if(this.lagerForm.get('id')?.value) {
        console.log(this.lagerForm.get('id'))
        return this.act$ = this.service.updateWarehouse(item);
      }

    }
    return;
  }
}
