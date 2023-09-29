import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EbayService } from './ebay.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ebay',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ebay.component.html',
  styleUrls: ['./ebay.component.scss']
})
export class EbayComponent {
  ebaySoldItems = toSignal(this.serv.getItemsSoldBeiEbay());
  ebaycode = '';
  show_input = false;
  constructor (private readonly serv: EbayService) {};

  getLink() {
   const link = this.serv.getLinkForUserConsent().subscribe((res) => {
    const win = window.open(res.address, '_blank');
    if(win) {
      win.focus();
      link.unsubscribe();
      this.show_input = true;
    }

   })
  }
  sendCode() {
    if(this.ebaycode.length < 5)
      return;

    const code = this.serv.generateFirstAccessToken(this.ebaycode).subscribe(res => {
      if(res)
        code.unsubscribe();
    })
  }
}
