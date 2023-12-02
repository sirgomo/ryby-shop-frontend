import { ChangeDetectionStrategy, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ProductService } from '../admin/product/product.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule, DatePipe, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { getProductUrl } from '../helper/helper.service';

@Component({
  selector: 'app-sitemap',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sitemap.component.html',
  styleUrl: './sitemap.component.scss',
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class SitemapComponent implements OnInit {
  productsSig = toSignal(this.producsService.getProductsForSiteMap(), {initialValue: []});
  HOSTNAME = environment.url;
  sitemap = '';
  constructor(private readonly producsService: ProductService, private readonly datePipe: DatePipe, @Inject(PLATFORM_ID) private readonly platformId: any) {}
  ngOnInit(): void {

    if(isPlatformServer(this.platformId))
      {
        console.log('nastepny server')
        const fs = require('fs');
        const path = require('path')

        this.sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`.concat(
        this.productsSig().map(
          (prod, index) => (
            `<loc>${this.getUrl(index)}</loc>\n
            <lastmod>${this.datePipe.transform(Date.now(), 'YYYY-MM-DD')}</lastmod>`
          )
        ).join('\n')
      ).concat('\n</urlset>');
      fs.writeFileSync(path.join(__dirname, './src/sitemap.xml'), this.sitemap);
      console.log('sitemap ' + this.sitemap)
    }

  }




getUrl(index: number) {

  return getProductUrl('products', this.productsSig()[index].id, this.productsSig()[index].name);
  }
}
