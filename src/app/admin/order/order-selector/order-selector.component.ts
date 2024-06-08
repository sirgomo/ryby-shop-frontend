import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { HelperService } from 'src/app/helper/helper.service';
import { BESTELLUNGSSTATE, BESTELLUNGSSTATUS } from 'src/app/model/iBestellung';
import { OrdersService } from 'src/app/orders/orders.service';

@Component({
  selector: 'app-order-selector',
  templateUrl: './order-selector.component.html',
  styleUrls: ['./order-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, FormsModule, CommonModule]
})
export class OrderSelectorComponent implements OnInit{
  statusArr = Object.values(BESTELLUNGSSTATUS);
  stateArr = Object.values(BESTELLUNGSSTATE);
  siteItems = [5, 10, 20, 50, 100 ];
  currentStatus: BESTELLUNGSSTATUS = BESTELLUNGSSTATUS.INBEARBEITUNG;
  currentState: BESTELLUNGSSTATE = BESTELLUNGSSTATE.BEZAHLT;
  currentItemProSite: number = 10;
  #role = localStorage.getItem('role');
    constructor(private orderService: OrdersService, private helper: HelperService) {
      this.helper.artikelProSiteSig.set(10);
    }
  ngOnInit(): void {
    if(this.#role !== 'ADMIN')
      this.statusArr = this.statusArr.slice(0, 2);

    this.orderService.currentOrderStateSig.set(this.currentState);
    this.orderService.currentVersandStatusSig.set(this.currentStatus);
  }

    changeStatus() {
      this.orderService.currentVersandStatusSig.set(this.currentStatus);
    }
    changeState() {
      this.orderService.currentOrderStateSig.set(this.currentState);
    }
    changeItemQuanity() {
      this.helper.pageNrSig.set(1);
      this.helper.artikelProSiteSig.set(this.currentItemProSite);
    }
 }
