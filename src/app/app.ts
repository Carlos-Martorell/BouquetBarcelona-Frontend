import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FlowersManagement } from "./features/admin/pages/flowers-management/flowers-management";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FlowersManagement],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('BouquetBarcelona-app');
}
