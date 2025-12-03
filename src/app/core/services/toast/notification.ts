import { Injectable, signal } from '@angular/core';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private toastSignal = signal<Toast | null>(null);
  readonly toast = this.toastSignal.asReadonly();

  showSuccess(message: string) {
    this.show(message, 'success');
  }

  showError(message: string) {
    this.show(message, 'error');
  }

  showInfo(message: string) {
    this.show(message, 'info');
  }

  private show(message: string, type: Toast['type']) {
    this.toastSignal.set({ message, type });
    setTimeout(() => this.toastSignal.set(null), 3000);
  }

  clear() {
    this.toastSignal.set(null);
  }
}
