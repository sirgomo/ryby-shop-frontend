import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowUrlopComponent } from './show-urlop.component';
import { iUrlop } from 'src/app/model/iUrlop';

describe('ShowUrlopComponent', () => {
  let component: ShowUrlopComponent;
  let fixture: ComponentFixture<ShowUrlopComponent>;
  let urlop: iUrlop = {
    id: 1,
    is_in_urlop: false,
    urlop_from: new Date('2022'),
    urlop_to: new Date('2021'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowUrlopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowUrlopComponent);
    component = fixture.componentInstance;
    component.urlop = urlop;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
