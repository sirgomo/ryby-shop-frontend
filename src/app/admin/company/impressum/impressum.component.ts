import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CompanyService } from '../company.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { iCompany } from 'src/app/model/iCompany';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-impressum',
  templateUrl: './impressum.component.html',
  styleUrls: ['./impressum.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule]
})
export class ImpressumComponent {
    companySig = toSignal(this.companyService.getAllCompanies(), { initialValue: {} as iCompany})
    constructor(private readonly companyService: CompanyService) {}
}
