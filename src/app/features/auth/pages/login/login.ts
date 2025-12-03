import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth/auth';
import { NotificationService } from '@core/services/toast/notification';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  loading = signal(false);
  errorMessage = signal('');

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage.set('Por favor, completa todos los campos correctamente');
      return;
    }

    const { email, password } = this.loginForm.value;

    this.loading.set(true);
    this.errorMessage.set('');

    this.authService.login(email!, password!).subscribe({
      next: () => {
        this.notificationService.showSuccess('¡Bienvenido!'); 
        this.router.navigate(['/']); 
      },
      error: err => {
        const message = this.getErrorMessage(err)
        this.errorMessage.set(message);
        this.notificationService.showError(message)
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  private getErrorMessage(error: any): string {
    const message = error?.error?.message || error?.message || '';

    if (message.includes('Invalid credentials') || error.status === 401) {
      return 'Email o contraseña incorrectos';
    }
    if (error.status === 0) {
      return 'Error de conexión. Verifica tu internet';
    }
    return 'Error al iniciar sesión. Inténtalo de nuevo';
  }
}
