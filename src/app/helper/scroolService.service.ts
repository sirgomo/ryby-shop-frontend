import { Injectable } from '@angular/core';
import { MatSidenavContent } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root'
})
export class ScroolServiceService {

  private scrollPositionTop  = 0;

  private sidenavContent: MatSidenavContent | null = null;

  setScrollPosition(scrollPosition: number) {
    this.scrollPositionTop = scrollPosition;
  }

  getSavedScrollPosition(): number {
    return this.scrollPositionTop;
  }

  setSideNavContent(sidenav: MatSidenavContent) {
    this.sidenavContent = sidenav;
  }
  getSidenavContent() {
    return this.sidenavContent;
  }
  scrollTo() {
    if(this.sidenavContent) {
      this.sidenavContent.scrollTo({'top' : this.scrollPositionTop, 'behavior': 'smooth'});
      this.scrollPositionTop = 0;
    }
      
  }
  
}
