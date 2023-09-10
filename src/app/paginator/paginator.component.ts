import { Component, computed } from '@angular/core';
import { HelperService } from '../helper/helper.service';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent {
  pagiSig = computed(() => {
    return this.helper.paginationCountSig() / this.helper.artikelProSiteSig();
  })
  constructor(public helper: HelperService) {}
  goNext() {
    if(this.helper.pageNrSig() + 1 > Math.round(this.pagiSig()))
    return;

    this.helper.pageNrSig.update((val) => val + 1);
  }
  goBack() {
    if(this.helper.pageNrSig() - 1 < 1)
      return

    this.helper.pageNrSig.update((val) => val -1 );
  }
  canGoBack() {
    return this.helper.pageNrSig() - 1 >= 1;
  }
  canGoNext() {
    return this.helper.pageNrSig() + 1 <= Math.round(this.pagiSig());
  }
}
