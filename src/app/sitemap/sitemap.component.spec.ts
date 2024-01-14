import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SitemapComponent } from './sitemap.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ErrorComponent } from '../error/error.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SitemapService } from './sitemap.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';


describe('SitemapComponent', () => {
  let component: SitemapComponent;
  let fixture: ComponentFixture<SitemapComponent>;
  let siteService: SitemapService;
  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SitemapComponent, MatButtonModule, ErrorComponent, MatCardModule, BrowserAnimationsModule],
      providers: [
         {
        provide: SitemapService,
        useValue:  {
          getProductsForSiteMap: jest.fn().mockResolvedValue('test data are bigger'),
          generateSiteMap: jest.fn().mockResolvedValue('new map, new map 2, new map 3'),
          deleteSiteMap: jest.fn().mockResolvedValue(''),
        },
      }
    ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SitemapComponent);
    component = fixture.componentInstance;
    siteService = TestBed.inject(SitemapService);
    fixture.detectChanges();
  });

  it('should create', () => {
    const mockData = 'test data';
    jest.spyOn(siteService, 'getProductsForSiteMap').mockReturnValue(new Promise((resolve, reject) => (resolve(mockData), reject(new Error('error')))) );

    expect(component).toBeTruthy();
  });

  it('should fetch data on init', () => {
    const mockData = 'test data are bigger';
    jest.spyOn(siteService, 'getProductsForSiteMap').mockReturnValue(new Promise((resolve) => resolve(mockData)));
    component.ngOnInit();
    expect(siteService.getProductsForSiteMap).toHaveBeenCalled();
    expect(component.productsSig()).toEqual(mockData);
  });

  it('should generate sitemap when genMap is called', () => {
    jest.spyOn(siteService, 'generateSiteMap').mockResolvedValueOnce('');
    component.genMap();
    expect(siteService.generateSiteMap).toHaveBeenCalled();
  });

  it('should delete sitemap when deleteMap is called', () => {
    jest.spyOn(siteService, 'deleteSiteMap').mockResolvedValueOnce('');
    component.deleteMap();
    expect(siteService.deleteSiteMap).toHaveBeenCalled();
  });

  it('should call genMap when generate button is clicked', () => {
    const button = fixture.debugElement.nativeElement.querySelectorAll('button')[1];
    jest.spyOn(component, 'genMap');
    button.click();
    expect(component.genMap).toHaveBeenCalled();
  });

  it('should call deleteMap when delete button is clicked', () => {
    const button = fixture.debugElement.nativeElement.querySelector('button');
    jest.spyOn(siteService, 'deleteSiteMap').mockResolvedValueOnce('');
    jest.spyOn(component, 'deleteMap');
    button.click();
    expect(component.deleteMap).toHaveBeenCalled();
  });
});
