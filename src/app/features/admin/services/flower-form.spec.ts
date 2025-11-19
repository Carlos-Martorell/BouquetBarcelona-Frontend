import { TestBed } from '@angular/core/testing';

import { FlowerFormService } from './flower-form';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('FlowerForm', () => {
  let service: FlowerFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
       providers: [
        provideHttpClient(),
        provideHttpClientTesting(), 
      ]
    });
    service = TestBed.inject(FlowerFormService);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
