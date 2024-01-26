import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { CompanyService } from '../../company/company.service';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { iUrlop } from 'src/app/model/iUrlop';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-urlop',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatInputModule, FormsModule, ReactiveFormsModule, MatDatepickerModule, MatFormFieldModule],
  templateUrl: './add-urlop.component.html',
  styleUrl: './add-urlop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddUrlopComponent {
  act$ = new Observable();
  urlopForm: FormGroup;
  constructor(private readonly companyService: CompanyService, public readonly dialogRef: MatDialogRef<AddUrlopComponent>, @Inject(MAT_DIALOG_DATA) public data: iUrlop, private readonly fb: FormBuilder) {
    this.urlopForm = this.fb.group({
      id: this.data.id,
      urlop_from: [new Date()],
      urlop_to: [new Date()],
    })
  }
  save() {
    const item: iUrlop = {} as iUrlop;
   item.id = this.data.id;
   item.is_in_urlop = true;
   item.urlop_from = new Date(this.urlopForm.get('urlop_from')?.getRawValue());
   item.urlop_to = new Date(this.urlopForm.get('urlop_to')?.getRawValue());
    this.act$ = this.companyService.setUrlop(item).pipe(tap((res) => {
      if(res.affected === 1) {
        this.dialogRef.close(item);
      }
    }))
  }
}
