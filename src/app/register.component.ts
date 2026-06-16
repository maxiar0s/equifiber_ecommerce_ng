import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DataService, User } from './data.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <main class="auth-page">
      <form class="auth-card" #registerForm="ngForm" [class.was-validated]="registerForm.submitted" novalidate (ngSubmit)="register(registerForm)">
        <span class="eyebrow">Nueva cuenta</span><h1>Registro de usuario</h1>
        <div class="row g-3">
          <div class="col-12 col-md-6"><label class="form-label" for="regName">Nombre</label><input class="form-control" id="regName" name="name" [(ngModel)]="user.name" required minlength="3" pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$"><div class="invalid-feedback">Solo letras, minimo 3 caracteres.</div></div>
          <div class="col-12 col-md-6"><label class="form-label" for="regRut">RUT</label><input class="form-control" id="regRut" name="rut" [(ngModel)]="user.rut" required pattern="^\\d{7,8}-[\\dkK]$" placeholder="12345678-9"><div class="invalid-feedback">Formato valido: 12345678-9.</div></div>
          <div class="col-12"><label class="form-label" for="regEmail">Correo</label><input type="email" class="form-control" id="regEmail" name="email" [(ngModel)]="user.email" required email><div class="invalid-feedback">Ingresa un correo valido.</div></div>
          <div class="col-12 col-md-6"><label class="form-label" for="regPhone">Telefono</label><input class="form-control" id="regPhone" name="phone" [(ngModel)]="user.phone" required pattern="^\\+?56?\\s?9\\s?\\d{4}\\s?\\d{4}$" placeholder="+56 9 1234 5678"><div class="invalid-feedback">Ingresa un telefono chileno valido.</div></div>
          <div class="col-12 col-md-6"><label class="form-label" for="regRole">Tipo de usuario</label><select class="form-select" id="regRole" name="role" [(ngModel)]="user.role" required><option value="">Selecciona...</option><option value="cliente">Cliente</option><option value="centro">Centro ecuestre</option></select><div class="invalid-feedback">Selecciona un tipo.</div></div>
          <div class="col-12"><label class="form-label" for="regPassword">Contrasena</label><input type="password" class="form-control" id="regPassword" name="password" [(ngModel)]="user.password" required minlength="8" maxlength="20" pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,20}"><div class="form-text">Debe tener 8 a 20 caracteres, mayuscula, minuscula, numero y caracter especial.</div><div class="invalid-feedback">La contrasena no cumple las reglas de seguridad.</div></div>
        </div>
        <button class="btn btn-forest w-100 mt-4" type="submit">Crear cuenta</button>
        <a class="d-inline-block mt-3" routerLink="/login">Ya tengo cuenta</a>
        <div class="alert alert-success mt-3" *ngIf="success">Cuenta creada. Ahora puedes iniciar sesion.</div>
        <div class="alert alert-danger mt-3" *ngIf="duplicate">Correo ya registrado.</div>
      </form>
    </main>
  `
})
export class RegisterComponent {
  user: User = this.emptyUser();
  success = false;
  duplicate = false;

  constructor(private data: DataService) {}

  register(form: NgForm): void {
    this.success = false;
    this.duplicate = false;
    if (!form.valid) return;
    const created = this.data.register({ ...this.user, email: this.user.email.trim().toLowerCase(), address: '', horse: '' });
    this.duplicate = !created;
    this.success = created;
    if (created) {
      this.user = this.emptyUser();
      form.resetForm(this.user);
    }
  }

  private emptyUser(): User {
    return { name: '', rut: '', email: '', phone: '', role: '', password: '', address: '', horse: '' };
  }
}
