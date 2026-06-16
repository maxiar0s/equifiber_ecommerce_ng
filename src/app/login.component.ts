import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DataService } from './data.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <main class="auth-page">
      <form class="auth-card" #loginForm="ngForm" [class.was-validated]="loginForm.submitted" novalidate (ngSubmit)="login(loginForm)">
        <span class="eyebrow">Acceso</span><h1>Inicio de sesion</h1>
        <p>Usa <strong>admin@equifiber.cl</strong> / <strong>Admin123!</strong> para administrador.</p>
        <div class="mb-3"><label class="form-label" for="loginEmail">Correo</label><input type="email" class="form-control" id="loginEmail" name="email" [(ngModel)]="email" required email><div class="invalid-feedback">Ingresa un correo valido.</div></div>
        <div class="mb-3"><label class="form-label" for="loginPassword">Contrasena</label><input type="password" class="form-control" id="loginPassword" name="password" [(ngModel)]="password" required minlength="8"><div class="invalid-feedback">Ingresa tu contrasena.</div></div>
        <button class="btn btn-forest w-100" type="submit">Ingresar</button>
        <div class="d-flex justify-content-between mt-3"><a routerLink="/registro">Registrarme</a><a routerLink="/recuperar">Recuperar clave</a></div>
        <div class="alert alert-danger mt-3" *ngIf="error">Credenciales incorrectas.</div>
      </form>
    </main>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  error = false;

  constructor(private data: DataService) {}

  login(form: NgForm): void {
    this.error = false;
    if (!form.valid) return;
    this.error = !this.data.login(this.email.trim(), this.password);
  }
}
