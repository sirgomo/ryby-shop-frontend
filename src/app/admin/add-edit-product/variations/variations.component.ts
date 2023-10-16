import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VariationsService } from './variations.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { iProduktVariations } from 'src/app/model/iProduktVariations';
import { Observable } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { iProduct } from 'src/app/model/iProduct';

@Component({
  selector: 'app-variations',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatSelectModule, FormsModule, MatFormFieldModule, MatTableModule],
  templateUrl: './variations.component.html',
  styleUrls: ['./variations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VariationsComponent {
  @Input() product!: iProduct;
  variationsSig = toSignal(this.service.variations$, { initialValue: []});
  selectedVariation: iProduktVariations = {} as iProduktVariations;
  productVarations = signal<iProduktVariations[]>([]);
  columns : string[] = ['sk', 'name', 'val', 'image', 'hint', 'del'];
  constructor (private readonly service: VariationsService) {}

  addVariation() {
    console.log(this.selectedVariation);
  }
  addNeueVariation() {}
}
