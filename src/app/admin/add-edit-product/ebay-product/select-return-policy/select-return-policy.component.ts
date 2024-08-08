import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { lastValueFrom } from 'rxjs';
import { EbayOffersService } from 'src/app/ebay/ebay-offers/ebay-offers.service';
import { iEbayReturnPolicy } from 'src/app/model/ebay/iEbayReturnPolicy';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-select-return-policy',
  standalone: true,
  imports: [MatFormFieldModule, FormsModule, MatSelectModule],
  templateUrl: './select-return-policy.component.html',
  styleUrl: './select-return-policy.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectReturnPolicyComponent {
  selectedPolicySig = signal('');
  policiesSig = signal<iEbayReturnPolicy[]>([]);
  policy = output<string>();
  constructor(private readonly offerService: EbayOffersService) {
    lastValueFrom(this.offerService.getReturnPoliciesByMarktid(environment.ebay_marketid)).then((res) => {
      if (res && res.returnPolicies && res.returnPolicies.length > 0) {
        this.policiesSig.set(res.returnPolicies);
        this.selectedPolicySig.set(res.returnPolicies[0].returnPolicyId);
        this.policy.emit(this.selectedPolicySig());
      }
    })
  }
  setReturnPolicy(policy: string) {
    this.policy.emit(policy);
  }
}
