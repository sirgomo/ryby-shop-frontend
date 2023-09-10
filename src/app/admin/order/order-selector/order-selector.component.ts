import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/helper/helper.service';
import { BESTELLUNGSSTATE, BESTELLUNGSSTATUS } from 'src/app/model/iBestellung';
import { OrdersService } from 'src/app/orders/orders.service';

@Component({
  selector: 'app-order-selector',
  templateUrl: './order-selector.component.html',
  styleUrls: ['./order-selector.component.scss']
})
export class OrderSelectorComponent {
  statusArr = Object.values(BESTELLUNGSSTATUS);
  stateArr = Object.values(BESTELLUNGSSTATE);
  siteItems = [5, 10, 20, 50, 100 ];
  currentStatus: BESTELLUNGSSTATUS = BESTELLUNGSSTATUS.INBEARBEITUNG;
  currentState: BESTELLUNGSSTATE = BESTELLUNGSSTATE.BEZAHLT;
  currentItemProSite: number = 10;

    constructor(private orderService: OrdersService, private helper: HelperService) {}

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
