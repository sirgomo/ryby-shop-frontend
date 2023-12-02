import { Component, Inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ProductService } from '../admin/product/product.service';
import { CommonModule, isPlatformBrowser, isPlatformServer,  } from '@angular/common';


@Component({
  selector: 'app-sitemap',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sitemap.component.html',
  styleUrl: './sitemap.component.scss',
})
export class SitemapComponent implements OnInit {
  productsSig = signal('')
  HOSTNAME = environment.url;
  sitemap = '';
  constructor(private readonly producsService: ProductService, @Inject(PLATFORM_ID) private readonly platformId: any) {}
  ngOnInit(): void {
    if(isPlatformBrowser(this.platformId)) {
      this.getData();
    }

  }
  async getData() {
    await this.producsService.getProductsForSiteMap().then((res) => {
    //  this.productsSig.set(res);
    });
  }




}
