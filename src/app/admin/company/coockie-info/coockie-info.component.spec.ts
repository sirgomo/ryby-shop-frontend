import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoockieInfoComponent } from './coockie-info.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { HelperService } from 'src/app/helper/helper.service';
import { CompanyService } from '../company.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('CoockieInfoComponent', () => {
  let component: CoockieInfoComponent;
  let fixture: ComponentFixture<CoockieInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoockieInfoComponent, CommonModule, MatDialogModule, MatIconModule, MatButtonModule, RouterModule, HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: jest.fn(),
          }
        },
        CompanyService,
        HelperService
      ],
    });
    fixture = TestBed.createComponent(CoockieInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
