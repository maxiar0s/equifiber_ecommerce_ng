import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <main class="auth-page">
      <form class="auth-card" [formGroup]="loginForm" [class.was-validated]="submitted" novalidate (ngSubmit)="login()">
        <span class="eyebrow">Acceso</span><h1>Inicio de sesion</h1>
        <p>Usa <strong>admin@equifiber.cl</strong> / <strong>Admin123!</strong> para administrador.</p>
        <div class="mb-3"><label class="form-label" for="loginEmail">Correo</label><input type="email" class="form-control" id="loginEmail" formControlName="email"><div class="invalid-feedback">Ingresa un correo valido.</div></div>
        <div class="mb-3"><label class="form-label" for="loginPassword">Contrasena</label><input type="password" class="form-control" id="loginPassword" formControlName="password"><div class="invalid-feedback">Ingresa tu contrasena.</div></div>
        <div class="d-flex gap-2"><button class="btn btn-forest flex-fill" type="submit">Ingresar</button><button class="btn btn-outline-dark flex-fill" type="button" (click)="clear()">Limpiar</button></div>
        <div class="d-flex justify-content-between mt-3"><a routerLink="/registro">Registrarme</a><a routerLink="/recuperar">Recuperar clave</a></div>
        <div class="alert alert-danger mt-3" *ngIf="error">Credenciales incorrectas.</div>
      </form>
    </main>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  error = false;

  constructor(private data: DataService, private fb: FormBuilder) {
    this.loginForm = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(18)]]
    });
  }

  login(): void {
    this.submitted = true;
    this.error = false;
    if (this.loginForm.invalid) return;
    const value = this.loginForm.getRawValue();
    this.error = !this.data.login(value.email.trim(), value.password);
  }

  clear(): void {
    this.submitted = false;
    this.error = false;
    this.loginForm.reset();
  }
}
