import { ChangeDetectionStrategy, Component, ElementRef, Inject, Input, OnInit, PLATFORM_ID, ViewChild, signal, } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { Observable, map, of } from 'rxjs';
import { iProduct } from 'src/app/model/iProduct';
import { HelperService, getProductUrl } from 'src/app/helper/helper.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule, isPlatformServer } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { VariationsService } from 'src/app/admin/add-edit-product/variations/variations.service';
import { iProduktVariations } from 'src/app/model/iProduktVariations';
import { FormsModule } from '@angular/forms';
import { iSordedVariation } from 'src/app/model/iSortedVariation';
import { SelectComponent } from '../select/select.component';
import { getSortedVariation, doWeHaveEnough } from '../functions';
import { Router } from '@angular/router';
import { SanitizeHtmlPipe } from '../../pipe/sanitizeHtml';
import { BackNaviagtionService } from 'src/app/helper/back-naviagtion.service';
import { ScroolServiceService } from 'src/app/helper/scroolService.service';


@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatProgressSpinnerModule, CommonModule, MatButtonModule, FormsModule, SelectComponent, SanitizeHtmlPipe],
})
export class ItemComponent implements OnInit {
  @Input() item!: iProduct;
  @ViewChild('select') select!: ElementRef;
  @ViewChild('view') view!: ElementRef;
  act$ = new Observable();
  image: SafeResourceUrl | undefined;

  images: string[] = [];
  current!: iProduktVariations;
  sortedVarations: iSordedVariation[] = [];
  constructor( private santizier: DomSanitizer,
    private naviService: BackNaviagtionService,
    private scroolService: ScroolServiceService,
    private router: Router,
    private helper: HelperService,
    private snackBar: MatSnackBar, @Inject(PLATFORM_ID) private readonly platformId: any,
    private readonly variationService: VariationsService) {}
  ngOnInit(): void {

    if(this.item) {


      if(this.item.produkt_image)
        this.getImage(this.item.produkt_image);
      else
        this.getImage(this.item.variations[0].image);

      this.current = this.item.variations[0];
      this.sortedVarations = getSortedVariation(this.item);

    }
  }

  getImage(item: string)  {
    if(isPlatformServer(this.platformId))
      return;
    if(!this.item.id)
      return


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

    const sidenav = this.scroolService.getSidenavContent();
    if(sidenav)
      this.scroolService.setScrollPosition(sidenav.measureScrollOffset('top'));

    const previousUrl = this.naviService.getPreviousUrl();
    localStorage.setItem('previousUrl', previousUrl || '');
    this.naviService.setPaginationPage(this.helper.pageNrSig());

    this.router.navigate(getProductUrl('products', this.item.id!, this.item.name));
 }
changeSelection(item: any) { 
  this.current = item;
  this.getImage(this.current.image);
}
 getPriceBrutto() {
      if(this.current) {
        const mwst = Number(this.current.price) * this.item.mehrwehrsteuer / 100;
        return (Number(this.current.price) + mwst).toFixed(2);
      }
    return 0
  }
  addItem(item: iProduct) {
   

      const tmp : iProduct = {} as iProduct;
      const tmpVar: iProduktVariations = {} as iProduktVariations;
      Object.assign(tmp, this.item);
      Object.assign(tmpVar, this.current);
      tmpVar.quanity = 1;
      tmp.variations = [tmpVar];
      tmp.beschreibung ='';

      if(!doWeHaveEnough(this.helper, this.current, 1)) {
        this.snackBar.open(' Es tut uns leider, es sind nur '+this.current.quanity+' verfügbar', 'Ok', { duration: 1500 });
        return;
      }

    if(this.current)
      this.helper.cardSigForMengeControl().push(this.item);


      const items = this.helper.cardSig();
      const newItems = items.slice(0);
      newItems.push(tmp);
      this.helper.cardSig.set(newItems);
      this.snackBar.open(item.name + ' wurde zum Warenkorb hinzugefügt!', 'Ok', { duration: 1500 });
  }
}
