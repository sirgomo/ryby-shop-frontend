import { Component } from '@angular/core';
import { HelperService } from '../helper/helper.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  search = '';
  constructor(private readonly helper: HelperService) {}

  searchItem() {
    if(this.search.length < 3)
    this.helper.searchSig.set('');

      this.helper.searchSig.set(this.search);
  }
}
