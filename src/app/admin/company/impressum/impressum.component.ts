import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CompanyService } from '../company.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { iCompany } from 'src/app/model/iCompany';
import { CommonModule } from '@angular/common';
import { HelperService } from 'src/app/helper/helper.service';
import { SanitizeHtmlPipe } from 'src/app/pipe/sanitizeHtml';

@Component({
  selector: 'app-impressum',
  templateUrl: './impressum.component.html',
  styleUrls: ['./impressum.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, SanitizeHtmlPipe]
})
export class ImpressumComponent implements OnInit, OnDestroy{
    companySig = toSignal(this.companyService.getAllCompanies(), { initialValue: {} as iCompany})
    constructor(private readonly companyService: CompanyService, private helper: HelperService) {}
  ngOnInit(): void {
    this.helper.titelSig.update((title) => title + ' - Impressum');
  }
  ngOnDestroy(): void {
    this.helper.titelSig.update((title) => title.replace(' - Impressum', ''));
  }
}
