import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapsManagement } from './maps-management';

describe('MapsManagement', () => {
  let component: MapsManagement;
  let fixture: ComponentFixture<MapsManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapsManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapsManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
