import { ChangeDetectionStrategy, Component, Inject, Optional, signal, effect } from '@angular/core';
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
import { firstValueFrom } from 'rxjs';
import { ErrorComponent } from 'src/app/error/error.component';
import { ErrorService } from 'src/app/error/error.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HelperService } from 'src/app/helper/helper.service';
import { iProduct } from 'src/app/model/iProduct';
import { SearchArtikelComponent } from './search-artikel/search-artikel.component';

@Component({
  selector: 'app-add-edit-protocol',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, MatButtonModule, MatIconModule, MatInputModule, MatSelectModule,
     MatDatepickerModule, MatMomentDateModule, ErrorComponent, MatProgressSpinnerModule, SearchArtikelComponent],
  templateUrl: './add-edit-protocol.component.html',
  styleUrl: './add-edit-protocol.component.scss',
  providers: [provideMomentDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEditProtocolComponent  {

  prod = signal<iProduct| undefined>(undefined)

  protocol!: FormGroup;
  select_type = Object.values(Destruction_Protocol_Type);
  select_status = Object.values(Destruction_Protocol_Status);
  constructor(private service: DestructionProtocolService, @Optional() @Inject(MAT_DIALOG_DATA) public readonly data: iDestructionProtocol,
   private fb: FormBuilder, readonly dialRef: MatDialogRef<AddEditProtocolComponent>, public readonly errorService: ErrorService, public readonly helperService: HelperService) {
      this.protocol = this.fb.group({
        id: [data?.id || null],
        produktId: [data?.produktId, [Validators.required]],
        variationId: [data?.variationId, [Validators.required]],
        produkt_name: [data?.produkt_name, [Validators.required]],
        quantity: [data ? data.quantity / data.quantity_at_once : 0, [Validators.required]],
        type: [data?.type, [Validators.required]],
        destruction_date: [data?.destruction_date, [Validators.required]],
        responsible_person: [data?.responsible_person, [Validators.required]],
        status: [data?.status, [Validators.required]],
        description: [data?.description, []]
      });
      effect(() => {
        if(this.prod()) {
          this.protocol.get('produktId')?.patchValue(this.prod()?.id);
          this.protocol.get('variationId')?.patchValue(this.prod()?.variations[0].sku);
          this.protocol.get('produkt_name')?.patchValue(this.prod()?.name);
        } else {
          if(!data) {
            this.protocol.get('produktId')?.patchValue('');
            this.protocol.get('variationId')?.patchValue('');
            this.protocol.get('produkt_name')?.patchValue('');
          }
        }

      })
  }

  onSubmit() {
    if(this.protocol.valid) {
      if(this.data) {
        this.service.actionSig.set({ item: this.protocol.value, action: ' edit'});
      }
      else {
        this.service.actionSig.set({ item: this.protocol.value, action: 'add'})
      }

      firstValueFrom(this.service.litems$);
    //this.dialRef.close();
    }
  }
  close() {
    this.dialRef.close();
  }
  reset() {
    this.prod.set(undefined);
  }
}
