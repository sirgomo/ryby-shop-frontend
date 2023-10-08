import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopicsService } from './topics.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { HelperService } from 'src/app/helper/helper.service';
import { iEbayTopicsPayload } from 'src/app/model/ebay/iEbayTopicsPayload';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-topics',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule],
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopicsComponent {
  topics = toSignal(this.topicServ.getTopics(this.helperService.artikelProSiteSig(), null), { initialValue: {} as iEbayTopicsPayload});
  previous = signal<string[]>([]);

  columns = ['id', 'desc', 'status', 'context', 'acct'];
  constructor(private readonly topicServ: TopicsService, private readonly helperService: HelperService) {
    this.helperService.artikelProSiteSig.set(20);
  }

  goNextSite() {
    if(!this.topics())
    return;

    this.previous.set([...this.previous(), this.topics().href]);
    this.topics = toSignal(this.topicServ.getTopics(this.helperService.artikelProSiteSig(), this.topics().next), { initialValue: {} as iEbayTopicsPayload});
  }
  goPreviorusSite() {
    if(this.previous().length === 0)
      return;

      this.topics = toSignal(this.topicServ.getTopics(this.helperService.artikelProSiteSig(), this.previous()[this.previous().length -1]), { initialValue: {} as iEbayTopicsPayload});
      let newPrev = this.previous();
      newPrev.splice(this.previous().length - 1, 1);
      this.previous.set(newPrev);

  }
}
