import { Injectable } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { HelperService } from './helper.service';
import { ScroolServiceService } from './scroolService.service';

@Injectable({
  providedIn: 'root'
})
export class BackNaviagtionService {

  private previousUrl: string | undefined;
  private paginationPageNr = 1;

  constructor(private router: Router, private helper: HelperService, private scroolService: ScroolServiceService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = event.url;
        this.helper.showLoader.next(false);
      }
    });
  }

  public getPreviousUrl(): string | undefined {
    return this.previousUrl;
  }
  public setPaginationPage(pagenr: number) {
    this.paginationPageNr = pagenr;
  }
  public getPaginationPageNr() {
    return this.paginationPageNr;
  }


}
