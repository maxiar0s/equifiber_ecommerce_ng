import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DataService, User } from '../../services/data.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <main class="auth-page">
      <form class="auth-card" [formGroup]="registerForm" [class.was-validated]="submitted" novalidate (ngSubmit)="register()">
        <span class="eyebrow">Nueva cuenta</span><h1>Registro de usuario</h1>
        <div class="row g-3">
          <div class="col-12 col-md-6"><label class="form-label" for="regName">Nombre</label><input class="form-control" id="regName" formControlName="name"><div class="invalid-feedback">Solo letras, minimo 3 caracteres.</div></div>
          <div class="col-12 col-md-6"><label class="form-label" for="regRut">RUT</label><input class="form-control" id="regRut" formControlName="rut" placeholder="12345678-9"><div class="invalid-feedback">Formato valido: 12345678-9.</div></div>
          <div class="col-12"><label class="form-label" for="regEmail">Correo</label><input type="email" class="form-control" id="regEmail" formControlName="email"><div class="invalid-feedback">Ingresa un correo valido.</div></div>
          <div class="col-12 col-md-6"><label class="form-label" for="regPhone">Telefono</label><input class="form-control" id="regPhone" formControlName="phone" placeholder="+56 9 1234 5678"><div class="invalid-feedback">Ingresa un telefono chileno valido.</div></div>
          <div class="col-12 col-md-6"><label class="form-label" for="regBirthDate">Fecha de nacimiento</label><input type="date" class="form-control" id="regBirthDate" formControlName="birthDate"><div class="invalid-feedback">Debes tener al menos 13 anos.</div></div>
          <div class="col-12 col-md-6"><label class="form-label" for="regRole">Tipo de usuario</label><select class="form-select" id="regRole" formControlName="role"><option value="">Selecciona...</option><option value="cliente">Cliente</option><option value="centro">Centro ecuestre</option></select><div class="invalid-feedback">Selecciona un tipo.</div></div>
          <div class="col-12"><label class="form-label" for="regAddress">Direccion de despacho (opcional)</label><input class="form-control" id="regAddress" formControlName="address"><div class="form-text">Puedes completarla mas adelante.</div></div>
          <div class="col-12 col-md-6"><label class="form-label" for="regPassword">Contrasena</label><input type="password" class="form-control" id="regPassword" formControlName="password"><div class="form-text">Debe tener 6 a 18 caracteres, una mayuscula y un numero.</div><div class="invalid-feedback">La contrasena no cumple las reglas de seguridad.</div></div>
          <div class="col-12 col-md-6"><label class="form-label" for="regConfirmPassword">Repetir contrasena</label><input type="password" class="form-control" id="regConfirmPassword" formControlName="confirmPassword"><div class="invalid-feedback">Las contrasenas deben ser iguales.</div></div>
        </div>
        <div class="d-flex gap-2 mt-4"><button class="btn btn-forest flex-fill" type="submit">Crear cuenta</button><button class="btn btn-outline-dark flex-fill" type="button" (click)="clear()">Limpiar</button></div>
        <a class="d-inline-block mt-3" routerLink="/login">Ya tengo cuenta</a>
        <div class="alert alert-success mt-3" *ngIf="success">Cuenta creada. Ahora puedes iniciar sesion.</div>
        <div class="alert alert-danger mt-3" *ngIf="duplicate">Correo ya registrado.</div>
      </form>
    </main>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  success = false;
  duplicate = false;

  constructor(private data: DataService, private fb: FormBuilder) {
    this.registerForm = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/)]],
      rut: ['', [Validators.required, Validators.pattern(/^\d{7,8}-[\dkK]$/)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?56?\s?9\s?\d{4}\s?\d{4}$/)]],
      birthDate: ['', [Validators.required, this.minimumAgeValidator(13)]],
      role: ['', Validators.required],
      address: [''],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(18), Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.samePasswordsValidator });
  }

  register(): void {
    this.submitted = true;
    this.success = false;
    this.duplicate = false;
    if (this.registerForm.invalid) return;
    const value = this.registerForm.getRawValue();
    const user: User = {
      name: value.name.trim(),
      rut: value.rut.trim(),
      email: value.email.trim().toLowerCase(),
      phone: value.phone.trim(),
      role: value.role,
      password: value.password,
      address: value.address.trim(),
      horse: ''
    };
    const created = this.data.register(user);
    this.duplicate = !created;
    this.success = created;
    if (created) {
      this.clear();
    }
  }

  clear(): void {
    this.submitted = false;
    this.registerForm.reset();
  }

  private samePasswordsValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword ? { passwordMismatch: true } : null;
  }

  private minimumAgeValidator(age: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const birthDate = new Date(control.value);
      const today = new Date();
      let currentAge = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) currentAge--;
      return currentAge >= age ? null : { minimumAge: true };
    };
  }
}
