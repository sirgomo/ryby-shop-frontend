import { Component, Inject, Optional } from '@angular/core';
import { DestructionProtocolService } from '../destruction-protocol.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule, provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Destruction_Protocol_Status, Destruction_Protocol_Type, iDestructionProtocol } from 'src/app/model/iDestructionProtocol';

@Component({
  selector: 'app-add-edit-protocol',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, MatButtonModule, MatIconModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatMomentDateModule],
  templateUrl: './add-edit-protocol.component.html',
  styleUrl: './add-edit-protocol.component.scss',
  providers: [provideMomentDateAdapter()]
})
export class AddEditProtocolComponent {

  protocol!: FormGroup;
  select_type = Object.values(Destruction_Protocol_Type);
  select_status = Object.values(Destruction_Protocol_Status);
  constructor(private service: DestructionProtocolService, @Optional() @Inject(MAT_DIALOG_DATA)  data: iDestructionProtocol,
   private fb: FormBuilder, readonly dialRef: MatDialogRef<AddEditProtocolComponent>) {
      this.protocol = this.fb.group({
        id: [data?.id || null],
        produktId: [data?.produktId, [Validators.required]],
        variationId: [data?.variationId, [Validators.required]],
        produkt_name: [data?.produkt_name, [Validators.required]],
        quantity: [data?.quantity, [Validators.required]],
        type: [data?.type, [Validators.required]],
        destruction_date: [data?.destruction_date, [Validators.required]],
        responsible_person: [data?.responsible_person, [Validators.required]],
        status: [data?.status, [Validators.required]],
        description: [data?.description, []]
      });

  }
  onSubmit() {
    console.log(this.protocol.value)
  }
  close() {
    this.dialRef.close();
  }
}
