import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsBarChart } from './products-bar-chart';

describe('ProductsBarChart', () => {
  let component: ProductsBarChart;
  let fixture: ComponentFixture<ProductsBarChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsBarChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsBarChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
