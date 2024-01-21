import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageComponent } from './image.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { iProduktVariations } from 'src/app/model/iProduktVariations';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { VariationsService } from '../variations/variations.service';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';

describe('ImageComponent', () => {
  let component: ImageComponent;
  let fixture: ComponentFixture<ImageComponent>;
  let testController: HttpTestingController;
  let vari: iProduktVariations;
  let variNoImage: iProduktVariations;

  beforeEach(async () => {
    setTestData();
    await TestBed.configureTestingModule({
      imports: [CommonModule, ImageComponent, MatIconModule, MatProgressBarModule, MatInputModule, MatButtonModule, HttpClientTestingModule, NoopAnimationsModule],
      providers: [
        VariationsService,
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageComponent);
    component = fixture.componentInstance;
    testController = TestBed.inject(HttpTestingController);

  });
  afterEach(() => {
    jest.resetAllMocks();
    testController.verify();
  })
  it('should create', () => {
    component.element = vari;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it('should handle file change', () => {
    component.element = variNoImage;
    fixture.detectChanges();
    jest.spyOn(component, 'onFileChange');
    const input = fixture.debugElement.query(By.css('#img')).nativeElement;
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.onFileChange).toHaveBeenCalled();
  });

  it('should upload photo when button is clicked', () => {
    component.element = variNoImage;
    fixture.detectChanges();
    jest.spyOn(component, 'uploadPhoto');
    component.photoFile = new File([''], 'test.png', { type: 'image/png' });

    const button = fixture.debugElement.query(By.css('.upload-btn')).nativeElement;
    button.click();
    fixture.detectChanges();

    const requ = testController.expectOne(environment.api + 'variation/upload/'+variNoImage.sku);
    expect(requ.request.method).toBe('POST');
    requ.flush(variNoImage);

    expect(component.uploadPhoto).toHaveBeenCalledWith(component.element);
  });

  it('should delete image when delete button is clicked', () => {
    component.element = vari;
    fixture.detectChanges();
    jest.spyOn(component, 'deleteImage');

    const button = fixture.debugElement.query(By.css('button[color="warn"]')).nativeElement;
    button.click();
    fixture.detectChanges();

    const requ = testController.expectOne(environment.api + 'variation/file-delete');
    expect(requ.request.method).toBe('POST');
    requ.flush(1);

    expect(component.deleteImage).toHaveBeenCalledWith(component.element);
  });

  it('should open dialog when ebay image link button is clicked',  () => {
    component.element = variNoImage;
    fixture.detectChanges();

    const mockDialogRef = {
      afterClosed: () => of('someValue'),
    };

    const noimage = fixture.nativeElement.querySelector('#imageok');
    expect(noimage).toBeFalsy();
    const image = fixture.nativeElement.querySelector('#noimage');
    expect(image).toBeTruthy();

    component.dialog.open = jest.fn().mockReturnValue(mockDialogRef);
    jest.spyOn(component, 'openLinkInput');

    const button = fixture.nativeElement.querySelector('#openLink');

    button.click();
    fixture.detectChanges();

    expect(component.openLinkInput).toHaveBeenCalledWith(component.element);
    expect(component.dialog.open).toHaveBeenCalled();
  });

  it('should cancel upload when cancel button is clicked', () => {
    component.element = variNoImage;
    fixture.detectChanges();
    jest.spyOn(component, 'cancelUpload');
    component.helperService.uploadProgersSig.set(50)

    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('#cancelUpload')).nativeElement;
    button.click();

    expect(component.cancelUpload).toHaveBeenCalled();
  });
  function setTestData() {
    vari  = {
      sku: 'asda hs jhasgd h',
      produkt: { id: 1},
      variations_name: 'jhasdgd',
      hint: '',
      value: '21986',
      unit: 'ddhalghsdl',
      image: 'haghsglas',
      price: 1,
      wholesale_price: 0,
      thumbnail: '',
      quanity: 10,
      quanity_sold: 1,
      quanity_sold_at_once: 1
    };
    variNoImage  = {
      sku: 'asda hs jhasgd h',
      produkt: { id: 1},
      variations_name: 'jhasdgd',
      hint: '',
      value: '21986',
      unit: 'ddhalghsdl',
      price: 1,
      wholesale_price: 0,
      thumbnail: '',
      quanity: 10,
      quanity_sold: 1,
      quanity_sold_at_once: 1
    } as iProduktVariations;
  }
});
