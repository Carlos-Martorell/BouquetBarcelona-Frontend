import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowerForm } from './flower-form';

describe('FlowerForm', () => {
  let component: FlowerForm;
  let fixture: ComponentFixture<FlowerForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlowerForm]
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
