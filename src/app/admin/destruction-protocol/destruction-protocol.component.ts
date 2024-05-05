import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { DestructionProtocolService } from './destruction-protocol.service';
import { MatIconModule } from '@angular/material/icon';
import { iDestructionProtocol } from 'src/app/model/iDestructionProtocol';
import { AddEditProtocolComponent } from './add-edit-protocol/add-edit-protocol.component';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-destruction-protocol',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, AddEditProtocolComponent, MatDialogModule],
  templateUrl: './destruction-protocol.component.html',
  styleUrl: './destruction-protocol.component.scss'
})
export class DestructionProtocolComponent implements OnInit {
    columns= ['id', 'prod_name', 'quantity', 'type', 'person', 'date', 'status', 'delete']
    data = this.service.itemsSig;
    constructor(private readonly service: DestructionProtocolService, private dialo: MatDialog) {}
    ngOnInit(): void {
      this.service.actionSig.set({item: {} as any, action: 'getall'});
    }
    createEditProtocol(protcol?: iDestructionProtocol) {
      const conf: MatDialogConfig = new MatDialogConfig();
      conf.height = '100%';
      conf.width = '100%'
      if(protcol)
        conf.data = protcol

      this.dialo.open(AddEditProtocolComponent, conf);
    }
}
