import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowerForm } from './flower-form';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FlowersService } from '@core/services/flowers/flowers';
import { FlowerFormService } from '../../services/flower-form/flower-form';
import { provideHttpClient } from '@angular/common/http';

describe('FlowerForm', () => {
  let component: FlowerForm;
  let fixture: ComponentFixture<FlowerForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlowerForm],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(), 
        FlowersService, 
        FlowerFormService 
      ]
    
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlowerForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
