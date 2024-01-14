import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SitemapService {

  constructor() { }
  getProductsForSiteMap() {

    return fetch(`${environment.url}sitemap.xml`, { method: 'GET'}).then((res) => {
        return res.text()
      })
  }
 generateSiteMap() {

    return fetch(`${environment.url}gen-map`, { method: 'GET'}).then((res) => {

        return res.text()
      })
  }
  deleteSiteMap() {

    return fetch(`${environment.url}deletexml`, { method: 'DELETE'}).then((res) => {

        return res.text()
      })
  }
}
