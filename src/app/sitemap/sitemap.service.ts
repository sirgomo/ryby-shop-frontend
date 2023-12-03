import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SitemapService {

  constructor() { }
  async getProductsForSiteMap() {

    return await fetch(`${environment.url}sitemap.xml`, { method: 'GET'}).then((res) => {
        return res.text()
      })
  }
  async generateSiteMap() {

    return await fetch(`${environment.url}gen-map`, { method: 'GET'}).then((res) => {

        return res.text()
      })
  }
  async deleteSiteMap() {

    return await fetch(`${environment.url}deletexml`, { method: 'DELETE'}).then((res) => {

        return res.text()
      })
  }
}
