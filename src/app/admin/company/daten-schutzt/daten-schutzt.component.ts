import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { CompanyService } from '../company.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { iCompany } from 'src/app/model/iCompany';

@Component({
  selector: 'app-daten-schutzt',
  templateUrl: './daten-schutzt.component.html',
  styleUrls: ['./daten-schutzt.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class DatenSchutztComponent {
  companySig: Signal<iCompany> = toSignal(this.companyService.getAllCompanies(), { initialValue: {} as iCompany});
  constructor(private readonly companyService: CompanyService) {}
}
