import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CompanyService } from '../company.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { HelperService } from 'src/app/helper/helper.service';
import { RouterModule } from '@angular/router';
import { SanitizeHtmlPipe } from 'src/app/pipe/sanitizeHtml';
import { iCompany } from 'src/app/model/iCompany';

@Component({
  selector: 'app-coockie-info',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule, RouterModule, SanitizeHtmlPipe],
  templateUrl: './coockie-info.component.html',
  styleUrls: ['./coockie-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoockieInfoComponent {
  cookieSig = toSignal(this.companyService.getCookies(), {initialValue: {} as iCompany });
  constructor(private readonly dialogRef: MatDialogRef<CoockieInfoComponent>, private readonly companyService: CompanyService, private readonly helper:HelperService) {}
  close() {
    this.dialogRef.close();
  }

  takeAllCookies() {
     this.helper.appComponenet.setGoogleAnalitics();
     this.close();
    }
  noCookies() {
    this.helper.appComponenet.setGoogleAnaliticsOff();
      this.close();
    }
}
