import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { iUrlop } from 'src/app/model/iUrlop';

@Component({
  selector: 'app-show-urlop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-urlop.component.html',
  styleUrl: './show-urlop.component.scss'
})
export class ShowUrlopComponent {
  @Input('urlop') urlop!: iUrlop;
}
