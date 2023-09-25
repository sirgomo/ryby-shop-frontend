import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CompanyService } from '../company.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

@Component({
  selector: 'app-coockie-info',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule],
  templateUrl: './coockie-info.component.html',
  styleUrls: ['./coockie-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoockieInfoComponent {
  cookieSig = toSignal(this.companyService.getCookies());
  constructor(private readonly dialogRef: MatDialogRef<CoockieInfoComponent>, private readonly companyService: CompanyService) {}
  close() {
    this.dialogRef.close();
  }
}
