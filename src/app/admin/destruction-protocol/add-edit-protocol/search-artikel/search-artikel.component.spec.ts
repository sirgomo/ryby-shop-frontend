import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchArtikelComponent } from './search-artikel.component';

describe('SearchArtikelComponent', () => {
  let component: SearchArtikelComponent;
  let fixture: ComponentFixture<SearchArtikelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchArtikelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchArtikelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
