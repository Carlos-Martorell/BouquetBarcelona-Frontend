import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-flower-card',
  imports: [],
  templateUrl: './flower-card.html',
  styleUrl: './flower-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowerCard {}
