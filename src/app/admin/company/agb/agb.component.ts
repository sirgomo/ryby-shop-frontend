import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { iCompany } from 'src/app/model/iCompany';
import { CompanyService } from '../company.service';
import { HelperService } from 'src/app/helper/helper.service';

@Component({
  selector: 'app-agb',
  templateUrl: './agb.component.html',
  styleUrls: ['./agb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AgbComponent implements OnInit, OnDestroy{
  companySig: Signal<iCompany> = toSignal(this.companyService.getAllCompanies(), { initialValue: {} as iCompany});
  constructor(private readonly companyService: CompanyService, private helper: HelperService) {}
  ngOnInit(): void {
    this.helper.titelSig.update((title) => title + ' - AGB');
    }
  ngOnDestroy(): void {
    this.helper.titelSig.update((title) => title.replace(' - AGB', ''));
  }
}
