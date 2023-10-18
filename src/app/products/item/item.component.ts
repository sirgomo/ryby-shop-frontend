import { ChangeDetectionStrategy, Component, Inject, Input, OnInit, PLATFORM_ID, Sanitizer } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable, concatMap, map, of, shareReplay, tap } from 'rxjs';
import { ProductService } from 'src/app/admin/product/product.service';
import { iProduct } from 'src/app/model/iProduct';
import { ItemDetailsComponent } from '../item-details/item-details.component';

import { HelperService } from 'src/app/helper/helper.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule, isPlatformServer } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { VariationsService } from 'src/app/admin/add-edit-product/variations/variations.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatProgressSpinnerModule, CommonModule, MatButtonModule]
})
export class ItemComponent implements OnInit {
  @Input() item!: iProduct;
  act$ = new Observable();
  image!: SafeResourceUrl | undefined;

  images: string[] = [];


  constructor( private readonly productService: ProductService, private santizier: DomSanitizer,
    private readonly dialog: MatDialog,
    private helper: HelperService,
    private snackBar: MatSnackBar, @Inject(PLATFORM_ID) private readonly platformId: any,
    private readonly variationService: VariationsService) {


    }
  ngOnInit(): void {

    if(this.item) {


      this.getImage('image')


    }


  }

  getImage(item: string)  {
    if(isPlatformServer(this.platformId))
      return;
    if(!this.item.id)
      return;

    this.image = undefined;
       this.act$ =  this.variationService.getThumbnails(item).pipe(map(res => {
        if (res instanceof Blob) {
          this.image = this.santizier.bypassSecurityTrustResourceUrl(URL.createObjectURL(res));
        }
        return of(undefined);
      }))

    return this.image;
  }
  openDetails() {
    if(isPlatformServer(this.platformId))
    return;
  const conf : MatDialogConfig = new MatDialogConfig();
  conf.width = '90%';
  conf.height= '90%';
  conf.data = this.item;
    this.dialog.open(ItemDetailsComponent, conf);
 }
 colorChange(val: any) {
  if(isPlatformServer(this.platformId))
  return;


  this.getImage('image');



 }
 getPriceBrutto(item: iProduct) {
  //const mwst = Number(item.preis) * item.mehrwehrsteuer / 100;
  return 0;// (Number(item.preis) + mwst).toFixed(2);
  }
  addItem(item: iProduct) {


      this.helper.cardSigForMengeControl().push(item);

      let tmpItem: iProduct = {} as iProduct;
      Object.assign(tmpItem, item);


      const items = this.helper.cardSig();
      const newItems = items.slice(0);
      newItems.push(tmpItem);
      this.helper.cardSig.set(newItems);
      this.snackBar.open(item.name + ' wurde zum Warenkorb hinzugefügt!', 'Ok', { duration: 1500 });


  }
}
