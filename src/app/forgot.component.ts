import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-forgot',
  imports: [CommonModule, FormsModule],
  template: `
    <main class="auth-page">
      <form class="auth-card" #forgotForm="ngForm" [class.was-validated]="forgotForm.submitted" novalidate (ngSubmit)="recover(forgotForm)">
        <span class="eyebrow">Soporte</span><h1>Recuperar contrasena</h1><p>Simularemos el envio de un enlace de recuperacion.</p>
        <label class="form-label" for="forgotEmail">Correo registrado</label><input type="email" class="form-control" id="forgotEmail" name="email" [(ngModel)]="email" required email><div class="invalid-feedback">Ingresa un correo valido.</div>
        <button class="btn btn-forest w-100 mt-4" type="submit">Enviar enlace</button>
        <div class="alert alert-success mt-3" *ngIf="success">Enlace de recuperacion enviado de forma simulada.</div>
      </form>
    </main>
  `
})
export class ForgotComponent {
  email = '';
  success = false;

  recover(form: NgForm): void {
    this.success = form.valid ?? false;
    if (this.success) form.resetForm({ email: '' });
  }
}
