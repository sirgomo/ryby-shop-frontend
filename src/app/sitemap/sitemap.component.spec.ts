import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SitemapComponent } from './sitemap.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { beforeEach } from 'node:test';
import { ErrorComponent } from '../error/error.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SitemapService } from './sitemap.service';

describe('SitemapComponent', () => {
  let component: SitemapComponent;
  let fixture: ComponentFixture<SitemapComponent>;
  global.fetch = jest.fn();
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SitemapComponent, MatButtonModule, ErrorComponent, MatCardModule],
      providers: [HttpClientTestingModule, SitemapService],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SitemapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
