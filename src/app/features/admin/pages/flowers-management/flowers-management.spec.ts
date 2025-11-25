import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowersManagement } from './flowers-management';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FlowersService } from '@core/services/flowers/flowers';
import { FlowerFormService } from '../../services/flower-form/flower-form';
import { provideHttpClient } from '@angular/common/http';

describe('FlowersManagement', () => {
  let component: FlowersManagement;
  let fixture: ComponentFixture<FlowersManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlowersManagement],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(), 
        FlowersService, 
        FlowerFormService 
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlowersManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
