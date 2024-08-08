import { Component, Input, output, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { lastValueFrom } from 'rxjs';
import { EbayOffersService } from 'src/app/ebay/ebay-offers/ebay-offers.service';
import { iEbayFulfillmentPolicy } from 'src/app/model/ebay/iEbayFulfillmentPolicy';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-select-shipping-policy',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatIconModule, FormsModule],
  templateUrl: './select-shipping-policy.component.html',
  styleUrl: './select-shipping-policy.component.scss'
})
export class SelectShippingPolicyComponent {
  @Input('selectedPolicy') selectedPolicy!: WritableSignal<string | undefined>;
  policiesSig = signal<iEbayFulfillmentPolicy[]>([])
  newPolicy = output<string>();

  constructor(private readonly offerService: EbayOffersService) {
        lastValueFrom(this.offerService.allgetEbayFulfillmentPolicyById(environment.ebay_marketid)).then((res ) => {
          if(res.fulfillmentPolicies && res.fulfillmentPolicies.length > 0) {
            this.policiesSig.set(res.fulfillmentPolicies);
          }
        });

      

  }
  setShippingMethod(shippingid: string) {
    this.newPolicy.emit(shippingid);
  }

}
