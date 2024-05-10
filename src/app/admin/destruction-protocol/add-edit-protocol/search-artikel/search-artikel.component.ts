import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, Signal, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DestructionProtocolService } from '../../destruction-protocol.service';
import { BehaviorSubject, debounceTime, distinctUntilChanged, lastValueFrom, map, switchMap } from 'rxjs';
import {MatExpansionModule} from '@angular/material/expansion';
import { iProduct } from 'src/app/model/iProduct';
import { iProduktVariations } from 'src/app/model/iProduktVariations';

@Component({
  selector: 'app-search-artikel',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, MatFormFieldModule, MatIconModule, MatButtonModule, MatInputModule, MatExpansionModule],
  templateUrl: './search-artikel.component.html',
  styleUrl: './search-artikel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchArtikelComponent {
  @Input() prod!: iProduct | undefined;
  @Output() prodChange = new EventEmitter<iProduct>();
  name: string = '';
  search: BehaviorSubject<string> = new BehaviorSubject('');
  artikels = signal<iProduct[]>([])
  constructor(private readonly service: DestructionProtocolService){}

getArtikels() {

  if(this.name.length > 2) {
    lastValueFrom(this.search.asObservable().pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((name) => this.service.getProductByName(this.name)),
      map((res) => {
        if(res && res[0] && res[0].length > 0)
          this.artikels.set([]);
          res[0].forEach((produ) => {
            this.artikels.update((art) => [...art, produ]);
          })
      })
    ))
  }
}
setItem(prod: iProduct, varioation: iProduktVariations) {
  prod.variations = [varioation];
  this.prodChange.emit(prod);
}
}
