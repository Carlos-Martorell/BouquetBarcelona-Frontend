import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-edit-icon',
  imports: [],
  templateUrl: './edit-icon.html',
  styles: ` 
   :host {
      display: inline-block;
      width: 20px; 
      height: 20px;
    }
    `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditIcon {}
