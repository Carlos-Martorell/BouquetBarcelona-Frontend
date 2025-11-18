import { TestBed } from '@angular/core/testing';

import { FlowerForm } from './flower-form';

describe('FlowerForm', () => {
  let service: FlowerForm;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlowerForm);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
