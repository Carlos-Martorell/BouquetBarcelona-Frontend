import { TestBed } from '@angular/core/testing';

import { Flowers } from './flowers';

describe('Flowers', () => {
  let service: Flowers;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Flowers);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
