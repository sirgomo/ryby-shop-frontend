import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HelperService } from '../helper/helper.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatInputModule, MatIconModule, MatButtonModule, FormsModule]
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
