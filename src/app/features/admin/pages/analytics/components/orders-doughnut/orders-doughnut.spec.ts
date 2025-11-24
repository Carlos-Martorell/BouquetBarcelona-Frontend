import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersDoughnut } from './orders-doughnut';

describe('OrdersDoughnut', () => {
  let component: OrdersDoughnut;
  let fixture: ComponentFixture<OrdersDoughnut>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersDoughnut]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersDoughnut);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
