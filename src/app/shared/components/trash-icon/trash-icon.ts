import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-trash-icon',
  imports: [],
  templateUrl: './trash-icon.html',
  styles: `
    :host {
      display: inline-block;
      width: 20px; 
      height: 20px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrashIcon {}
