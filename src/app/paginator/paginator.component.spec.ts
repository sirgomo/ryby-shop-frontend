import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginatorComponent } from './paginator.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HelperService } from '../helper/helper.service';
import { By } from '@angular/platform-browser';
import { ChangeDetectorRef } from '@angular/core';

describe('PaginatorComponent', () => {
  let component: PaginatorComponent;
  let fixture: ComponentFixture<PaginatorComponent>;
  let helper: HelperService;
  let changeDetect: ChangeDetectorRef;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PaginatorComponent, MatButtonModule, MatIconModule, BrowserAnimationsModule],
      providers: [
        {
          provide: HelperService,
          useClass: HelperService,
        }
      ],
    });
    fixture = TestBed.createComponent(PaginatorComponent);
    component = fixture.componentInstance;
    helper = TestBed.inject(HelperService);
    changeDetect =  fixture.debugElement.injector.get(ChangeDetectorRef);

  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it('should call goNext when next button is clicked', () => {
    helper.paginationCountSig.set(20);
    fixture.detectChanges();
    const goNextSpy = jest.spyOn(component, 'goNext');
    const button = fixture.debugElement.queryAll(By.css('button[mat-icon-button]'))[0].nativeElement;
    button.click();
    expect(goNextSpy).toHaveBeenCalled();
  });
  it('should call goBack when back button is clicked', () => {
    fixture.detectChanges();
    helper.paginationCountSig.set(30);
    helper.pageNrSig.set(2);
    helper.artikelProSiteSig.set(10);

    changeDetect.detectChanges();

    const button = fixture.debugElement.queryAll(By.css('button'))[0].nativeElement;
    const goBackSpy = jest.spyOn(component, 'goBack');
    button.click();
    expect(goBackSpy).toHaveBeenCalled();
  });

});
