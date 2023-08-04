import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Observable, map } from 'rxjs';
import { ProductService } from 'src/app/admin/product/product.service';
import { HelperService } from 'src/app/helper/helper.service';
import { iColor } from 'src/app/model/iColor';
import { iProduct } from 'src/app/model/iProduct';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss']
})
export class ItemDetailsComponent implements OnInit, OnDestroy{
  item: iProduct = {} as iProduct;
  act$ = new Observable();
  titleSig = this.helperService.titelSig;
  title = '';
  color: iColor[] = [];
  currentImage!: SafeResourceUrl;
  constructor (@Inject(MAT_DIALOG_DATA) public readonly data: iProduct,
  private readonly service: ProductService,
  private helperService: HelperService) {

    this.titleSig.update((title) => {
      this.title = title;
      if(this.data.kategorie !== undefined)
        return title + ' ' + this.data.kategorie[0].name + ' ' + this.data.name;

      return title + ' ' + this.data.name
     })
  }
  ngOnDestroy(): void {
    this.titleSig.set(this.title);
  }
  ngOnInit(): void {
    this.color = JSON.parse(this.data.foto);
    if(this.data.id)
    this.act$ = this.service.getProductById(this.data.id).pipe(map((res) => {
      if(res.id) {
        this.item = res;
      }

    }))
  }
  getImage(id: string ) {
    this.act$ = this.service.getImage(id).pipe(map((res) => {
      if(res instanceof Blob)
        this.currentImage = res;
    }))
  }
}
