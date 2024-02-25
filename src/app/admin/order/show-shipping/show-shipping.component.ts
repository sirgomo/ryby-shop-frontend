import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { iShippingAddress } from 'src/app/model/iShippingAddress';

@Component({
  selector: 'app-show-shipping',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './show-shipping.component.html',
  styleUrl: './show-shipping.component.scss'
})
export class ShowShippingComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public readonly shippingAddres: iShippingAddress, private readonly dialRef: MatDialogRef<ShowShippingComponent>){}

  onCancel() {
    this.dialRef.close();
    }
}
