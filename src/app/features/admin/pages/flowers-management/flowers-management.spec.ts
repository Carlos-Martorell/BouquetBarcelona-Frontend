import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowersManagement } from './flowers-management';

describe('FlowersManagement', () => {
  let component: FlowersManagement;
  let fixture: ComponentFixture<FlowersManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlowersManagement]
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
