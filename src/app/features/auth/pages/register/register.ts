import { CommonModule } from '@angular/common';
import {  Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth/auth';
import { NotificationService } from '@core/services/toast/notification';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',

})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  loading = signal(false);
  errorMessage = signal('');

  registerForm = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]], 
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      phone: ['', Validators.minLength(9)], 
    },
    {
      validators: this.passwordMatchValidator,
    }
  );
  private passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.errorMessage.set('Por favor, completa todos los campos correctamente');
      return;
    }

    const { name, email, password, phone } = this.registerForm.value;

    this.loading.set(true);
    this.errorMessage.set('');

    const safePhone = phone ?? undefined;

    this.authService
      .register({ name: name!, email: email!, password: password!, phone: safePhone })
      .subscribe({
        next: () => {
          this.notificationService.showSuccess('¡Cuenta creada! Bienvenido');
          this.router.navigate(['/']); 
        },
        error: err => {
          const message = this.getErrorMessage(err);
          this.errorMessage.set(message);
          this.notificationService.showError(message);  
          this.loading.set(false);
        },
        complete: () => {
          this.loading.set(false);
        },
      });
  }

  private getErrorMessage(error: any): string {
    const message = error?.error?.message || '';

    if (message.includes('Email already registered') || message.includes('already-in-use')) {
      return 'Este email ya está registrado';
    }
    if (message.includes('weak-password')) {
      return 'La contraseña es demasiado débil';
    }
    return 'Error al registrarse. Inténtalo de nuevo';
  }
}
