import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowerCard } from './flower-card';

describe('FlowerCard', () => {
  let component: FlowerCard;
  let fixture: ComponentFixture<FlowerCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlowerCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlowerCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
