import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService, User } from '../../services/data.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <main class="container py-5" *ngIf="user">
      <form class="panel profile-panel" [formGroup]="profileForm" [class.was-validated]="submitted" novalidate (ngSubmit)="save()">
        <span class="eyebrow">Cuenta</span><h1>Modificacion de perfil</h1>
        <div class="row g-3">
          <div class="col-12 col-md-6"><label class="form-label" for="profileName">Nombre</label><input class="form-control" id="profileName" formControlName="name"><div class="invalid-feedback">Minimo 3 caracteres.</div></div>
          <div class="col-12 col-md-6"><label class="form-label" for="profilePhone">Telefono</label><input class="form-control" id="profilePhone" formControlName="phone"><div class="invalid-feedback">Telefono invalido.</div></div>
          <div class="col-12"><label class="form-label" for="profileAddress">Direccion principal (opcional)</label><input class="form-control" id="profileAddress" formControlName="address"><div class="form-text">La direccion de despacho es opcional.</div></div>
          <div class="col-12"><label class="form-label" for="profileHorse">Caballo / centro asociado</label><input class="form-control" id="profileHorse" formControlName="horse"><div class="invalid-feedback">Campo obligatorio.</div></div>
        </div>
        <div class="d-flex gap-2 mt-4"><button class="btn btn-forest" type="submit">Guardar cambios</button><button class="btn btn-outline-dark" type="button" (click)="clear()">Limpiar</button></div>
        <div class="alert alert-success mt-3" *ngIf="success">Perfil actualizado.</div>
        <div class="alert alert-danger mt-3" *ngIf="apiError">No se pudo actualizar el perfil en Firebase.</div>
      </form>
    </main>
  `
})
export class ProfileComponent {
  user?: User;
  profileForm: FormGroup;
  submitted = false;
  success = false;
  apiError = false;

  constructor(private data: DataService, private fb: FormBuilder) {
    this.profileForm = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?56?\s?9\s?\d{4}\s?\d{4}$/)]],
      address: [''],
      horse: ['', [Validators.required, Validators.minLength(2)]]
    });
    this.user = data.users.find((item) => item.email === data.session?.email);
    this.clear();
  }

  save(): void {
    this.submitted = true;
    this.success = false;
    this.apiError = false;
    if (!this.user || this.profileForm.invalid) return;
    Object.assign(this.user, this.profileForm.getRawValue());
    this.data.saveUser(this.user).subscribe({
      next: () => {
        this.success = true;
      },
      error: () => this.apiError = true
    });
  }

  clear(): void {
    this.submitted = false;
    this.success = false;
    this.apiError = false;
    this.profileForm.reset({
      name: this.user?.name ?? '',
      phone: this.user?.phone ?? '',
      address: this.user?.address ?? '',
      horse: this.user?.horse ?? ''
    });
  }
}
