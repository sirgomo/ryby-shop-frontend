import { ChangeDetectionStrategy, Component, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EbayService } from '../ebay.service';
import { iEbaySubscriptionsPayload } from 'src/app/model/ebay/iEbaySubscriptionsPayload';
import { toSignal } from '@angular/core/rxjs-interop';
import { HelperService } from 'src/app/helper/helper.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { EbaySubscriptionsService } from './ebay-subscriptions.service';
import { MatTabsModule } from '@angular/material/tabs';
import { TopicsComponent } from '../topics/topics.component';

@Component({
  selector: 'app-ebay-subscriptions',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatTabsModule, TopicsComponent],
  templateUrl: './ebay-subscriptions.component.html',
  styleUrls: ['./ebay-subscriptions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EbaySubscriptionsComponent {

  subscriptions: Signal<iEbaySubscriptionsPayload> = toSignal(this.ebaySer.getSubscriptions(this.helperService.artikelProSiteSig(), null), { initialValue: {} as iEbaySubscriptionsPayload});
  previous = signal<string[]>([]);

  columns = ['subid', 'topicid', 'status', 'getsub'];
  constructor(private readonly ebaySer: EbaySubscriptionsService, private readonly helperService: HelperService) {
    this.helperService.artikelProSiteSig.set(20);
  }

  goNextSite() {
    if(!this.subscriptions())
    return;

    this.previous.set([...this.previous(), this.subscriptions().href]);
    this.subscriptions = toSignal(this.ebaySer.getSubscriptions(this.helperService.artikelProSiteSig(), this.subscriptions().next), { initialValue: {} as iEbaySubscriptionsPayload});
  }
  goPreviorusSite() {
    if(this.previous().length === 0)
      return;

      this.subscriptions = toSignal(this.ebaySer.getSubscriptions(this.helperService.artikelProSiteSig(), this.previous()[this.previous().length -1]), { initialValue: {} as iEbaySubscriptionsPayload});
      let newPrev = this.previous();
      newPrev.splice(this.previous().length - 1, 1);
      this.previous.set(newPrev);

  }
  unsubscribe() {
    throw new Error('Method not implemented.');
    }
    subscribe() {
    throw new Error('Method not implemented.');
    }
}
