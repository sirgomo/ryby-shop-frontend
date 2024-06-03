import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, Signal } from '@angular/core';
import { CompanyService } from '../company.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { iCompany } from 'src/app/model/iCompany';
import { HelperService } from 'src/app/helper/helper.service';
import { SanitizeHtmlPipe } from 'src/app/pipe/sanitizeHtml';

@Component({
  selector: 'app-daten-schutzt',
  templateUrl: './daten-schutzt.component.html',
  styleUrls: ['./daten-schutzt.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [SanitizeHtmlPipe]
})
export class DatenSchutztComponent implements OnInit, OnDestroy{
  companySig: Signal<iCompany> = toSignal(this.companyService.getAllCompanies(), { initialValue: {} as iCompany});
  constructor(private readonly companyService: CompanyService, private readonly helper: HelperService) {}
  ngOnInit(): void {
    this.helper.titelSig.update((title) => title + ' - Datenschutzerklärung');
  }
  ngOnDestroy(): void {
    this.helper.titelSig.update((title) => title.replace(' - Datenschutzerklärung', ''));
  }
}
