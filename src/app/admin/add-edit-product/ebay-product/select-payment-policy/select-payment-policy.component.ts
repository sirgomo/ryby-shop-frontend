import { Component, output, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { lastValueFrom } from 'rxjs';
import { EbayOffersService } from 'src/app/ebay/ebay-offers/ebay-offers.service';
import { iEbayPaymentPolicies } from 'src/app/model/ebay/iEbayPaymentPolicies';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-select-payment-policy',
  standalone: true,
  imports: [FormsModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './select-payment-policy.component.html',
  styleUrl: './select-payment-policy.component.scss'
})
export class SelectPaymentPolicyComponent {
  paymentPoliciesSig: WritableSignal<iEbayPaymentPolicies[]> = signal<iEbayPaymentPolicies[]>([]);
  selectedSig = signal('');
  selectedPaymentPolicy = output<string>();
  constructor(private readonly offerservice: EbayOffersService) {
    lastValueFrom(this.offerservice.getPaymentPoliciesyBymarktId(environment.ebay_marketid)).then((res) => {
      this.paymentPoliciesSig.set(res.paymentPolicies);
      this.selectedSig.set(res.paymentPolicies[0].paymentPolicyId);
      this.selectedPaymentPolicy.emit(this.selectedSig());
    })
  }
  changeSelected(id: string) {
    this.selectedPaymentPolicy.emit(this.selectedSig());
  }
}
