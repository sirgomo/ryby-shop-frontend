import { CommonModule, Location } from '@angular/common';
import { ChangeDetectionStrategy,  Component,  OnDestroy, OnInit, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable, map } from 'rxjs';
import { VariationsService } from 'src/app/admin/add-edit-product/variations/variations.service';
import { ProductService } from 'src/app/admin/product/product.service';
import { HelperService } from 'src/app/helper/helper.service';
import { iProduct } from 'src/app/model/iProduct';
import { iProduktVariations } from 'src/app/model/iProduktVariations';
import { doWeHaveEnough } from '../functions';
import { SelectComponent } from '../select/select.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute  } from '@angular/router';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatFormFieldModule, CommonModule, MatIconModule, MatButtonModule, MatCheckboxModule, MatProgressSpinnerModule, MatInputModule,
  FormsModule, SelectComponent, MatToolbarModule]
})
export class ItemDetailsComponent implements OnInit, OnDestroy{

  @ViewChildren(MatCheckbox) checks! : MatCheckbox[];
  item: iProduct = {} as iProduct;
  act$ = new Observable();
  titleSig = this.helperService.titelSig;
  title = '';
  id : string | null = null;
  currentImage!: SafeResourceUrl;
  currentVariation!: iProduktVariations;
  currentItems!: iProduktVariations[];
  currentItemQuanity: number = 0;
  constructor (
  private readonly service: ProductService,
  private helperService: HelperService,
  private santizier: DomSanitizer,
  private snackBar: MatSnackBar,
  private variationService: VariationsService,
  private route: ActivatedRoute,
  private location: Location
  ) {}
  ngOnDestroy(): void {
    this.titleSig.set(this.title);
  }
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if(this.id)
    this.act$ = this.service.getProductById(+this.id).pipe(map((res) => {
      if(res.id) {
        this.item = res;
        this.titleSig.update((title) => {
          this.title = title;

          return title + ' - ' + res.name.replace(/[^a-zA-Z0-9üöäÜÖÄ]/g,' ').replace(/-+/g, '-').replace(/^-|-$/g, '')
         })

        if(res.variations.length > 0) {
          this.currentVariation = res.variations[0];
          this.getImage(res.variations[0].image);
        }

      }

    }))
  }
  getImage(id: string ) {
    this.act$ = this.variationService.getImage(id).pipe(map((res) => {
      if(res instanceof Blob)
        this.setImage(res);

      return res;
    }))
  }
  setImage(image: Blob) {
    this.currentImage = this.santizier.bypassSecurityTrustResourceUrl(URL.createObjectURL(image));
  }

  getPriceBrutto() {
    const mwst = Number(this.currentVariation.price) * this.item.mehrwehrsteuer / 100;
    return (Number(this.currentVariation.price) + mwst).toFixed(2);
  }
  changeImage(item: iProduktVariations) {

    this.getImage(item.image);
    this.currentVariation = item;

  }



  addItem() {
    if(this.currentItemQuanity < 1) {
      this.snackBar.open(' Das Menge kann nicht 0 sein', 'Ok', { duration: 1500 });
      return;
    }


    const tmpItem= {} as iProduct;
    const tmpVari: iProduktVariations = {} as iProduktVariations;
    Object.assign(tmpItem, this.item);
    Object.assign(tmpVari, this.currentVariation);
    tmpVari.quanity = this.currentItemQuanity;

    if(!doWeHaveEnough(this.helperService, this.currentVariation, this.currentItemQuanity))
     {
      this.snackBar.open(' Es tut uns leider, es sind nur '+this.currentVariation.quanity+' verfügbar', 'Ok', { duration: 1500 });
      return;
     }
     this.currentItemQuanity = 0;
        tmpItem.variations = [tmpVari];
          this.helperService.cardSigForMengeControl().push(this.item);

        const items = this.helperService.cardSig();
        const newItems = items.slice(0);
        newItems.push(tmpItem);
        this.helperService.cardSig.set(newItems);

        this.snackBar.open(this.item.name + ' wurde zum Warenkorb hinzugefügt!', 'Ok', { duration: 1500 });

  }

  close() {
    this.location.back();
  }
  getItemQuanity() {
    let quanityInCard = 0;
    for (let i = 0; i < this.helperService.cardSig().length; i++) {
        if(this.helperService.cardSig()[i].variations[0].sku  === this.currentVariation.sku)
          quanityInCard += this.helperService.cardSig()[i].variations[0].quanity * this.helperService.cardSig()[i].variations[0].quanity_sold_at_once;
    }
    return this.currentVariation.quanity - quanityInCard;
  }
}
