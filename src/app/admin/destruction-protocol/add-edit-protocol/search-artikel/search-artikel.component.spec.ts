import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { By } from '@angular/platform-browser';

import { SearchArtikelComponent } from './search-artikel.component';
import { DestructionProtocolService } from '../../destruction-protocol.service';
import { iProduct } from 'src/app/model/iProduct';
import { environment } from 'src/environments/environment';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SearchArtikelComponent', () => {
  let component: SearchArtikelComponent;
  let fixture: ComponentFixture<SearchArtikelComponent>;
  let httpTestingController: HttpTestingController;
  let service: DestructionProtocolService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SearchArtikelComponent,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MatFormFieldModule,
        MatIconModule,
        MatButtonModule,
        MatInputModule,
        MatExpansionModule,
        NoopAnimationsModule
      ],
      providers: [DestructionProtocolService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchArtikelComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(DestructionProtocolService);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getArtikels and update artikels on button click',async () => {
    component.name = 'test';
    fixture.detectChanges();

    const button = fixture.debugElement.queryAll(By.css('button'))[0].nativeElement;
    button.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const req = httpTestingController.expectOne(`${environment.api}product/test/0/10/1`);
    expect(req.request.method).toBe('GET');
    const mockResponse: [iProduct[], number] = [[{ id: 1, name: 'Test Product 2', variations: [] } as unknown as iProduct], 1];
    req.flush(mockResponse);

    expect(component.artikels().length).toBe(1);
    expect(component.artikels()[0].name).toBe('Test Product 2');
  });

  it('should call setItem and emit prodChange on button click', () => {
    const variation = { sku: '123', price: 100, quanity: 10, quanity_sold_at_once: 1 };
    const product: iProduct = { id: 1, name: 'Test Product', variations: [variation] } as unknown as iProduct;
    jest.spyOn(component.prodChange, 'emit');
    component.artikels.set([product]);
    fixture.detectChanges();
    const button = fixture.debugElement.queryAll(By.css('button'))[1].nativeElement;
    button.click();

    fixture.detectChanges();




    expect(component.prodChange.emit).toHaveBeenCalledWith({ ...product, variations: [variation] });
  });
});
