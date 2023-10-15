import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VariationsService } from './variations.service';

@Component({
  selector: 'app-variations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './variations.component.html',
  styleUrls: ['./variations.component.scss']
})
export class VariationsComponent {

  constructor (private readonly service: VariationsService) {}
}
