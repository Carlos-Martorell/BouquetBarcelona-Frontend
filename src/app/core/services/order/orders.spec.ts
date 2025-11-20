import { TestBed } from '@angular/core/testing';

import { Orders } from './order/orders';

describe('Orders', () => {
  let service: Orders;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Orders);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
