import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { LogsService } from './logs.service';
import { CommonModule } from '@angular/common';
import { ProductsQuanitySelectorComponent } from 'src/app/products/products-quanity-selector/products-quanity-selector.component';
import { MatSelectModule } from '@angular/material/select';
import { LOGS_CLASS, iLogs } from 'src/app/model/iLogs';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PaginatorComponent } from 'src/app/paginator/paginator.component';
import { ErrorComponent } from 'src/app/error/error.component';
import { ErrorService } from 'src/app/error/error.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { OpenLogsComponent } from './open-logs/open-logs.component';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule, ProductsQuanitySelectorComponent, MatSelectModule, FormsModule, MatFormFieldModule, MatTableModule, MatIconModule,
     MatButtonModule, PaginatorComponent, ErrorComponent],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogsComponent implements OnInit {


  columns = ['id', 'ebay_transaction_id', 'user_email', 'paypal_transaction_id', 'error_class',  'created_at','open', 'delete'];
  current_log = LOGS_CLASS.NULL;
  error_class = Object.values(LOGS_CLASS).filter((item) => typeof item === 'string');
  constructor(public readonly logsService: LogsService, public readonly errorService: ErrorService, private readonly dialog: MatDialog) {}

  ngOnInit(): void {
    this.logsService.accSub.next({ item: {}, action: 'getall' });
  }
  change() {
    console.log(this.current_log);
    this.logsService.errorClasSig.set(this.current_log);
    }
  deleteLog(arg: iLogs) {
      this.logsService.accSub.next({ item: arg, action: 'delete'});
  }
  openLog(arg: iLogs) {
    const conf: MatDialogConfig = new MatDialogConfig();
    conf.width = '100%';
    conf.height = '100%';
    conf.data = arg;

    this.dialog.open(OpenLogsComponent, conf);
  }
}
