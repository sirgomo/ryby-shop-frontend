import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { iLogs } from 'src/app/model/iLogs';
import { LogsService } from '../logs.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-open-logs',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './open-logs.component.html',
  styleUrl: './open-logs.component.scss'
})
export class OpenLogsComponent  {
  log = toSignal(this.logService.getLogById(this.logdata.id));
  constructor(@Inject( MAT_DIALOG_DATA) public readonly logdata: iLogs, public readonly dialRef: MatDialogRef<OpenLogsComponent>,
  private readonly logService: LogsService) {}

cancel() {
    this.dialRef.close();
  }
}
