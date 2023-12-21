import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { VariationsService } from '../../variations/variations.service';
import { CommonModule } from '@angular/common';
import { Observable, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-input-ebayimage',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, CommonModule, MatIconModule],
  templateUrl: './input-ebayimage.component.html',
  styleUrl: './input-ebayimage.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputEbayimageComponent {
  link: string = '';
  act$ = new Observable();
  constructor( private readonly dialRef: MatDialogRef<InputEbayimageComponent>, @Inject(MAT_DIALOG_DATA) private readonly data: any, private readonly variService: VariationsService,
  private snack: MatSnackBar) {}

  close() {
    const item = { link: this.link, id: this.data.sku}
    this.act$ = this.variService.saveEbayImageLink(item).pipe(tap(res => {
    if(res == null) {
      this.act$ = new Observable();
      return this.snack.open('Etwas ist sichefgelaufen, item wurde nicht gefunden!', 'Ok', { duration: 2000 })
    }


    return  this.dialRef.close(res);
    }))
  }
  closeDialog() {
    return this.dialRef.close(null);
  }
}
