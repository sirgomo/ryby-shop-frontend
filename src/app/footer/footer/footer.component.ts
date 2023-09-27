import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HelperService } from 'src/app/helper/helper.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterModule]
})
export class FooterComponent {
    constructor (private readonly helper: HelperService) {}
  showCookies() {
    this.helper.showCookiesPolitics();
  }
}
