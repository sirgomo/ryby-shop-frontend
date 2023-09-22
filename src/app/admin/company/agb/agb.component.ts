import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { iCompany } from 'src/app/model/iCompany';
import { CompanyService } from '../company.service';

@Component({
  selector: 'app-agb',
  templateUrl: './agb.component.html',
  styleUrls: ['./agb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AgbComponent {
  companySig: Signal<iCompany> = toSignal(this.companyService.getAllCompanies(), { initialValue: {} as iCompany});
  constructor(private readonly companyService: CompanyService) {}
}
