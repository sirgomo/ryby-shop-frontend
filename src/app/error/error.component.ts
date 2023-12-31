import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ErrorService } from './error.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ErrorComponent {
  errorServ = inject(ErrorService);
  message = this.errorServ.message;

  reset() {
    this.errorServ.newMessage('');
  }
}

