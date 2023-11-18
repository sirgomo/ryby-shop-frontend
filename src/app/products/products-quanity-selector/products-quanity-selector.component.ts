import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelperService } from 'src/app/helper/helper.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-products-quanity-selector',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, FormsModule, MatSelectModule],
  templateUrl: './products-quanity-selector.component.html',
  styleUrl: './products-quanity-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsQuanitySelectorComponent implements OnInit{
  itemProSite = [10, 20, 30, 40, 50, 100];
  current = this.itemProSite[0];
  constructor(public readonly helper: HelperService) {}
  ngOnInit(): void {
    this.helper.artikelProSiteSig.set(this.current);
  }

  setItemProSite(item: number) {
    this.helper.artikelProSiteSig.set(item);
  }
}
