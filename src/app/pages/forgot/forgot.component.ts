import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <main class="auth-page">
      <form class="auth-card" [formGroup]="forgotForm" [class.was-validated]="submitted" novalidate (ngSubmit)="recover()">
        <span class="eyebrow">Soporte</span><h1>Recuperar contrasena</h1><p>Simularemos el envio de un enlace de recuperacion.</p>
        <label class="form-label" for="forgotEmail">Correo registrado</label><input type="email" class="form-control" id="forgotEmail" formControlName="email"><div class="invalid-feedback">Ingresa un correo valido.</div>
        <div class="d-flex gap-2 mt-4"><button class="btn btn-forest flex-fill" type="submit">Enviar enlace</button><button class="btn btn-outline-dark flex-fill" type="button" (click)="clear()">Limpiar</button></div>
        <div class="alert alert-success mt-3" *ngIf="success">Enlace de recuperacion enviado de forma simulada.</div>
      </form>
    </main>
  `
})
export class ForgotComponent {
  forgotForm: FormGroup;
  submitted = false;
  success = false;

  constructor(private fb: FormBuilder) {
    this.forgotForm = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  recover(): void {
    this.submitted = true;
    this.success = this.forgotForm.valid;
    if (this.success) this.clear();
  }

  clear(): void {
    this.submitted = false;
    this.forgotForm.reset();
  }
}
