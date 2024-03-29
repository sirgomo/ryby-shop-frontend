import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CommonModule, isPlatformBrowser  } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ErrorComponent } from '../error/error.component';
import { ErrorService } from '../error/error.service';
import { MatCardModule } from '@angular/material/card';
import { SitemapService } from './sitemap.service';


@Component({
  selector: 'app-sitemap',
  standalone: true,
  imports: [CommonModule, MatButtonModule, ErrorComponent, MatCardModule],
  templateUrl: './sitemap.component.html',
  styleUrl: './sitemap.component.scss',
})
export class SitemapComponent implements OnInit {
  @ViewChild('sitemap') sitemap!: ElementRef<HTMLDivElement>;
  productsSig = signal('')
  HOSTNAME = environment.url;

  constructor(private readonly siteService: SitemapService, @Inject(PLATFORM_ID) private readonly platformId: any, public readonly errorService: ErrorService) {}
  ngOnInit(): void {
    if(isPlatformBrowser(this.platformId)) {
      this.getData();
    }

  }
   getData() {
    this.siteService.getProductsForSiteMap().then((res) => {
      this.productsSig.set(res);
      if(this.sitemap)
      this.sitemap.nativeElement.innerHTML = this.productsSig();
    });
  }
   genMap() {
   this.siteService.generateSiteMap().then((res) => {
      this.getData();
    })
  }
   deleteMap() {
    if(this.productsSig().length < 10)
    return;

    this.siteService.deleteSiteMap().then((res) => {
      this.productsSig.set('');
      if(this.sitemap)
      this.sitemap.nativeElement.innerHTML = this.productsSig();
    })
  }





}
