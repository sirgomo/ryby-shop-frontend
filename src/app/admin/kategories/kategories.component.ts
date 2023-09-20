import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { KategorieService } from './kategorie.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddEditKategorieComponent } from '../add-edit-kategorie/add-edit-kategorie.component';
import { ErrorService } from 'src/app/error/error.service';
import { iKategorie } from 'src/app/model/iKategorie';
import { tap } from 'rxjs';
import { HelperService } from 'src/app/helper/helper.service';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from 'src/app/error/error.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-kategories',
  templateUrl: './kategories.component.html',
  styleUrls: ['./kategories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ErrorComponent, MatTableModule, MatButtonModule, MatIconModule]
})
export class KategoriesComponent implements OnDestroy {
  #title = '';
  kategorie$ = this.catService.kategorie$.pipe((tap(res => {
    this.#title = this.helper.titelSig();
    this.helper.titelSig.set(this.#title + ' Kategorie')
  })));
    constructor (private readonly catService: KategorieService, private readonly dialog: MatDialog, public errrorSer: ErrorService, private helper: HelperService
      ) {}

  ngOnDestroy(): void {
    this.helper.titelSig.set(this.#title);
  }
  displayedColumns: string[] = ['kategoriaid', 'kategorian', 'iloscitemow', 'edit', 'delete'];

  deleteKategoria(id: number): void {
    this.kategorie$ = this.catService.deleteCategory(id);
  }

  editKategoria(item: iKategorie): void {
    const conf: MatDialogConfig = new MatDialogConfig();
    conf.height = '300px'
    conf.width = '300px'
    conf.data = item;
    this.dialog.open(AddEditKategorieComponent, conf);
  }

  addKategorie(): void {
    const conf: MatDialogConfig = new MatDialogConfig();
    conf.height = '300px'
    conf.width = '300px'
    this.dialog.open(AddEditKategorieComponent, conf);
  }
}
