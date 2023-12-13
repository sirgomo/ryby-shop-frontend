import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject } from '@angular/core';
import { HelperService } from '../helper/helper.service';
import { CommonModule, ViewportScroller } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';



@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule]
})
export class PaginatorComponent implements OnInit{

  pagiSig = computed(() => {
    if(this.helper.artikelProSiteSig() === 0)
      return 0;

    return this.helper.paginationCountSig() / this.helper.artikelProSiteSig();
  })
  constructor(public helper: HelperService, private readonly vps: ViewportScroller) {}
  ngOnInit(): void {
    this.helper.artikelProSiteSig.set(10);
    this.helper.pageNrSig.set(1);
  }
  goNext() {
    if(this.helper.pageNrSig() + 1 > Math.ceil(this.pagiSig()))
    return;

    this.helper.pageNrSig.update((val) => val + 1);
    this.resetScroll();
  }
  goBack() {
    if(this.helper.pageNrSig() - 1 < 1)
      return

    this.helper.pageNrSig.update((val) => val -1 );
    this.resetScroll();
  }
  canGoBack() {
    return this.helper.pageNrSig() - 1 >= 1;
  }
  canGoNext() {
    return this.helper.pageNrSig() + 1 <= Math.ceil(this.pagiSig());
  }
  resetScroll() {
    if(document) {
      const element = document.getElementById('product-list');
      if(element)
        element.scrollIntoView({behavior: 'smooth'});
    }

  }
}
