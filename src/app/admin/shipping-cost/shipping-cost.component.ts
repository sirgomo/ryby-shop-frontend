import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShippingCostService } from './shipping-cost.service';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { IShippingCost } from 'src/app/model/iShippingCost';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-shipping-cost',
  standalone: true,
  imports: [CommonModule, MatTableModule, FormsModule, ReactiveFormsModule, MatInputModule, MatIconModule, MatButtonModule],
  templateUrl: './shipping-cost.component.html',
  styleUrl: './shipping-cost.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShippingCostComponent {


  columns = ['Id', 'Shipping Name', 'Shipping Price', 'Material price', 'Paushale per artikel', 'Actions'];

  act$ = new Observable();
  constructor(public readonly shippingService: ShippingCostService) {}
  newOrEditShipping(item?: IShippingCost) {

    if(item) {
      const newItem: IShippingCost = {} as IShippingCost;
      newItem.id = item.id;
      newItem.shipping_name = item.shipping_name;
      newItem.shipping_price =  +item.shipping_price;
      newItem.average_material_price = +item.average_material_price;
      newItem.cost_per_added_stuck = +item.cost_per_added_stuck;
      this.act$ = this.shippingService.updateShipping(newItem);
      return;
    }
    const newItem: IShippingCost = {} as IShippingCost;
    newItem.shipping_name = 'New shipping';
    newItem.shipping_price = 0;
    newItem.average_material_price = 0;
    newItem.cost_per_added_stuck = 0;
    this.act$ = this.shippingService.createShipping(newItem);

  }
  deleteShipping(_t64: any) {
    this.act$ = this.shippingService.deleteShipping(_t64.id);
  }
}
